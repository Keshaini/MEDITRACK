import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Back to Registration</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4">
              <FileText className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-600">Last Updated: October 5, 2025</p>
          </div>

          {/* Introduction */}
          <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">
              Welcome to MediTrack. These Terms of Service govern your use of our healthcare management platform. 
              By creating an account and using our services, you agree to be bound by these terms. Please read them carefully.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">1.</span>
                <span>Acceptance of Terms</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  By accessing or using MediTrack's services, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
                <p className="leading-relaxed">
                  If you do not agree to these terms, you must not use our services and should discontinue 
                  access immediately.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">2.</span>
                <span>User Accounts and Roles</span>
              </h2>
              <div className="pl-8 space-y-4 text-gray-700">
                <p className="leading-relaxed">MediTrack offers three types of user accounts:</p>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <span className="font-semibold">Patient Accounts:</span> For individuals managing their personal health records, 
                      medical history, and appointments.
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <span className="font-semibold">Doctor Accounts:</span> For licensed medical professionals providing 
                      medical feedback and monitoring patient health records. Doctors must provide valid credentials.
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <span className="font-semibold">Admin Accounts:</span> For authorized personnel managing the platform, 
                      users, and system operations.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">3.</span>
                <span>User Responsibilities</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed font-semibold">You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access to your account</li>
                  <li>Use the platform only for lawful purposes</li>
                  <li>Not share your account with others</li>
                  <li>Keep your contact information up to date</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">4.</span>
                <span>Medical Information Disclaimer</span>
              </h2>
              <div className="pl-8 space-y-3">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="text-yellow-600 mt-1 flex-shrink-0" size={20} />
                    <div className="text-gray-700">
                      <p className="font-semibold mb-2">Important Medical Disclaimer:</p>
                      <ul className="space-y-2 text-sm">
                        <li>• MediTrack is a health management tool and does not provide medical advice</li>
                        <li>• Information on the platform is for informational purposes only</li>
                        <li>• Always consult qualified healthcare professionals for medical decisions</li>
                        <li>• In case of emergency, contact local emergency services immediately</li>
                        <li>• Do not rely solely on MediTrack for critical health decisions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">5.</span>
                <span>Doctor Verification</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Healthcare professionals registering as doctors must provide valid medical license credentials. 
                  MediTrack reserves the right to verify credentials and may suspend or terminate accounts with 
                  invalid or fraudulent information.
                </p>
                <p className="leading-relaxed">
                  Doctors agree to maintain professional standards and comply with applicable medical regulations 
                  and ethics guidelines.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">6.</span>
                <span>Privacy and Data Protection</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Your privacy is important to us. Please review our{' '}
                  <Link to="/privacy" className="text-primary-500 hover:underline font-semibold">
                    Privacy Policy
                  </Link>{' '}
                  to understand how we collect, use, and protect your personal and medical information.
                </p>
                <p className="leading-relaxed">
                  We implement industry-standard security measures to protect your data, but cannot guarantee 
                  absolute security. You are responsible for maintaining the confidentiality of your account.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">7.</span>
                <span>Prohibited Activities</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed font-semibold">You must not:</p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <XCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                    <span>Use the platform for any illegal or unauthorized purpose</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                    <span>Attempt to gain unauthorized access to other accounts or systems</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                    <span>Interfere with or disrupt the platform's functionality</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                    <span>Upload malicious code, viruses, or harmful content</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                    <span>Misrepresent your identity or credentials</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                    <span>Share or sell access to your account</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8 - Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">8.</span>
                <span>Contact Information</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  If you have questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">MediTrack Support</p>
                  <p>Email: support@meditrack.com</p>
                  <p>Phone: +94 11 234 5678</p>
                  <p>Address: Colombo, Sri Lanka</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <Link
                to="/privacy"
                className="text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <Shield size={20} />
                <span>View Privacy Policy</span>
              </Link>
              
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Back to Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};