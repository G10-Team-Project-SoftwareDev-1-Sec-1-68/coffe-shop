/**
 * Order Scheduling & Business Hours
 * Feature: CUS-02, TC-15
 * - Operating hours (e.g. 07:00–18:00)
 * - Block past time/date
 * - Lead time (e.g. 15 min in advance)
 * - Holiday / store closure
 */

const DEFAULT_OPEN = { hour: 7, minute: 0 };
const DEFAULT_CLOSE = { hour: 18, minute: 0 };
const DEFAULT_LEAD_MINUTES = 15;

/**
 * @param {Date} date
 * @param {{ hour: number; minute: number }} open
 * @param {{ hour: number; minute: number }} close
 * @returns {boolean}
 */
export function isWithinOperatingHours(date, open = DEFAULT_OPEN, close = DEFAULT_CLOSE) {
  const h = date.getHours();
  const m = date.getMinutes();
  const openMinutes = open.hour * 60 + open.minute;
  const closeMinutes = close.hour * 60 + close.minute;
  const currentMinutes = h * 60 + m;
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * @param {Date} date
 * @returns {boolean}
 */
export function isPast(date) {
  return date.getTime() < Date.now();
}

/**
 * @param {Date} pickupAt
 * @param {number} leadMinutes
 * @returns {boolean}
 */
export function hasLeadTime(pickupAt, leadMinutes = DEFAULT_LEAD_MINUTES) {
  const deadline = new Date(Date.now() + leadMinutes * 60 * 1000);
  return pickupAt.getTime() >= deadline.getTime();
}

/**
 * @param {Date} date
 * @param {string[]} holidayDates array of "YYYY-MM-DD"
 * @returns {boolean}
 */
export function isHolidayOrClosure(date, holidayDates = []) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const key = `${y}-${m}-${d}`;
  return holidayDates.includes(key);
}

/**
 * Full validation for a selected pickup time
 * @param {Date} selected
 * @param {{ open?: { hour: number; minute: number }; close?: { hour: number; minute: number }; leadMinutes?: number; holidays?: string[] }} options
 * @returns {{ valid: boolean; reason?: string }}
 */
export function validatePickupTime(selected, options = {}) {
  if (isPast(selected)) {
    return { valid: false, reason: "past" };
  }
  if (isHolidayOrClosure(selected, options.holidays ?? [])) {
    return { valid: false, reason: "holiday_or_closure" };
  }
  if (!hasLeadTime(selected, options.leadMinutes ?? DEFAULT_LEAD_MINUTES)) {
    return { valid: false, reason: "lead_time" };
  }
  if (!isWithinOperatingHours(selected, options.open ?? DEFAULT_OPEN, options.close ?? DEFAULT_CLOSE)) {
    return { valid: false, reason: "outside_hours" };
  }
  return { valid: true };
}
