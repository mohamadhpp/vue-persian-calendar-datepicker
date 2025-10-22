export interface PersianDate {
    year: number;
    month: number;
    day: number;
}
export interface DateWithEvents {
    date: number[];
    hijriDate: number[];
    gregorianDate: number[];
    persianEvents: string[];
    hijriEvents: string[];
    officialWorldEvents: string[];
    unofficialWorldEvents: string[];
}
export interface CalendarEvents {
    persianEvents: string[];
    hijriEvents: string[];
    officialWorldEvents: string[];
    unofficialWorldEvents: string[];
}
export declare const usePersianCalendar: () => {
    today: import("vue").ComputedRef<number[]>;
    selectedDay: import("vue").ComputedRef<number[]>;
    todayHijri: import("vue").ComputedRef<number[]>;
    todayGregorian: import("vue").ComputedRef<number[]>;
    persianMonthName: (month: number) => string;
    hijriMonthName: (month: number) => string;
    gregorianMonthName: (month: number) => string;
    nextMonth: () => number[];
    prevMonth: () => number[];
    nextYear: () => number[];
    prevYear: () => number[];
    setYear: (year: number, month?: number) => void;
    setMonth: (month: number) => void;
    getDayEvents: (year: number, month: number, day: number) => CalendarEvents;
    getTodayPersianInfo: () => string;
    getSelectedDayPersianInfo: () => string;
    getTodayGregorianInfo: () => string;
    getSelectedDayGregorianInfo: () => string;
    getTodayHijriInfo: () => string;
    getSelectedDayHijriInfo: () => string;
    getTodayEvents: () => CalendarEvents;
    getSelectedDayEvents: () => CalendarEvents;
    dayCountInMonth: (year: number, month: number) => number;
    jalaliToGregorian: (year: number, month: number, day: number) => number[];
    jalaliToHijri: (year: number, month: number, day: number) => number[];
    dayIndexOfWeek: (year: number, month: number, day: number) => number;
};
