export function timeUntilMidnight() {
    const now = new Date();
    const midnight = new Date();

    midnight.setDate(now.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);

    const diffMs = midnight - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const hh = String(diffHours).padStart(2, "0");
    const mm = String(diffMinutes).padStart(2, "0");

    return `${hh}:${mm}`;
}
