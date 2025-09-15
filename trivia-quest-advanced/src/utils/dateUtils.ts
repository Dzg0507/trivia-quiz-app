/**
 * Calculates the ISO 8601 week number for a given date.
 * @param date - The date to get the week number for.
 * @returns The ISO week number.
 */
export const getISOWeek = (date: Date | string | number): number => {
  // Create a new Date object to avoid modifying the original date.
  const d = new Date(date);
  // Set to midnight to standardize the time.
  d.setHours(0, 0, 0, 0);
  // Thursday in current week decides the week number.
  // Set the date to the Thursday of the current week.
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  // Get the first day of the year.
  const week1 = new Date(d.getFullYear(), 0, 4);
  // Calculate the difference in days and divide by 7 to get the week number.
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

/**
 * Gets the current date as a string in 'YYYY-MM-DD' format.
 * @returns {string} The date identifier for today.
 */
export const getTodayIdentifier = () => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Gets the current ISO week as a string in 'YYYY-Www' format.
 * @returns {string} The week identifier for the current week.
 */
export const getThisWeekIdentifier = () => {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  // Pad the week number with a leading zero if it's less than 10.
  const weekString = week < 10 ? `0${week}` : week;
  return `${year}-W${weekString}`;
};

/**
 * Gets the current month and year as a string (e.g., "September 2025").
 * @returns {string} The month identifier for the current month.
 */
export const getThisMonthIdentifier = () => {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};
