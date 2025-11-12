interface EmptyStateProps {
  description: string;
  actionLabel: string;
  actionPath: string;
}

export default function EmptyState({ description, actionLabel, actionPath }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="inline-block px-6 py-3 rounded-lg bg-primary text-primary font-semibold hover:bg-primary-hover transition-colors">
        {actionLabel}
      </button>
    </div>
  );
}
