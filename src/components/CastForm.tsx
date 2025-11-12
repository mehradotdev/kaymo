import { useState, useRef, useEffect } from "react";
import { format, addMonths } from "date-fns";
import { toast } from "sonner";
import { TIMEZONES, getCurrentTimezoneInfo } from "~/utils/timezones";
import { validateCastContent, validateScheduledTime, validateImageFile } from "~/utils/validation";

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
  initialDate = "",
  initialTime = "",
  initialTimezone = getCurrentTimezoneInfo().value,
  initialImageUrl,
  onSubmit,
  onCancel,
  submitLabel = "Schedule Cast",
  isSubmitting = false,
}: CastFormProps) {
  const [content, setContent] = useState(initialContent);
  const [scheduledDate, setScheduledDate] = useState(initialDate);
  const [scheduledTime, setScheduledTime] = useState(initialTime);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasExistingImage, setHasExistingImage] = useState(!!initialImageUrl);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const currentTimezoneInfo = getCurrentTimezoneInfo();
  const minDate = format(new Date(), "yyyy-MM-dd");
  const maxDate = format(addMonths(new Date(), 3), "yyyy-MM-dd");

  useEffect(() => {
    setContent(initialContent);
    setScheduledDate(initialDate);
    setScheduledTime(initialTime);
    setTimezone(initialTimezone);
    setHasExistingImage(!!initialImageUrl);
    setRemoveExistingImage(false);
    setSelectedImage(null);
    setImagePreview(null);
  }, [initialContent, initialDate, initialTime, initialTimezone, initialImageUrl]);

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    } else if (!hasExistingImage || removeExistingImage) {
      setImagePreview(null);
    }
  }, [selectedImage, hasExistingImage, removeExistingImage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      setSelectedImage(file);
      setRemoveExistingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contentError = validateCastContent(content);
    if (contentError) {
      toast.error(contentError);
      return;
    }

    const { error: timeError } = validateScheduledTime(scheduledDate, scheduledTime);
    if (timeError) {
      toast.error(timeError);
      return;
    }

    await onSubmit({
      content,
      imageFile: selectedImage,
      scheduledDate,
      scheduledTime,
      timezone,
      removeImage: removeExistingImage,
    });

    // Reset form
    setContent("");
    setSelectedImage(null);
    setImagePreview(null);
    setScheduledDate("");
    setScheduledTime("");
    setHasExistingImage(false);
    setRemoveExistingImage(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Cast Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow resize-none"
          rows={4}
          maxLength={320}
        />
        <p className="text-sm text-gray-500 mt-1">{content.length}/320 characters</p>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
          Image (Optional)
        </label>
        {hasExistingImage && !removeExistingImage && !selectedImage && (
          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
            <span className="text-sm text-blue-800">📷 Existing image attached</span>
            <button
              type="button"
              onClick={() => setRemoveExistingImage(true)}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
        )}
        <input
          ref={imageInputRef}
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        {imagePreview && (
          <div className="mt-4 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-auto rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={minDate}
            max={maxDate}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <input
            id="time"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        >
          <option value={currentTimezoneInfo.value}>
            {currentTimezoneInfo.label}
          </option>
          <option disabled>──────────</option>
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim() || !scheduledDate || !scheduledTime}
          className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
