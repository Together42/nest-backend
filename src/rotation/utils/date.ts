export function getNextYearAndMonth(): { year: number; month: number } {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 2;

  if (month > 12) {
    month -= 12;
    year += 1;
  }

  return { year, month };
}

export function getTomorrowDate(): Date {
  return new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
}

export function getTodayDay(): number {
  return new Date().getDate();
}

// const MONTH_IN_YEAR = 12;
const DAY_IN_WEEK = 7;
const DAY_OF_THURSDAY = 4;

const getFirstDateOfMonth = (date: Date, offsetMonth = 0) =>
  new Date(date.getFullYear(), date.getMonth() + offsetMonth, 1);
const getFirstDayOfMonth = (date: Date, offsetMonth = 0) =>
  getFirstDateOfMonth(date, offsetMonth).getDay();
const getFourthWeekPeriod = (date = new Date()): number[] => {
  const firstDay = getFirstDayOfMonth(date);
  let dateOfThursdayOnFirstWeek: number;

  if (firstDay < +DAY_OF_THURSDAY) {
    dateOfThursdayOnFirstWeek = 1 + DAY_OF_THURSDAY - firstDay;
  } else {
    dateOfThursdayOnFirstWeek = 1 + DAY_IN_WEEK + DAY_OF_THURSDAY - firstDay;
  }

  const dateOfThursdayOfFourthWeek = dateOfThursdayOnFirstWeek + 3 * DAY_IN_WEEK;
  const dateOfMondayOnFourthWeek = dateOfThursdayOfFourthWeek - 3;
  const dateOfSundayOnFourthWeek = dateOfThursdayOfFourthWeek + 3;

  return [dateOfMondayOnFourthWeek, dateOfSundayOnFourthWeek];
};

export const getFourthWeekdaysOfMonth = (date = new Date()): number[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateOfMondayOnFourthWeek, dateOfSundayOnFourthWeek] = getFourthWeekPeriod(date);
  const fourthWeekdays: number[] = [];

  for (let i = 0; i < 5; i++) {
    const day = dateOfMondayOnFourthWeek + i;
    fourthWeekdays.push(day);
  }

  return fourthWeekdays;
};

export const getFourthMondayOfMonth = (date = new Date()): number => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateOfMondayOnFourthWeek] = getFourthWeekPeriod(date);
  return dateOfMondayOnFourthWeek;
};

export const getFourthFridayOfMonth = (date = new Date()): number => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateOfMondayOnFourthWeek, dateOfSundayOnFourthWeek] = getFourthWeekPeriod(date);
  const dateOfFridayOnFourthWeek = dateOfSundayOnFourthWeek - 2;

  return dateOfFridayOnFourthWeek;
};
