import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

const PrivacyPolicy = () => {
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
              <Shield className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: October 5, 2025</p>
          </div>

          {/* Introduction */}
          <div className="mb-8 p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">
              At MediTrack, we are committed to protecting your privacy and ensuring the security of your personal 
              and medical information. This Privacy Policy explains how we collect, use, store, and protect your data 
              when you use our healthcare management platform.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">1.</span>
                <span>Information We Collect</span>
              </h2>
              <div className="pl-8 space-y-4 text-gray-700">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center space-x-2">
                    <UserCheck className="text-blue-500" size={18} />
                    <span>Personal Information:</span>
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Full name (first and last name)</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Date of birth</li>
                    <li>Gender</li>
                    <li>Physical address</li>
                    <li>Emergency contact information</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center space-x-2">
                    <Database className="text-purple-500" size={18} />
                    <span>Medical Information (for Patients):</span>
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Blood group</li>
                    <li>Health logs and medical history</li>
                    <li>Medication records</li>
                    <li>Appointment information</li>
                    <li>Doctor consultations and feedback</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center space-x-2">
                    <UserCheck className="text-blue-500" size={18} />
                    <span>Professional Information (for Doctors):</span>
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Medical specialization</li>
                    <li>License number and credentials</li>
                    <li>Professional qualifications</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center space-x-2">
                    <Eye className="text-gray-500" size={18} />
                    <span>Usage Information:</span>
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Login activity and timestamps</li>
                    <li>IP address and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Pages visited and features used</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">2.</span>
                <span>How We Use Your Information</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">Account Management:</span> To create and manage your user account</li>
                  <li><span className="font-semibold">Service Delivery:</span> To provide healthcare management features and functionality</li>
                  <li><span className="font-semibold">Communication:</span> To send important notifications, updates, and support messages</li>
                  <li><span className="font-semibold">Doctor-Patient Connection:</span> To facilitate communication between patients and healthcare providers</li>
                  <li><span className="font-semibold">Platform Improvement:</span> To analyze usage patterns and improve our services</li>
                  <li><span className="font-semibold">Security:</span> To detect and prevent fraud, abuse, and unauthorized access</li>
                  <li><span className="font-semibold">Legal Compliance:</span> To comply with applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">3.</span>
                <span>Data Security</span>
              </h2>
              <div className="pl-8 space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  We implement industry-standard security measures to protect your data:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="text-green-600" size={20} />
                      <h3 className="font-semibold">Encryption</h3>
                    </div>
                    <p className="text-sm">All data transmitted between your device and our servers is encrypted using SSL/TLS protocols</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Database className="text-blue-600" size={20} />
                      <h3 className="font-semibold">Secure Storage</h3>
                    </div>
                    <p className="text-sm">Medical data is stored in encrypted databases with restricted access controls</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <UserCheck className="text-purple-600" size={20} />
                      <h3 className="font-semibold">Access Control</h3>
                    </div>
                    <p className="text-sm">Role-based access ensures only authorized users can view specific information</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="text-red-600" size={20} />
                      <h3 className="font-semibold">Monitoring</h3>
                    </div>
                    <p className="text-sm">Continuous monitoring for suspicious activity and security threats</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">4.</span>
                <span>Information Sharing</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed font-semibold">We do NOT sell your personal or medical information to third parties.</p>
                <p className="leading-relaxed">We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><span className="font-semibold">With Healthcare Providers:</span> Patient information is shared with assigned doctors for medical consultation and treatment</li>
                  <li><span className="font-semibold">With Your Consent:</span> When you explicitly authorize us to share information</li>
                  <li><span className="font-semibold">Legal Requirements:</span> When required by law, court order, or government regulations</li>
                  <li><span className="font-semibold">Emergency Situations:</span> To protect health and safety in emergency circumstances</li>
                  <li><span className="font-semibold">Service Providers:</span> With trusted third-party service providers who assist in platform operations (under strict confidentiality agreements)</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">5.</span>
                <span>Your Rights and Choices</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">You have the following rights regarding your data:</p>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">✓ Access:</p>
                    <p className="text-sm">Request access to your personal and medical information</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">✓ Correction:</p>
                    <p className="text-sm">Update or correct inaccurate information in your profile</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">✓ Deletion:</p>
                    <p className="text-sm">Request deletion of your account and associated data (subject to legal retention requirements)</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">✓ Data Portability:</p>
                    <p className="text-sm">Request a copy of your data in a machine-readable format</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">✓ Opt-Out:</p>
                    <p className="text-sm">Unsubscribe from marketing communications (account-related communications will continue)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">6.</span>
                <span>Data Retention</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  We retain your information for as long as your account is active or as needed to provide services. 
                  Medical records may be retained for longer periods as required by healthcare regulations and legal obligations.
                </p>
                <p className="leading-relaxed">
                  When you delete your account, we will delete or anonymize your personal information within 90 days, 
                  except where retention is required by law.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">7.</span>
                <span>Cookies and Tracking</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, remember your preferences, 
                  and analyze platform usage. You can control cookie settings through your browser, but some features 
                  may not function properly if cookies are disabled.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">8.</span>
                <span>Children's Privacy</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  MediTrack is not intended for children under 13 years of age. We do not knowingly collect personal 
                  information from children under 13. If you believe we have collected information from a child under 13, 
                  please contact us immediately.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">9.</span>
                <span>International Data Transfers</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Your information may be transferred to and processed in countries other than Sri Lanka. 
                  We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">10.</span>
                <span>Changes to This Policy</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                  We will notify you of significant changes via email or platform notification. The "Last Updated" date at the 
                  top of this policy indicates when it was last revised.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-primary-500">11.</span>
                <span>Contact Us</span>
              </h2>
              <div className="pl-8 space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">MediTrack Privacy Team</p>
                  <p>Email: privacy@meditrack.com</p>
                  <p>Phone: +94 11 234 5678</p>
                  <p>Address: Colombo, Sri Lanka</p>
                </div>
              </div>
            </section>
          </div>

          {/* Important Notice */}
          <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
              <div className="text-gray-700">
                <p className="font-semibold mb-2">Your Privacy Matters</p>
                <p className="text-sm leading-relaxed">
                  We are committed to protecting your privacy and maintaining the confidentiality of your medical information. 
                  If you have any concerns about how your data is being handled, please do not hesitate to contact us.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <Link
                to="/terms"
                className="text-primary-500 hover:text-primary-600 font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <Shield size={20} />
                <span>View Terms of Service</span>
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

export default PrivacyPolicy;