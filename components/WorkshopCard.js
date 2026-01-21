export default function WorkshopCard({ workshop, onEnroll, isEnrolled }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      ONGOING: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const availableSeats = workshop.availableSeats !== undefined 
    ? workshop.availableSeats 
    : workshop.capacity - (workshop.enrollmentCount || 0);

  const isFull = availableSeats <= 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workshop.status)}`}>
            {workshop.status}
          </span>
          <span className="text-sm text-gray-600">
            {availableSeats} / {workshop.capacity} seats
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {workshop.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {workshop.description}
        </p>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">👨‍🏫 Instructor:</span>
          <span>{workshop.instructor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">📅 Scheduled:</span>
          <span>{formatDate(workshop.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">⏱️ Duration:</span>
          <span>{workshop.duration} minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">📚 Category:</span>
          <span>{workshop.category}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        {isEnrolled ? (
          <button
            disabled
            className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium cursor-not-allowed"
          >
            ✓ Enrolled
          </button>
        ) : isFull ? (
          <button
            disabled
            className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium cursor-not-allowed"
          >
            Full
          </button>
        ) : workshop.status !== 'SCHEDULED' ? (
          <button
            disabled
            className="w-full px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium cursor-not-allowed"
          >
            Not Available
          </button>
        ) : (
          <button
            onClick={() => onEnroll && onEnroll(workshop)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );
}
