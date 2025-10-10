import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Key, Check, X, Copy, RefreshCw, AlertCircle } from 'lucide-react';

const TwoFactorAuth = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  useEffect(() => {
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/2fa/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIs2FAEnabled(data.enabled);
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const generate2FA = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/2fa/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
        setSecretKey(data.secret);
        setStep(2);
      } else {
        setError('Failed to generate 2FA setup. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        setStep(3);
        setSuccess('Two-Factor Authentication enabled successfully!');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable Two-Factor Authentication?')) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setIs2FAEnabled(false);
        setSuccess('Two-Factor Authentication has been disabled.');
        setStep(1);
      } else {
        setError('Failed to disable 2FA. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    setSuccess('Secret key copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const copyBackupCodes = () => {
    const codes = backupCodes.join('\n');
    navigator.clipboard.writeText(codes);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 3000);
  };

  const downloadBackupCodes = () => {
    const codes = backupCodes.join('\n');
    const blob = new Blob([codes], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meditrack-backup-codes.txt';
    a.click();
  };

  if (is2FAEnabled && step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h1>
              <p className="text-gray-600">Your account is protected with 2FA</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Check className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">2FA is Active</p>
                    <p className="text-sm text-green-700">Your account has an extra layer of security</p>
                  </div>
                </div>
              </div>

              <button
                onClick={disable2FA}
                disabled={loading}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : 'Disable Two-Factor Authentication'}
              </button>

              <button
                onClick={() => window.location.href = '/settings'}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enable Two-Factor Authentication</h1>
            <p className="text-gray-600">Add an extra layer of security to your account</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`h-1 w-20 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-600">Setup</span>
              <span className="text-gray-600">Verify</span>
              <span className="text-gray-600">Backup</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What is Two-Factor Authentication?</h3>
                <p className="text-gray-600 mb-4">
                  Two-Factor Authentication adds an extra layer of security to your account. In addition to your password,
                  you'll need to enter a code from your authenticator app to sign in.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Enhanced Security</p>
                      <p className="text-sm text-gray-600">Protect your account from unauthorized access</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Mobile App Required</p>
                      <p className="text-sm text-gray-600">Use Google Authenticator, Authy, or similar apps</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Backup Codes</p>
                      <p className="text-sm text-gray-600">Get recovery codes in case you lose access to your device</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={generate2FA}
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Generating...' : 'Start Setup'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code</h3>
              <p className="text-gray-600 mb-6">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
                {qrCode ? (
                  <img src={qrCode} alt="QR Code" className="mx-auto w-64 h-64" />
                ) : (
                  <div className="w-64 h-64 mx-auto bg-gray-200 rounded flex items-center justify-center">
                    <RefreshCw className="h-12 w-12 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Or enter this code manually:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={secretKey}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={copySecretKey}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Copy className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">Enter the 6-digit code from your authenticator app</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={verify2FA}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Verifying...' : 'Verify and Continue'}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2FA Enabled Successfully!</h3>
                <p className="text-gray-600">Save your backup codes in a secure location</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Important: Save These Backup Codes</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Use these codes if you lose access to your authenticator app. Each code can only be used once.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-3 font-mono text-sm">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="px-4 py-2 bg-white border border-gray-300 rounded text-center">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={downloadBackupCodes}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Key className="h-5 w-5" />
                  <span>Download Backup Codes</span>
                </button>
                <button
                  onClick={copyBackupCodes}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Copy className="h-5 w-5" />
                  <span>{copiedBackup ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;