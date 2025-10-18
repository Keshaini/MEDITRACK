import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Weight, 
  Calendar,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const HealthLogCard = ({ log, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get heart rate status (normal, high, low)
  const getHeartRateStatus = (rate) => {
    if (!rate) return { status: 'unknown', color: 'gray', icon: Minus };
    if (rate >= 60 && rate <= 100) return { status: 'normal', color: 'green', icon: Activity };
    if (rate > 100) return { status: 'high', color: 'red', icon: TrendingUp };
    return { status: 'low', color: 'yellow', icon: TrendingDown };
  };

  // Get temperature status
  const getTempStatus = (temp) => {
    if (!temp) return { status: 'unknown', color: 'gray' };
    if (temp >= 97 && temp <= 99) return { status: 'normal', color: 'green' };
    if (temp > 99) return { status: 'fever', color: 'red' };
    return { status: 'low', color: 'blue' };
  };

  const heartRateStatus = getHeartRateStatus(log.heartRate);
  const tempStatus = getTempStatus(log.temperature);
  const HeartRateIcon = heartRateStatus.icon;

  const handleEdit = () => {
    navigate(`/patient/edit-health-log/${log._id}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this health log?')) {
      onDelete(log._id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-primary-500">
      {/* Header with Date and Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar size={18} />
          <span className="text-sm font-medium">{formatDate(log.date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Heart className="text-red-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Blood Pressure</p>
            <p className="text-lg font-bold text-gray-900">
              {log.bloodPressure || 'N/A'}
            </p>
          </div>
        </div>

        {/* Heart Rate */}
        <div className={`flex items-center space-x-3 p-3 bg-${heartRateStatus.color}-50 rounded-lg`}>
          <div className={`w-10 h-10 bg-${heartRateStatus.color}-100 rounded-full flex items-center justify-center`}>
            <HeartRateIcon className={`text-${heartRateStatus.color}-600`} size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Heart Rate</p>
            <p className="text-lg font-bold text-gray-900">
              {log.heartRate ? `${log.heartRate} bpm` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Temperature */}
        <div className={`flex items-center space-x-3 p-3 bg-${tempStatus.color}-50 rounded-lg`}>
          <div className={`w-10 h-10 bg-${tempStatus.color}-100 rounded-full flex items-center justify-center`}>
            <Thermometer className={`text-${tempStatus.color}-600`} size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Temperature</p>
            <p className="text-lg font-bold text-gray-900">
              {log.temperature ? `${log.temperature}°F` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Weight */}
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Weight className="text-purple-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Weight</p>
            <p className="text-lg font-bold text-gray-900">
              {log.weight ? `${log.weight} kg` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Notes (if any) */}
      {log.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-1">Notes:</p>
          <p className="text-sm text-gray-700">{log.notes}</p>
        </div>
      )}

      {/* Health Status Indicators */}
      <div className="mt-4 flex items-center space-x-2">
        {heartRateStatus.status === 'normal' && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            ✓ Normal Heart Rate
          </span>
        )}
        {heartRateStatus.status === 'high' && (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            ⚠ High Heart Rate
          </span>
        )}
        {heartRateStatus.status === 'low' && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            ⚠ Low Heart Rate
          </span>
        )}
        {tempStatus.status === 'fever' && (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            🌡️ Fever Detected
          </span>
        )}
      </div>
    </div>
  );
};

export default HealthLogCard;