import { useState } from "react";
import { ComposeTray, DraftData } from "~/components/compose/ComposeTray";
import { toast } from "sonner";
import { format } from "date-fns";

interface CastFormProps {
  initialContent?: string;
  initialDate?: string;
  initialTime?: string;
  initialTimezone?: string;
  initialImageUrl?: string;
  onSubmit: (data: {
    content: string;
    imageFile: File | null;
    scheduledDate: string;
    scheduledTime: string;
    timezone: string;
    removeImage: boolean;
  }) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function CastForm({
  initialContent = "",
  initialDate,
  initialTime,
  initialImageUrl,
  onSubmit,
  onCancel,
}: CastFormProps) {

  const handlePublish = async (data: DraftData & { scheduledTime?: Date }) => {
    // Convert DraftData to the format expected by the parent
    // Note: This is a bridge between the new UI and the old data structure
    // Ideally, we'd update the parent to accept DraftData directly

    let scheduledDateStr = "";
    let scheduledTimeStr = "";

    if (data.scheduledTime) {
      scheduledDateStr = format(data.scheduledTime, "yyyy-MM-dd");
      scheduledTimeStr = format(data.scheduledTime, "HH:mm");
    }

    // Handle media: The new UI supports multiple, but the backend currently only takes one
    // We'll take the first one if available
    let imageFile: File | null = null;
    if (data.media && data.media.length > 0 && data.media[0].file) {
      imageFile = data.media[0].file;
    }

    await onSubmit({
      content: data.body,
      imageFile: imageFile,
      scheduledDate: scheduledDateStr,
      scheduledTime: scheduledTimeStr,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to local for now
      removeImage: false // Not really used in new flow as we just don't pass the file
    });
  };

  // Initial draft state from props
  const initialDraft: DraftData = {
    body: initialContent,
    media: initialImageUrl ? [{ id: 'initial', url: initialImageUrl }] : [],
    mode: 'both' // Default
  };

  return (
    <div className="w-full flex justify-center">
      <ComposeTray
        draft={initialDraft}
        onPublish={handlePublish}
        onCancel={onCancel}
      />
    </div>
  );
}
