import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, FileText, Users, Shield, Clock, Smartphone, TrendingUp, Lock } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Health, <span className="text-yellow-300">Tracked</span> & <span className="text-yellow-300">Managed</span>
              </h1>
              <p className="text-xl text-primary-100">
                Meditrack helps you manage your health records, track daily vitals, 
                and connect with healthcare professionals - all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                {!user ? (
                  <>
                    <Link
                      to="/register"
                      className="px-8 py-4 bg-white text-primary-500 font-bold rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary-500 transition-all duration-300"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <Link
                    to={user.role === 'patient' ? '/patient/dashboard' : '/admin/dashboard'}
                    className="px-8 py-4 bg-white text-primary-500 font-bold rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="text-9xl animate-bounce">
                🏥
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Meditrack?</h2>
            <p className="text-xl text-gray-600">Comprehensive healthcare management at your fingertips</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="text-primary-500" size={40} />,
                title: 'Health Log Tracking',
                description: 'Record and monitor your daily vitals including blood pressure, heart rate, temperature, and more.'
              },
              {
                icon: <FileText className="text-primary-500" size={40} />,
                title: 'Medical History',
                description: 'Maintain a complete digital record of your medical history, medications, allergies, and treatments.'
              },
              {
                icon: <Users className="text-primary-500" size={40} />,
                title: 'Doctor Management',
                description: 'Connect with healthcare professionals and manage your doctor-patient relationships efficiently.'
              },
              {
                icon: <Lock className="text-primary-500" size={40} />,
                title: 'Secure & Private',
                description: 'Your health data is encrypted and protected with industry-standard security measures.'
              },
              {
                icon: <Smartphone className="text-primary-500" size={40} />,
                title: 'Easy Access',
                description: 'Access your health information anytime, anywhere from any device with internet connection.'
              },
              {
                icon: <TrendingUp className="text-primary-500" size={40} />,
                title: 'Health Insights',
                description: 'Get insights and trends from your health data to make informed decisions about your wellbeing.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-primary-500"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Getting started is easy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '1', title: 'Sign Up', description: 'Create your free Meditrack account in minutes' },
              { number: '2', title: 'Add Information', description: 'Enter your medical history and health data' },
              { number: '3', title: 'Track Daily', description: 'Log your vitals and symptoms regularly' },
              { number: '4', title: 'Stay Healthy', description: 'Monitor trends and stay on top of your health' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                  {step.number}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of users who trust Meditrack for their healthcare management
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-primary-500 font-bold rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;