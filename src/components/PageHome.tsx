import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import CastForm from "~/components/CastForm";
import { useImageUpload } from "~/hooks/useImageUpload";
import { validateScheduledTime } from "~/utils/validation";

export default function HomePage() {
  const profile = useQuery(api.profiles.getUserProfile);
  const scheduleCast = useMutation(api.casts.scheduleCast);
  const { uploadImage, isUploading } = useImageUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSchedule = async (data: {
    content: string;
    imageFile: File | null;
    scheduledDate: string;
    scheduledTime: string;
    timezone: string;
  }) => {
    if (!profile) {
      toast.error("Please complete your profile in Settings first");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      if (data.imageFile) {
        imageUrl = await uploadImage(data.imageFile);
      }

      const { timestamp, error } = validateScheduledTime(
        data.scheduledDate,
        data.scheduledTime
      );
      if (error) {
        toast.error(error);
        return;
      }

      await scheduleCast({
        content: data.content,
        imageUrl,
        scheduledTime: timestamp,
        timezone: data.timezone,
      });

      toast.success("Cast scheduled successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to schedule cast"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 pt-0">
      {!profile ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 mb-6">
            Please set up your Farcaster profile in Settings before scheduling
            casts.
          </p>
          <a
            href="/settings"
            className="inline-block px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
          >
            Go to Settings
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4 pt-0">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Schedule a Cast
          </h2>
          <CastForm
            onSubmit={handleSchedule}
            isSubmitting={isSubmitting || isUploading}
          />
        </div>
      )}
    </div>
  );
}
