export function mToYd(m) {
  return Math.round(m * 1.09361);
}

export function kmhToMph(kmh) {
  return Math.round(kmh * 0.621371);
}

export function cToF(c) {
  return Math.round((c * 9) / 5 + 32);
}

export function formatDistance(m) {
  return `${Math.round(m)} m / ${mToYd(m)} yd`;
}

export function formatDistanceRange(rangeStr) {
  if (typeof rangeStr !== 'string' || !rangeStr.includes('-')) return formatDistance(Number(rangeStr));
  const [min, max] = rangeStr.split('-').map(Number);
  return `${Math.round(min)}-${Math.round(max)} m / ${mToYd(min)}-${mToYd(max)} yd`;
}

export function formatSpeed(kmh) {
  return `${Math.round(kmh)} km/h / ${kmhToMph(kmh)} mph`;
}

export function formatSpeedRange(rangeStr) {
  if (typeof rangeStr !== 'string' || !rangeStr.includes('-')) return formatSpeed(Number(rangeStr));
  const [min, max] = rangeStr.split('-').map(Number);
  return `${Math.round(min)}-${Math.round(max)} km/h / ${kmhToMph(min)}-${kmhToMph(max)} mph`;
}

export function formatTemp(c) {
  return `${Math.round(c)}°C / ${cToF(c)}°F`;
}
