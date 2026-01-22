export default function MockTestCard({ test, onStart }) {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      BEGINNER: 'bg-green-100 text-green-800',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
      ADVANCED: 'bg-orange-100 text-orange-800',
      EXPERT: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      TECHNICAL: '💻',
      APTITUDE: '🧮',
      BEHAVIORAL: '🗣️',
      DOMAIN_SPECIFIC: '📚',
      CODING: '⌨️',
    };
    return icons[category] || '📝';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl">{getCategoryIcon(test.category)}</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {test.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {test.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
          {test.difficulty}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {test.category}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{test.totalQuestions}</div>
          <div className="text-xs text-gray-600">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{test.duration}</div>
          <div className="text-xs text-gray-600">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{test.passingScore}%</div>
          <div className="text-xs text-gray-600">Passing</div>
        </div>
      </div>

      {test.tags && test.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {test.tags.slice(0, 4).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {test.attemptCount || 0} attempts
        </div>
        <button
          onClick={() => onStart && onStart(test)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Start Test
        </button>
      </div>
    </div>
  );
}
