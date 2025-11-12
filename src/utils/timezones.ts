export interface Timezone {
  value: string;
  label: string;
  offset: number;
}

export const TIMEZONES: Timezone[] = [
  { value: "Pacific/Midway", label: "Midway Island (GMT-11:00)", offset: -11 },
  { value: "Pacific/Honolulu", label: "Hawaii (GMT-10:00)", offset: -10 },
  { value: "America/Anchorage", label: "Alaska (GMT-09:00)", offset: -9 },
  { value: "America/Los_Angeles", label: "Pacific Time - US & Canada (GMT-08:00)", offset: -8 },
  { value: "America/Tijuana", label: "Tijuana (GMT-08:00)", offset: -8 },
  { value: "America/Denver", label: "Mountain Time - US & Canada (GMT-07:00)", offset: -7 },
  { value: "America/Phoenix", label: "Arizona (GMT-07:00)", offset: -7 },
  { value: "America/Chihuahua", label: "Chihuahua, Mazatlan (GMT-07:00)", offset: -7 },
  { value: "America/Chicago", label: "Central Time - US & Canada (GMT-06:00)", offset: -6 },
  { value: "America/Mexico_City", label: "Mexico City (GMT-06:00)", offset: -6 },
  { value: "America/Regina", label: "Saskatchewan (GMT-06:00)", offset: -6 },
  { value: "America/Bogota", label: "Bogota, Lima, Quito (GMT-05:00)", offset: -5 },
  { value: "America/New_York", label: "Eastern Time - US & Canada (GMT-05:00)", offset: -5 },
  { value: "America/Caracas", label: "Caracas (GMT-04:00)", offset: -4 },
  { value: "America/Halifax", label: "Atlantic Time - Canada (GMT-04:00)", offset: -4 },
  { value: "America/Santiago", label: "Santiago (GMT-04:00)", offset: -4 },
  { value: "America/St_Johns", label: "Newfoundland (GMT-03:30)", offset: -3.5 },
  { value: "America/Sao_Paulo", label: "Brasilia (GMT-03:00)", offset: -3 },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (GMT-03:00)", offset: -3 },
  { value: "America/Godthab", label: "Greenland (GMT-03:00)", offset: -3 },
  { value: "Atlantic/South_Georgia", label: "Mid-Atlantic (GMT-02:00)", offset: -2 },
  { value: "Atlantic/Azores", label: "Azores (GMT-01:00)", offset: -1 },
  { value: "Atlantic/Cape_Verde", label: "Cape Verde Islands (GMT-01:00)", offset: -1 },
  { value: "UTC", label: "UTC (GMT+00:00)", offset: 0 },
  { value: "Europe/London", label: "London, Edinburgh, Dublin (GMT+00:00)", offset: 0 },
  { value: "Europe/Lisbon", label: "Lisbon (GMT+00:00)", offset: 0 },
  { value: "Africa/Casablanca", label: "Casablanca (GMT+00:00)", offset: 0 },
  { value: "Europe/Paris", label: "Paris, Brussels, Amsterdam (GMT+01:00)", offset: 1 },
  { value: "Europe/Berlin", label: "Berlin, Rome, Stockholm (GMT+01:00)", offset: 1 },
  { value: "Europe/Madrid", label: "Madrid (GMT+01:00)", offset: 1 },
  { value: "Africa/Lagos", label: "West Central Africa (GMT+01:00)", offset: 1 },
  { value: "Europe/Athens", label: "Athens, Istanbul, Bucharest (GMT+02:00)", offset: 2 },
  { value: "Africa/Cairo", label: "Cairo (GMT+02:00)", offset: 2 },
  { value: "Africa/Johannesburg", label: "Johannesburg, Pretoria (GMT+02:00)", offset: 2 },
  { value: "Europe/Helsinki", label: "Helsinki, Kyiv, Riga (GMT+02:00)", offset: 2 },
  { value: "Asia/Jerusalem", label: "Jerusalem (GMT+02:00)", offset: 2 },
  { value: "Europe/Moscow", label: "Moscow, St. Petersburg (GMT+03:00)", offset: 3 },
  { value: "Asia/Kuwait", label: "Kuwait, Riyadh (GMT+03:00)", offset: 3 },
  { value: "Africa/Nairobi", label: "Nairobi (GMT+03:00)", offset: 3 },
  { value: "Asia/Baghdad", label: "Baghdad (GMT+03:00)", offset: 3 },
  { value: "Asia/Tehran", label: "Tehran (GMT+03:30)", offset: 3.5 },
  { value: "Asia/Dubai", label: "Abu Dhabi, Muscat (GMT+04:00)", offset: 4 },
  { value: "Asia/Baku", label: "Baku, Tbilisi, Yerevan (GMT+04:00)", offset: 4 },
  { value: "Asia/Kabul", label: "Kabul (GMT+04:30)", offset: 4.5 },
  { value: "Asia/Karachi", label: "Islamabad, Karachi (GMT+05:00)", offset: 5 },
  { value: "Asia/Tashkent", label: "Tashkent (GMT+05:00)", offset: 5 },
  { value: "Asia/Kolkata", label: "India Standard Time - IST (GMT+05:30)", offset: 5.5 },
  { value: "Asia/Colombo", label: "Sri Jayawardenepura (GMT+05:30)", offset: 5.5 },
  { value: "Asia/Kathmandu", label: "Kathmandu (GMT+05:45)", offset: 5.75 },
  { value: "Asia/Dhaka", label: "Dhaka (GMT+06:00)", offset: 6 },
  { value: "Asia/Almaty", label: "Almaty, Novosibirsk (GMT+06:00)", offset: 6 },
  { value: "Asia/Yangon", label: "Yangon (GMT+06:30)", offset: 6.5 },
  { value: "Asia/Bangkok", label: "Bangkok, Hanoi, Jakarta (GMT+07:00)", offset: 7 },
  { value: "Asia/Krasnoyarsk", label: "Krasnoyarsk (GMT+07:00)", offset: 7 },
  { value: "Asia/Shanghai", label: "Beijing, Shanghai, Hong Kong (GMT+08:00)", offset: 8 },
  { value: "Asia/Singapore", label: "Singapore (GMT+08:00)", offset: 8 },
  { value: "Asia/Taipei", label: "Taipei (GMT+08:00)", offset: 8 },
  { value: "Australia/Perth", label: "Perth (GMT+08:00)", offset: 8 },
  { value: "Asia/Irkutsk", label: "Irkutsk, Ulaanbaatar (GMT+08:00)", offset: 8 },
  { value: "Asia/Seoul", label: "Seoul (GMT+09:00)", offset: 9 },
  { value: "Asia/Tokyo", label: "Tokyo, Osaka, Sapporo (GMT+09:00)", offset: 9 },
  { value: "Australia/Adelaide", label: "Adelaide (GMT+09:30)", offset: 9.5 },
  { value: "Australia/Darwin", label: "Darwin (GMT+09:30)", offset: 9.5 },
  { value: "Australia/Sydney", label: "Sydney, Melbourne, Canberra (GMT+10:00)", offset: 10 },
  { value: "Australia/Brisbane", label: "Brisbane (GMT+10:00)", offset: 10 },
  { value: "Australia/Hobart", label: "Hobart (GMT+10:00)", offset: 10 },
  { value: "Asia/Vladivostok", label: "Vladivostok (GMT+10:00)", offset: 10 },
  { value: "Pacific/Guam", label: "Guam, Port Moresby (GMT+10:00)", offset: 10 },
  { value: "Asia/Magadan", label: "Magadan, Solomon Islands (GMT+11:00)", offset: 11 },
  { value: "Pacific/Auckland", label: "Auckland, Wellington (GMT+12:00)", offset: 12 },
  { value: "Pacific/Fiji", label: "Fiji, Kamchatka, Marshall Islands (GMT+12:00)", offset: 12 },
  { value: "Pacific/Tongatapu", label: "Nuku'alofa (GMT+13:00)", offset: 13 },
].sort((a, b) => a.offset - b.offset);

export function getCurrentTimezoneInfo(): { value: string; label: string; offset: string } {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Get the current offset in minutes
  const now = new Date();
  const offsetMinutes = -now.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offset = `GMT${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
  
  // Find the timezone name from our list
  const timezoneInfo = TIMEZONES.find(tz => tz.value === browserTimezone);
  const displayName = timezoneInfo ? timezoneInfo.label.split(' (')[0] : browserTimezone;
  
  return {
    value: browserTimezone,
    label: `Current Timezone (${displayName} ${offset})`,
    offset,
  };
}
