export function timeToMinute(time: string) {
  const [hour, minute] = time.split(":").map((word) => +word);
  return 60 * hour + minute;
}

export function minuteToTime(minute: number) {
  const hourS = Math.floor(minute / 60);
  const monthS = minute % 60;

  const hourString = hourS < 10 ? "0" + hourS : "" + hourS;
  const monthString = monthS < 10 ? "0" + monthS : "" + monthS;

  return "" + hourString + ":" + monthString;
}

export function isPeriodical(time: string, period: number) {
  if (timeToMinute(time) % period !== 0) return false;
  else return true;
}

export function getAvailableTimes(
  startM: number,
  endM: number,
  period: number
) {
  const len = (endM - startM) / period;
  return [...Array(len).keys()].map((idx) =>
    minuteToTime(idx * period + startM)
  );
}
