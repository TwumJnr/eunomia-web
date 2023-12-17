import dayjs, { extend } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import isToday from "dayjs/plugin/isToday.js";
import isYesterday from "dayjs/plugin/isYesterday.js";

extend(advancedFormat);
extend(isToday);
extend(isYesterday);

/**
 * The `formatDate` function takes a string representing a date and returns a formatted date string in
 * the format "Do MMMM, YYYY".
 * @param {string} dateString - A string representing a date in any valid format.
 * @returns a formatted date string in the format "Do MMMM, YYYY".
 */
export function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = dayjs(dateString);
  return date.format("Do MMMM, YYYY");
}

/**
 * The `minFullDate` function takes a date string as input and returns a formatted date string in the
 * format "ddd Do MMM, YYYY".
 * @param {string} dateString - A string representing a date in any valid format.
 * @returns a formatted date string in the format "ddd Do MMM, YYYY".
 */
export const minFullDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = dayjs(dateString);
  let preText = "";
  if (date.isToday()) preText = "Today | ";
  if (date.isYesterday()) preText = "Yesterday | ";
  const formattedText = date.format("ddd Do MMM, YYYY");

  return `${preText}${formattedText}`;
};

/**
 * The function `formatDateMin` takes a string representing a date and returns a formatted date string
 * in the format "Do MMM, YYYY".
 * @param {string | undefined} dateString - A string representing a date in any valid format.
 * @returns The function `formatDateMin` returns a formatted date string in the format "Do MMM, YYYY".
 * If the `dateString` parameter is undefined, an empty string is returned.
 */
export function formatDateMin(dateString: string | undefined | null) {
  if (!dateString) return "";
  const date = dayjs(dateString);
  return date.format("Do MMM, YYYY");
}

/**
 * The function `getYear` takes a date string as input and returns the year portion of the date in the
 * format "YYYY".
 * @param {string} dateString - A string representing a date in any valid format.
 * @returns the year extracted from the given date string in the format "YYYY".
 */
export function getYear(dateString: string) {
  if (!dateString) return "";
  const date = dayjs(dateString);
  return date.format("YYYY");
}

/**
 * The function `getYearMonth` takes a date string as input and returns the month and year in the
 * format "MMMM, YYYY".
 * @param {string} dateString - A string representing a date in any valid format.
 * @returns a formatted string representing the year and month of the given date.
 */
export function getYearMonth(dateString: string) {
  if (!dateString) return "";
  const date = dayjs(dateString);
  return date.format("MMMM, YYYY");
}

/**
 * The `setDate` function takes a string representing a date and returns it in the format "YYYY-MM-DD".
 * @param {string} dateString - A string representing a date in any valid format.
 * @returns a formatted date string in the format "YYYY-MM-DD".
 */
export function setDate(dateString: string) {
  if (!dateString) return "";
  const date = dayjs(dateString);
  return date.format("YYYY-MM-DD");
}

/**
 * The `dateTime` function takes a string representing a date and time, and returns a formatted string
 * in the format "Do MMMM, YYYY hh:mm a".
 * @param {string | undefined} dateString - A string representing a date and time in any valid format.
 * @returns a formatted date and time string in the format "Do MMMM, YYYY hh:mm a". If the input
 * `dateString` is undefined, an empty string is returned.
 */
export function dateTime(dateString: string | undefined) {
  if (!dateString) return "";
  const date = dayjs(dateString);
  return date.format("Do MMMM, YYYY hh:mm a");
}

/**
 * The function `getTime` takes a string representing a date and returns the time in a specific format.
 * @param {string} dateString - The `dateString` parameter is a string that represents a date and time.
 * It can be in any valid date and time format, such as "YYYY-MM-DD HH:mm:ss" or "MM/DD/YYYY hh:mm a".
 * @returns the time in the format "hh:mm a" from the given dateString.
 */
export function getTime(dateString: string) {
  if (!dateString) return "";
  const date = dayjs(dateString);
  return date.format("hh:mm a");
}

/**
 * The function `shortMonthYear` takes a date string as input and returns a formatted string
 * representing the month and year in a shortened format.
 * @param {string} dateString - A string representing a date in any valid format.
 * @returns a formatted string representing the month and year of the given date.
 */
export function shortMonthYear(dateString: string) {
  if (!dateString) return "";
  const date = dayjs(dateString);
  return date.format("MMM 'YY");
}

/* The line `export const currentDate = dayjs().format("YYYY-MM-DD");` is exporting a constant variable
named `currentDate` that contains the current date in the format "YYYY-MM-DD". */
export const currentDate = dayjs().format("YYYY-MM-DD");
/* The line `export const currentDateTime = dayjs();` is exporting a constant variable named
`currentDateTime` that contains the current date and time. It uses the `dayjs()` function without
any arguments to create a new instance of the `dayjs` object representing the current date and time. */
export const currentDateTime = dayjs();
/* The line `export const fullCurrentDate = dayjs().format("Do MMMM, YYYY");` is exporting a constant
variable named `fullCurrentDate` that contains the current date in the format "Do MMMM, YYYY". */
export const fullCurrentDate = dayjs().format("Do MMMM, YYYY");
/* The line `export const monthYear = dayjs().format("MMMM YYYY");` is exporting a constant variable
named `monthYear` that contains the current month and year in the format "MMMM YYYY". */
export const monthYear = dayjs().format("MMMM YYYY");
/* The line `export const minMonthYear = dayjs().format("YYYY/MM");` is exporting a constant variable
named `minMonthYear` that contains the current month and year in the format "YYYY/MM". It uses the
`dayjs()` function without any arguments to create a new instance of the `dayjs` object representing
the current date and time, and then formats it using the `format()` method with the "YYYY/MM" format
string. */
export const minMonthYear = dayjs().format("YYYY/MM");
/* The line `export const dateTimeSerial = dayjs().format("YYYYMMDDhhmmss");` is exporting a constant
variable named `dateTimeSerial` that contains the current date and time in a specific format. */
export const dateTimeSerial = () => {
  return dayjs().format("YYYYMMDDhhmmss");
};

export const dateSerial = () => {
  const date = dayjs();
  return date.format("YYYYMMDD");
};

// Visit https://day.js.org/en/ for documentation
