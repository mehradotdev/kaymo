import { format } from "date-fns";
import { Id } from "../../convex/_generated/dataModel";

interface StatusBadgeProps {
  status: "pending" | "posted" | "failed" | "cancelled";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    posted: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface CastCardProps {
  cast: {
    _id: Id<"scheduledCasts">;
    content: string;
    imageUrl?: string;
    scheduledTime: number;
    timezone: string;
    status: "pending" | "posted" | "failed" | "cancelled";
    errorMessage?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function CastCard({ cast, onEdit, onDelete, isDeleting }: CastCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-gray-800 mb-2">{cast.content}</p>
          {cast.imageUrl && (
            <div className="mb-2">
              <span className="text-sm text-gray-500">📷 Image attached</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span>📅 {format(new Date(cast.scheduledTime), "MMM dd, yyyy")}</span>
            <span>🕐 {format(new Date(cast.scheduledTime), "hh:mm a")}</span>
            <span>🌍 {cast.timezone}</span>
          </div>
        </div>
        <div>
          <StatusBadge status={cast.status} />
        </div>
      </div>

      {cast.status === "failed" && cast.errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {cast.errorMessage}
          </p>
        </div>
      )}

      {cast.status === "pending" && (onEdit || onDelete) && (
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
