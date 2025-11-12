import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id } from "~/convex/_generated/dataModel";
import CastForm from "~/components/CastForm";
import CastCard from "~/components/CastCard";
import EmptyState from "~/components/EmptyState";
import LoadingSpinner from "~/components/LoadingSpinner";
import { useImageUpload } from "~/hooks/useImageUpload";
import { validateScheduledTime } from "~/utils/validation";

type PastCastsFilter = "all" | "posted" | "cancelled";

export default function ScheduledCastsPage() {
  const casts = useQuery(api.casts.getScheduledCasts);
  const deleteCast = useMutation(api.casts.deleteCast);
  const updateCast = useMutation(api.casts.updateCast);
  const { uploadImage, isUploading } = useImageUpload();

  const [deletingId, setDeletingId] = useState<Id<"scheduledCasts"> | null>(
    null
  );
  const [editingId, setEditingId] = useState<Id<"scheduledCasts"> | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pastCastsFilter, setPastCastsFilter] =
    useState<PastCastsFilter>("all");

  const editingCast = casts?.find((c) => c._id === editingId);

  const now = Date.now();
  const upcomingCasts =
    casts
      ?.filter((cast) => cast.scheduledTime > now && cast.status === "pending")
      .sort((a, b) => a.scheduledTime - b.scheduledTime) || [];

  const allPastCasts =
    casts
      ?.filter((cast) => cast.scheduledTime <= now || cast.status !== "pending")
      .sort((a, b) => b.scheduledTime - a.scheduledTime) || [];

  const pastCasts = allPastCasts.filter((cast) => {
    if (pastCastsFilter === "all") return true;
    return cast.status === pastCastsFilter;
  });

  const handleEdit = (castId: Id<"scheduledCasts">) => {
    setEditingId(castId);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateCast = async (data: {
    content: string;
    imageFile: File | null;
    scheduledDate: string;
    scheduledTime: string;
    timezone: string;
    removeImage: boolean;
  }) => {
    if (!editingId) return;

    setIsUpdating(true);

    try {
      let imageUrl: string | undefined;

      if (data.imageFile) {
        imageUrl = await uploadImage(data.imageFile);
      } else if (!data.removeImage && editingCast?.imageUrl) {
        imageUrl = editingCast.imageUrl;
      }

      const { timestamp, error } = validateScheduledTime(
        data.scheduledDate,
        data.scheduledTime
      );
      if (error) {
        toast.error(error);
        return;
      }

      await updateCast({
        castId: editingId,
        content: data.content,
        imageUrl,
        scheduledTime: timestamp,
        timezone: data.timezone,
      });

      toast.success("Cast updated successfully!");
      handleCancelEdit();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update cast"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (castId: Id<"scheduledCasts">) => {
    if (!confirm("Are you sure you want to delete this scheduled cast?")) {
      return;
    }

    setDeletingId(castId);
    try {
      await deleteCast({ castId });
      toast.success("Cast deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete cast"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-6">
          Scheduled Casts
        </h1>

        {casts === undefined ? (
          <LoadingSpinner />
        ) : casts.length === 0 ? (
          <EmptyState
            description="No scheduled casts yet"
            actionLabel="Schedule Your First Cast"
            actionPath="/"
          />
        ) : (
          <div className="space-y-8">
            {upcomingCasts.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Upcoming Casts
                </h2>
                <div className="space-y-4">
                  {upcomingCasts.map((cast) => (
                    <div key={cast._id}>
                      {editingId === cast._id ? (
                        <div className="bg-white rounded-lg shadow-md p-6">
                          <h3 className="text-lg font-semibold text-primary mb-4">
                            Edit Cast
                          </h3>
                          <CastForm
                            initialContent={cast.content}
                            initialDate={format(
                              new Date(cast.scheduledTime),
                              "yyyy-MM-dd"
                            )}
                            initialTime={format(
                              new Date(cast.scheduledTime),
                              "HH:mm"
                            )}
                            initialTimezone={cast.timezone}
                            initialImageUrl={cast.imageUrl}
                            onSubmit={handleUpdateCast}
                            onCancel={handleCancelEdit}
                            submitLabel="Save Changes"
                            isSubmitting={isUpdating || isUploading}
                          />
                        </div>
                      ) : (
                        <CastCard
                          cast={cast}
                          onEdit={() => handleEdit(cast._id)}
                          onDelete={() => handleDelete(cast._id)}
                          isDeleting={deletingId === cast._id}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {allPastCasts.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Past Casts
                  </h2>
                  <select
                    value={pastCastsFilter}
                    onChange={(e) =>
                      setPastCastsFilter(e.target.value as PastCastsFilter)
                    }
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                  >
                    <option value="all">All</option>
                    <option value="posted">Posted</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                {pastCasts.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">
                      No {pastCastsFilter === "all" ? "" : pastCastsFilter}{" "}
                      casts found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastCasts.map((cast) => (
                      <CastCard
                        key={cast._id}
                        cast={cast}
                        isDeleting={deletingId === cast._id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
