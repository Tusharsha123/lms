export default function ApplicationStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⏳',
      },
      REVIEWING: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-800',
        icon: '👁️',
      },
      SHORTLISTED: {
        label: 'Shortlisted',
        color: 'bg-purple-100 text-purple-800',
        icon: '⭐',
      },
      ACCEPTED: {
        label: 'Accepted',
        color: 'bg-green-100 text-green-800',
        icon: '✓',
      },
      REJECTED: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800',
        icon: '✗',
      },
      WITHDRAWN: {
        label: 'Withdrawn',
        color: 'bg-gray-100 text-gray-800',
        icon: '↩',
      },
    };
    return configs[status] || configs.PENDING;
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
