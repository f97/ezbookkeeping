import moment from 'moment';

import dateTimeConstants from '../../consts/datetime.js';
import { isNumber } from "./common.js";

export function getUtcOffsetMinutesByUtcOffset(utcOffset) {
    if (!utcOffset) {
        return 0;
    }

    const parts = utcOffset.split(':');

    if (parts.length !== 2) {
        return 0;
    }

    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

export function getUtcOffsetByUtcOffsetMinutes(utcOffsetMinutes) {
    let offsetHours = parseInt(Math.abs(utcOffsetMinutes) / 60);
    let offsetMinutes = Math.abs(utcOffsetMinutes) - offsetHours * 60;

    if (offsetHours < 10) {
        offsetHours = '0' + offsetHours;
    }

    if (offsetMinutes < 10) {
        offsetMinutes = '0' + offsetMinutes;
    }

    if (utcOffsetMinutes >= 0) {
        return `+${offsetHours}:${offsetMinutes}`;
    } else if (utcOffsetMinutes < 0) {
        return `-${offsetHours}:${offsetMinutes}`;
    }
}

export function getTimezoneOffset(timezone) {
    if (timezone) {
        return moment().tz(timezone).format('Z');
    } else {
        return moment().format('Z');
    }
}

export function getTimezoneOffsetMinutes(timezone) {
    const utcOffset = getTimezoneOffset(timezone);
    return getUtcOffsetMinutesByUtcOffset(utcOffset);
}

export function getBrowserTimezoneOffsetMinutes() {
    return -new Date().getTimezoneOffset();
}

export function getLocalDatetimeFromUnixTime(unixTime) {
    return new Date(unixTime * 1000);
}

export function getUnixTimeFromLocalDatetime(datetime) {
    return datetime.getTime() / 1000;
}

export function getActualUnixTimeForStore(unixTime, utcOffset, currentUtcOffset) {
    return unixTime - (utcOffset - currentUtcOffset) * 60;
}

export function getDummyUnixTimeForLocalUsage(unixTime, utcOffset, currentUtcOffset) {
    return unixTime + (utcOffset - currentUtcOffset) * 60;
}

export function getCurrentUnixTime() {
    return moment().unix();
}

export function getCurrentDateTime() {
    return moment();
}

export function parseDateFromUnixTime(unixTime, utcOffset, currentUtcOffset) {
    if (isNumber(utcOffset)) {
        if (!isNumber(currentUtcOffset)) {
            currentUtcOffset = getTimezoneOffsetMinutes();
        }

        unixTime = getDummyUnixTimeForLocalUsage(unixTime, utcOffset, currentUtcOffset);
    }

    return moment.unix(unixTime);
}

export function is24HourFormat(format) {
    if (format.indexOf('HH') >= 0 && format.indexOf('hh') < 0) {
        return true;
    } else if (format.indexOf('HH') < 0 && format.indexOf('hh') >= 0) {
        return false;
    }

    return true;
}

export function formatUnixTime(unixTime, format, utcOffset, currentUtcOffset) {
    return parseDateFromUnixTime(unixTime, utcOffset, currentUtcOffset).format(format);
}

export function formatTime(dateTime, format) {
    return moment(dateTime).format(format);
}

export function getUnixTime(date) {
    return moment(date).unix();
}

export function getYear(date) {
    return moment(date).year();
}

export function getMonth(date) {
    return moment(date).month() + 1;
}

export function getYearAndMonth(date) {
    const year = getYear(date);
    let month = getMonth(date);

    if (month < 10) {
        month = '0' + month;
    }

    return `${year}-${month}`;
}

export function getDay(date) {
    return moment(date).date();
}

export function getDayOfWeekName(date) {
    const dayOfWeek = moment(date).days();
    return dateTimeConstants.allWeekDaysArray[dayOfWeek].name;
}

export function getHour(date) {
    return moment(date).hour();
}

export function getMinute(date) {
    return moment(date).minute();
}

export function getSecond(date) {
    return moment(date).second();
}

export function getUnixTimeBeforeUnixTime(unixTime, amount, unit) {
    return moment.unix(unixTime).subtract(amount, unit).unix();
}

export function getUnixTimeAfterUnixTime(unixTime, amount, unit) {
    return moment.unix(unixTime).add(amount, unit).unix();
}

export function getMinuteFirstUnixTime(date) {
    const datetime = moment(date);
    return datetime.set({ second: 0, millisecond: 0 }).unix();
}

export function getMinuteLastUnixTime(date) {
    return moment.unix(getMinuteFirstUnixTime(date)).add(1, 'minutes').subtract(1, 'seconds').unix();
}

export function getTodayFirstUnixTime() {
    return moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).unix();
}

export function getTodayLastUnixTime() {
    return moment.unix(getTodayFirstUnixTime()).add(1, 'days').subtract(1, 'seconds').unix();
}

export function getThisWeekFirstUnixTime(firstDayOfWeek) {
    const today = moment.unix(getTodayFirstUnixTime());

    if (!isNumber(firstDayOfWeek)) {
        firstDayOfWeek = 0;
    }

    let dayOfWeek = today.day() - firstDayOfWeek;

    if (dayOfWeek < 0) {
        dayOfWeek += 7;
    }

    return today.subtract(dayOfWeek, 'days').unix();
}

export function getThisWeekLastUnixTime(firstDayOfWeek) {
    return moment.unix(getThisWeekFirstUnixTime(firstDayOfWeek)).add(7, 'days').subtract(1, 'seconds').unix();
}

export function getThisMonthFirstUnixTime() {
    const today = moment.unix(getTodayFirstUnixTime());
    return today.subtract(today.date() - 1, 'days').unix();
}

export function getThisMonthLastUnixTime() {
    return moment.unix(getThisMonthFirstUnixTime()).add(1, 'months').subtract(1, 'seconds').unix();
}

export function getThisYearFirstUnixTime() {
    const today = moment.unix(getTodayFirstUnixTime());
    return today.subtract(today.dayOfYear() - 1, 'days').unix();
}

export function getThisYearLastUnixTime() {
    return moment.unix(getThisYearFirstUnixTime()).add(1, 'years').subtract(1, 'seconds').unix();
}

export function getShiftedDateRange(minTime, maxTime, scale) {
    const minDateTime = parseDateFromUnixTime(minTime).set({ second: 0, millisecond: 0 });
    const maxDateTime = parseDateFromUnixTime(maxTime).set({ second: 59, millisecond: 999 });

    const firstDayOfMonth = minDateTime.clone().startOf('month');
    const lastDayOfMonth = maxDateTime.clone().endOf('month');

    if (firstDayOfMonth.unix() === minDateTime.unix() && lastDayOfMonth.unix() === maxDateTime.unix()) {
        const months = getYear(maxDateTime) * 12 + getMonth(maxDateTime) - getYear(minDateTime) * 12 - getMonth(minDateTime) + 1;
        const newMinDateTime = minDateTime.add(months * scale, 'months');
        const newMaxDateTime = newMinDateTime.clone().add(months, 'months').subtract(1, 'seconds');

        return {
            minTime: newMinDateTime.unix(),
            maxTime: newMaxDateTime.unix()
        };
    }

    const range = (maxTime - minTime + 1) * scale;

    return {
        minTime: minTime + range,
        maxTime: maxTime + range
    };
}

export function getDateRangeByDateType(dateType, firstDayOfWeek) {
    let maxTime = 0;
    let minTime = 0;

    if (dateType === dateTimeConstants.allDateRanges.All.type) { // All
        maxTime = 0;
        minTime = 0;
    } else if (dateType === dateTimeConstants.allDateRanges.Today.type) { // Today
        maxTime = getTodayLastUnixTime();
        minTime = getTodayFirstUnixTime();
    } else if (dateType === dateTimeConstants.allDateRanges.Yesterday.type) { // Yesterday
        maxTime = getUnixTimeBeforeUnixTime(getTodayLastUnixTime(), 1, 'days');
        minTime = getUnixTimeBeforeUnixTime(getTodayFirstUnixTime(), 1, 'days');
    } else if (dateType === dateTimeConstants.allDateRanges.LastSevenDays.type) { // Last 7 days
        maxTime = getTodayLastUnixTime();
        minTime = getUnixTimeBeforeUnixTime(getTodayFirstUnixTime(), 6, 'days');
    } else if (dateType === dateTimeConstants.allDateRanges.LastThirtyDays.type) { // Last 30 days
        maxTime = getTodayLastUnixTime();
        minTime = getUnixTimeBeforeUnixTime(getTodayFirstUnixTime(), 29, 'days');
    } else if (dateType === dateTimeConstants.allDateRanges.ThisWeek.type) { // This week
        maxTime = getThisWeekLastUnixTime(firstDayOfWeek);
        minTime = getThisWeekFirstUnixTime(firstDayOfWeek);
    } else if (dateType === dateTimeConstants.allDateRanges.LastWeek.type) { // Last week
        maxTime = getUnixTimeBeforeUnixTime(getThisWeekLastUnixTime(firstDayOfWeek), 7, 'days');
        minTime = getUnixTimeBeforeUnixTime(getThisWeekFirstUnixTime(firstDayOfWeek), 7, 'days');
    } else if (dateType === dateTimeConstants.allDateRanges.ThisMonth.type) { // This month
        maxTime = getThisMonthLastUnixTime();
        minTime = getThisMonthFirstUnixTime();
    } else if (dateType === dateTimeConstants.allDateRanges.LastMonth.type) { // Last month
        maxTime = getUnixTimeBeforeUnixTime(getThisMonthFirstUnixTime(), 1, 'seconds');
        minTime = getUnixTimeBeforeUnixTime(getThisMonthFirstUnixTime(), 1, 'months');
    } else if (dateType === dateTimeConstants.allDateRanges.ThisYear.type) { // This year
        maxTime = getThisYearLastUnixTime();
        minTime = getThisYearFirstUnixTime();
    } else if (dateType === dateTimeConstants.allDateRanges.LastYear.type) { // Last year
        maxTime = getUnixTimeBeforeUnixTime(getThisYearLastUnixTime(), 1, 'years');
        minTime = getUnixTimeBeforeUnixTime(getThisYearFirstUnixTime(), 1, 'years');
    } else {
        return null;
    }

    return {
        dateType: dateType,
        maxTime: maxTime,
        minTime: minTime
    };
}

export function isDateRangeMatchFullYears(minTime, maxTime) {
    const minDateTime = parseDateFromUnixTime(minTime).set({ second: 0, millisecond: 0 });
    const maxDateTime = parseDateFromUnixTime(maxTime).set({ second: 59, millisecond: 999 });

    const firstDayOfYear = minDateTime.clone().startOf('year');
    const lastDayOfYear = maxDateTime.clone().endOf('year');

    return firstDayOfYear.unix() === minDateTime.unix() && lastDayOfYear.unix() === maxDateTime.unix();
}

export function isDateRangeMatchFullMonths(minTime, maxTime) {
    const minDateTime = parseDateFromUnixTime(minTime).set({ second: 0, millisecond: 0 });
    const maxDateTime = parseDateFromUnixTime(maxTime).set({ second: 59, millisecond: 999 });

    const firstDayOfMonth = minDateTime.clone().startOf('month');
    const lastDayOfMonth = maxDateTime.clone().endOf('month');

    return firstDayOfMonth.unix() === minDateTime.unix() && lastDayOfMonth.unix() === maxDateTime.unix();
}