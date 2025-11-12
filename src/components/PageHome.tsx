import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import CastForm from "~/components/CastForm";
import { useImageUpload } from "~/hooks/useImageUpload";
import { validateScheduledTime } from "~/utils/validation";

export default function HomePage() {
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
      <div className="bg-white rounded-lg shadow-md p-4 pt-0">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Schedule a Cast
        </h2>
        <CastForm
          onSubmit={handleSchedule}
          isSubmitting={isSubmitting || isUploading}
        />
      </div>
    </div>
  );
}
