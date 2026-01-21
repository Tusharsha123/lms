export default function InternshipCard({ internship, onApply }) {
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getLocationTypeColor = (type) => {
    const colors = {
      REMOTE: 'bg-green-100 text-green-800',
      ONSITE: 'bg-blue-100 text-blue-800',
      HYBRID: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {internship.company?.logo && (
            <img 
              src={internship.company.logo} 
              alt={internship.company.name}
              className="w-12 h-12 rounded object-cover"
            />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {internship.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">{internship.company?.name}</span>
              {internship.company?.verified && (
                <span className="text-blue-500" title="Verified Company">✓</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLocationTypeColor(internship.locationType)}`}>
          {internship.locationType}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {internship.type.replace('_', ' ')}
        </span>
        {internship.duration && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {internship.duration}
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">
        {internship.description}
      </p>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Location:</span> {internship.location}
        </p>
        {internship.stipend && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Stipend:</span> {internship.stipend}
          </p>
        )}
        {internship.deadline && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Apply by:</span> {formatDate(internship.deadline)}
          </p>
        )}
      </div>

      {internship.skills && internship.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {internship.skills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
              >
                {skill}
              </span>
            ))}
            {internship.skills.length > 5 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{internship.skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {internship.applicationCount || 0} applications
        </div>
        <button
          onClick={() => onApply && onApply(internship)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}
