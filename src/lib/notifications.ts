import { format } from "date-fns";

// ─── Beep Sound ───────────────────────────────────────────────────────────────
// Synthesises a short three-tone rising chime using Web Audio API.
// Works while the app tab is active (browsers block silent-background audio).
export function playBeep(): void {
  try {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();

    const playTone = (
      freq: number,
      startOffset: number,
      duration: number,
      volume = 0.35,
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + startOffset + duration,
      );
      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration + 0.05);
    };

    // Rising three-note chime: A4 → C#5 → E5
    playTone(440, 0.0, 0.45);
    playTone(554, 0.5, 0.45);
    playTone(659, 1.0, 0.7);
  } catch {
    // AudioContext unavailable or blocked — silently skip
  }
}

// ─── OS / Browser Notification ────────────────────────────────────────────────
const PRAYER_MESSAGES: Record<string, string> = {
  Fajr: "Time for Fajr prayer 🌙",
  Sunrise: "Sunrise 🌅",
  Dhuhr: "Time for Dhuhr prayer ☀️",
  Asr: "Time for Asr prayer 🌤️",
  Maghrib: "Time for Maghrib prayer 🌇",
  Isha: "Time for Isha prayer 🌃",
};

export function showPrayerNotification(prayerName: string, time: Date): void {
  if (!("Notification" in window) || Notification.permission !== "granted")
    return;
  const title = PRAYER_MESSAGES[prayerName] ?? `Time for ${prayerName}`;
  const body = format(time, "h:mm a");
  try {
    new Notification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: `prayer-${prayerName.toLowerCase()}`, // deduplicate same prayer
      requireInteraction: false,
    });
  } catch {
    // Notifications blocked in this context
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  return await Notification.requestPermission();
}

export function getNotificationPermission():
  | NotificationPermission
  | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}
