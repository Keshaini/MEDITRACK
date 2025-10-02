import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">
                Your Health, <span className="text-primary">Tracked</span> & <span className="text-primary">Managed</span>
              </h1>
              <p className="hero-description">
                Meditrack helps you manage your health records, track daily vitals, 
                and connect with healthcare professionals - all in one place.
              </p>
              <div className="hero-buttons">
                {!user ? (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg me-3">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn btn-outline-primary btn-lg">
                      Login
                    </Link>
                  </>
                ) : (
                  <Link 
                    to={user.role === 'patient' ? '/patient/dashboard' : '/admin/dashboard'} 
                    className="btn btn-primary btn-lg"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <div className="hero-illustration">
                  🏥
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Why Choose Meditrack?</h2>
            <p>Comprehensive healthcare management at your fingertips</p>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Health Log Tracking</h3>
                <p>
                  Record and monitor your daily vitals including blood pressure, 
                  heart rate, temperature, and more.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">📋</div>
                <h3>Medical History</h3>
                <p>
                  Maintain a complete digital record of your medical history, 
                  medications, allergies, and treatments.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">👨‍⚕️</div>
                <h3>Doctor Management</h3>
                <p>
                  Connect with healthcare professionals and manage your 
                  doctor-patient relationships efficiently.
                </p>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure & Private</h3>
                <p>
                  Your health data is encrypted and protected with industry-standard 
                  security measures.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Easy Access</h3>
                <p>
                  Access your health information anytime, anywhere from any device 
                  with internet connection.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>Health Insights</h3>
                <p>
                  Get insights and trends from your health data to make informed 
                  decisions about your wellbeing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>How It Works</h2>
            <p>Getting started is easy</p>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">1</div>
                <h4>Sign Up</h4>
                <p>Create your free Meditrack account in minutes</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">2</div>
                <h4>Add Information</h4>
                <p>Enter your medical history and health data</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">3</div>
                <h4>Track Daily</h4>
                <p>Log your vitals and symptoms regularly</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="step-card">
                <div className="step-number">4</div>
                <h4>Stay Healthy</h4>
                <p>Monitor trends and stay on top of your health</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to Take Control of Your Health?</h2>
          <p>Join thousands of users who trust Meditrack for their healthcare management</p>
          {!user && (
            <Link to="/register" className="btn btn-light btn-lg">
              Get Started Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;