export function getIstParts() {
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const ist = new Date(istString);
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  return { hours, time };
}

type MoodKey = "late-night" | "asleep" | "morning" | "afternoon" | "evening";

function moodKeyFor(hours: number): MoodKey {
  if (hours >= 23 || hours < 2) return "late-night";
  if (hours >= 2 && hours < 9) return "asleep";
  if (hours >= 9 && hours < 12) return "morning";
  if (hours >= 12 && hours < 19) return "afternoon";
  return "evening";
}

const SHORT_MOOD: Record<MoodKey, string> = {
  "late-night": "up later than I should be",
  asleep: "asleep",
  morning: "slow start, coffee first",
  afternoon: "heads down",
  evening: "building",
};

const GREETING: Record<MoodKey, string> = {
  "late-night": "and I am up later than I should be.",
  asleep: "and I am asleep, but email lands fine.",
  morning: "coffee first, then replies.",
  afternoon: "heads down, so email is best.",
  evening: "and still building.",
};

export function moodFor(hours: number) {
  return SHORT_MOOD[moodKeyFor(hours)];
}

export function greetingFor(hours: number) {
  return GREETING[moodKeyFor(hours)];
}
