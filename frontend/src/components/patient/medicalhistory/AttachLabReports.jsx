import React, { useState } from 'react';
import { Upload, File, X, Check, AlertCircle, FileText, Image as ImageIcon, Loader } from 'lucide-react';

const AttachLabReports = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [reportType, setReportType] = useState('lab_report');
  const [reportDate, setReportDate] = useState('');
  const [notes, setNotes] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }))]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }
    if (!reportDate) {
      alert('Please select report date');
      return;
    }

    setUploading(true);
    const token = localStorage.getItem('token');

    for (const fileObj of files) {
      try {
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('reportType', reportType);
        formData.append('reportDate', reportDate);
        formData.append('notes', notes);

        const response = await fetch('http://localhost:5000/api/medical-history/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (response.ok) {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, status: 'success' } : f
          ));
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, status: 'error' } : f
          ));
        }
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));
      }
    }

    setUploading(false);
    setTimeout(() => {
      const allSuccess = files.every(f => f.status === 'success');
      if (allSuccess) {
        window.location.href = '/patient/medical-history';
      }
    }, 1000);
  };

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-600" />;
    }
    return <ImageIcon className="h-8 w-8 text-blue-600" />;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Lab Reports</h1>
          <p className="text-gray-600">Upload medical documents, lab reports, and test results</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Report Details */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="lab_report">Lab Report</option>
                <option value="xray">X-Ray</option>
                <option value="mri">MRI Scan</option>
                <option value="ct_scan">CT Scan</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="blood_test">Blood Test</option>
                <option value="prescription">Prescription</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Date *</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Add any additional notes about this report..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop files here
            </p>
            <p className="text-sm text-gray-600 mb-4">
              or click to browse (PDF, JPG, PNG - Max 10MB each)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-3">
                {files.map(fileObj => (
                  <div key={fileObj.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      {getFileIcon(fileObj.file)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileObj.file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      {getStatusIcon(fileObj.status)}
                    </div>
                    {fileObj.status === 'pending' && !uploading && (
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => window.location.href = '/patient/medical-history'}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={uploadFiles}
              disabled={uploading || files.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {uploading && <Loader className="h-5 w-5 animate-spin" />}
              <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachLabReports;