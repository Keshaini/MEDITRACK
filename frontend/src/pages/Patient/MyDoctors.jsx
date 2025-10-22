import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Stethoscope, Calendar } from 'lucide-react';
import axios from 'axios';

const MyDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDoctors();
  }, []);

  const fetchMyDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/doctor/assigned`, { headers });{
        headers: { Authorization : `Bearer ${token}` }
      }
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Doctors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-100 rounded-full p-4">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Assigned: {new Date(doctor.assignedDate).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={() => window.location.href = `/patient/doctor/${doctor.id}`} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDoctors;