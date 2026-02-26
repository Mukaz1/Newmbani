import { Periods } from '@newmbani/types';

export function DateHelper(date: Date | undefined) {
  const oldDateObj = date || new Date();
  const newDateObj = new Date();
  return newDateObj.setTime(oldDateObj.getTime() + 5 * 60 * 1000);
}

/**
 * This is a function to get date difference for two dates
 *
 * @export
 * @param {Date} date1
 * @param {Date} date2
 * @return {*}  {number}
 */
export function differenceInDays(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffInTime = new Date(date2).getTime() - new Date(date1).getTime();
  return Math.round(diffInTime / oneDay);
}

export function formatDateDDMMYY(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function IsFirstDateGreater(
  date1: Date | string,
  date2: Date | string
): boolean | null {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);

  if (firstDate < secondDate) {
    return false;
  } else if (firstDate > secondDate) {
    return true;
  } else {
    return false;
  }
}

export function isCoverActive(expiryDateReq: Date | string): boolean {
  const today = new Date();
  const expiryDate = new Date(expiryDateReq);

  if (today < expiryDate) {
    return true;
  } else if (today > expiryDate) {
    return false;
  } else {
    return false;
  }
}

export function coverDaysLeft(payload: {
  expiryDate: Date | string;
  startDate?: Date | string;
}): number {
  const today = new Date();
  const startDate = payload.startDate ? new Date(payload.startDate) : today;
  const expiryDate = new Date(payload.expiryDate);
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffInTime =
    new Date(expiryDate).getTime() - new Date(startDate).getTime();
  return Math.round(diffInTime / oneDay);
}

interface Entry {
  year: number;
  month: string;
  value: number;
}

export function GetUniqueMonths(availableDates: string[]) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const uniqueDates = availableDates.reduce((acc, dt) => {
    // Format date to get month and year
    const formattedDate = formatDateDDMMYY(new Date(dt));

    const splittedDate = formattedDate.split('-');
    const month: number = +splittedDate[1];
    const year: number = +splittedDate[2];
    acc[year] = [...new Set(acc[year] || [])];
    acc[year].push({ year, month: months[month - 1], value: month });
    return acc;
  }, {});
  const arr: Periods[] = Object.keys(uniqueDates)
    .map((key) => uniqueDates[key])
    .flat();
  const monthsArray: Periods[] = [];
  const getYears = arr.map((entry) => entry.year);
  const uniqueYears = [...new Set(getYears)];
  for (let i = 0; i < uniqueYears.length; i++) {
    const year = uniqueYears[i];

    const getMonthsThisYear = arr.filter((entry) => {
      return entry.year === year;
    });

    const monthsArr: { month: string; value: number }[] = [];
    for (let mn = 0; mn < getMonthsThisYear.length; mn++) {
      const element: Entry = getMonthsThisYear[mn] as unknown as Entry;
      if (!monthsArr.find((month) => month.value === element.value)) {
        monthsArr.push({
          month: element.month,
          value: element.value,
        });
      }
    }

    const period: Periods = {
      year,
      months: [
        ...monthsArr.sort(function (a, b) {
          return a.value - b.value;
        }),
      ],
    };
    monthsArray.push(period);
  }
  return monthsArray
    .map((m) => {
      if (m.year <= new Date().getFullYear()) {
        return m;
      }
    })
    .filter((m) => {
      if (m) {
        return m;
      }
    });
}
