interface CalendarDay {
    day: number;
    display: string;
    title: string;
    isToday: boolean;
    isSelected: boolean;
    isFriday: boolean;
    isHoliday: boolean;
    isDisabled: boolean;
    weekDay: number;
    events?: {
        persianEvents: string[];
        hijriEvents: string[];
    };
}
interface ColorScheme {
    background?: string;
    text?: string;
    navButton?: string;
    navButtonHover?: string;
    dayNameBg?: string;
    dayNameText?: string;
    dayBg?: string;
    dayText?: string;
    dayHover?: string;
    todayBg?: string;
    todayText?: string;
    selectedBg?: string;
    selectedText?: string;
    fridayBg?: string;
    fridayText?: string;
    infoBg?: string;
    infoText?: string;
    border?: string;
    disabledOpacity?: number;
}
interface Props {
    from?: number[];
    to?: number[];
    showInfo?: boolean;
    showEvents?: boolean;
    fontFamily?: string;
    defaultDate?: number[] | string | null;
    showOccasions?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    lightColors?: ColorScheme;
    darkColors?: ColorScheme;
}
declare var __VLS_1: {
    selectedDay: any;
    persianMonthName: any;
    handleNextYear: () => void;
    handlePrevYear: () => void;
    handleNextMonth: () => void;
    handlePrevMonth: () => void;
}, __VLS_3: {
    year: any;
    handleNextYear: () => void;
    handlePrevYear: () => void;
}, __VLS_5: {}, __VLS_7: {
    year: any;
}, __VLS_9: {}, __VLS_11: {
    month: any;
    monthName: any;
    handleNextMonth: () => void;
    handlePrevMonth: () => void;
}, __VLS_13: {}, __VLS_15: {
    month: any;
    monthName: any;
}, __VLS_17: {}, __VLS_19: {
    dayNames: string[];
}, __VLS_21: {
    day: string;
    index: number;
}, __VLS_23: {
    calendarDays: CalendarDay[];
    selectDay: (day: CalendarDay) => void;
    getDayClasses: (day: CalendarDay) => {
        'calendar-day': boolean;
        today: boolean;
        selected: boolean;
        friday: boolean;
        holiday: boolean;
        disabled: boolean;
        'has-event': boolean | undefined;
    };
}, __VLS_25: {
    day: CalendarDay;
    index: number;
}, __VLS_27: {
    persianInfo: any;
    hijriInfo: any;
    gregorianInfo: any;
    selectedDay: any;
}, __VLS_29: {
    info: any;
}, __VLS_31: {
    info: any;
}, __VLS_33: {
    info: any;
}, __VLS_35: {
    events: any;
}, __VLS_37: {
    events: any;
}, __VLS_39: {
    event: any;
    index: number;
}, __VLS_41: {
    events: any;
}, __VLS_43: {
    event: any;
    index: number;
}, __VLS_45: {
    selectedDay: any;
    currentEvents: any;
};
type __VLS_Slots = {} & {
    header?: (props: typeof __VLS_1) => any;
} & {
    'year-selector'?: (props: typeof __VLS_3) => any;
} & {
    'next-year-icon'?: (props: typeof __VLS_5) => any;
} & {
    'year-display'?: (props: typeof __VLS_7) => any;
} & {
    'prev-year-icon'?: (props: typeof __VLS_9) => any;
} & {
    'month-selector'?: (props: typeof __VLS_11) => any;
} & {
    'next-month-icon'?: (props: typeof __VLS_13) => any;
} & {
    'month-display'?: (props: typeof __VLS_15) => any;
} & {
    'prev-month-icon'?: (props: typeof __VLS_17) => any;
} & {
    'day-names'?: (props: typeof __VLS_19) => any;
} & {
    'day-name'?: (props: typeof __VLS_21) => any;
} & {
    'calendar-grid'?: (props: typeof __VLS_23) => any;
} & {
    'day-cell'?: (props: typeof __VLS_25) => any;
} & {
    'day-info'?: (props: typeof __VLS_27) => any;
} & {
    'persian-info'?: (props: typeof __VLS_29) => any;
} & {
    'hijri-info'?: (props: typeof __VLS_31) => any;
} & {
    'gregorian-info'?: (props: typeof __VLS_33) => any;
} & {
    events?: (props: typeof __VLS_35) => any;
} & {
    'persian-events'?: (props: typeof __VLS_37) => any;
} & {
    'persian-event'?: (props: typeof __VLS_39) => any;
} & {
    'hijri-events'?: (props: typeof __VLS_41) => any;
} & {
    'hijri-event'?: (props: typeof __VLS_43) => any;
} & {
    footer?: (props: typeof __VLS_45) => any;
};
declare const __VLS_base: import("vue").DefineComponent<Props, {
    setDate: (date: number[] | string | null) => void;
    setDateFromGregorian: (gregorianDate: number[] | string) => void;
    getSelectedDate: () => number[];
    goToToday: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "select-date": (date: any) => any;
    "update-today": () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onSelect-date"?: ((date: any) => any) | undefined;
    "onUpdate-today"?: (() => any) | undefined;
}>, {
    showInfo: boolean;
    showEvents: boolean;
    fontFamily: string;
    defaultDate: number[] | string | null;
    showOccasions: boolean;
    theme: "light" | "dark" | "auto";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
