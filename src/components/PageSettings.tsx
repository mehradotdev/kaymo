import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { toast } from "sonner";
import { TIMEZONES, getCurrentTimezoneInfo } from "~/utils/timezones";

export default function SettingsPage() {
  const profile = useQuery(api.profiles.getUserProfile);
  const updateProfile = useMutation(api.profiles.createOrUpdateProfile);

  const currentTimezoneInfo = getCurrentTimezoneInfo();
  const [displayName, setDisplayName] = useState("");
  const [farcasterId, setFarcasterId] = useState("");
  const [farcasterUsername, setFarcasterUsername] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [timezone, setTimezone] = useState(currentTimezoneInfo.value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setFarcasterId(profile.farcasterId);
      setFarcasterUsername(profile.farcasterUsername);
      setProfileImgUrl(profile.profileImgUrl || "");
      setTimezone(profile.timezone);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !displayName.trim() ||
      !farcasterId.trim() ||
      !farcasterUsername.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProfile({
        displayName,
        farcasterId,
        farcasterUsername,
        profileImgUrl: profileImgUrl || undefined,
        timezone,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>

        {profile === undefined ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="farcasterId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Farcaster ID *
              </label>
              <input
                id="farcasterId"
                type="text"
                value={farcasterId}
                onChange={(e) => setFarcasterId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="farcasterUsername"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Farcaster Username *
              </label>
              <input
                id="farcasterUsername"
                type="text"
                value={farcasterUsername}
                onChange={(e) => setFarcasterUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="profileImgUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Profile Image URL
              </label>
              <input
                id="profileImgUrl"
                type="url"
                value={profileImgUrl}
                onChange={(e) => setProfileImgUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Timezone *
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Settings"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
