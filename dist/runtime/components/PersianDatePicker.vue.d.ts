interface CalendarDay {
    day: number;
    display: string;
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
    inputBg?: string;
    inputText?: string;
    inputBorder?: string;
    inputBorderHover?: string;
    inputBorderFocus?: string;
    inputFocusShadow?: string;
    iconColor?: string;
    iconColorHover?: string;
    clearColor?: string;
    clearColorHover?: string;
    popupBg?: string;
    popupBorder?: string;
    popupShadow?: string;
    navBtnBg?: string;
    navBtnBgHover?: string;
    navBtnText?: string;
    yearMonthText?: string;
    quickBtnBg?: string;
    quickBtnBgHover?: string;
    quickBtnText?: string;
    dayNameText?: string;
    dayNameBg?: string;
    dayBg?: string;
    dayText?: string;
    dayBgHover?: string;
    todayBg?: string;
    todayText?: string;
    selectedBg?: string;
    selectedText?: string;
    fridayText?: string;
    holidayText?: string;
    disabledOpacity?: number;
    eventDotColor?: string;
    footerBorderColor?: string;
    footerText?: string;
}
interface Props {
    modelValue?: string | number[] | null;
    placeholder?: string;
    format?: string;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    position?: 'bottom' | 'top' | 'auto';
    from?: number[];
    to?: number[];
    fontFamily?: string;
    defaultDate?: number[] | string | null;
    showTodayButton?: boolean;
    showCloseButton?: boolean;
    showOccasions?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    lightColors?: ColorScheme;
    darkColors?: ColorScheme;
}
declare var __VLS_1: {
    displayValue: string;
    togglePopup: () => void;
    clearDate: () => void;
    isOpen: boolean;
}, __VLS_3: {
    displayValue: string;
    togglePopup: () => void;
    onFocus: () => void;
    onBlur: () => void;
}, __VLS_5: {
    togglePopup: () => void;
}, __VLS_7: {
    clearDate: () => void;
    displayValue: string;
}, __VLS_14: {
    closePopup: () => void;
    selectToday: () => void;
    calendarDays: CalendarDay[];
    selectDate: (day: CalendarDay) => void;
    currentYear: any;
    currentMonth: any;
    formattedSelectedDate: string;
}, __VLS_16: {
    currentYear: any;
    currentMonth: any;
    handleNextYear: () => void;
    handlePrevYear: () => void;
    handleNextMonth: () => void;
    handlePrevMonth: () => void;
    persianMonthName: any;
}, __VLS_18: {
    currentYear: any;
    handleNextYear: () => void;
    handlePrevYear: () => void;
}, __VLS_20: {}, __VLS_22: {
    year: any;
}, __VLS_24: {}, __VLS_26: {
    currentMonth: any;
    monthName: any;
    handleNextMonth: () => void;
    handlePrevMonth: () => void;
}, __VLS_28: {}, __VLS_30: {
    month: any;
    monthName: any;
}, __VLS_32: {}, __VLS_34: {
    selectToday: () => void;
    closePopup: () => void;
}, __VLS_36: {
    selectToday: () => void;
}, __VLS_38: {
    closePopup: () => void;
}, __VLS_40: {
    dayNames: string[];
}, __VLS_42: {
    day: string;
    index: number;
}, __VLS_44: {
    calendarDays: CalendarDay[];
    selectDate: (day: CalendarDay) => void;
    getDayClasses: (day: CalendarDay) => {
        'calendar-day': boolean;
        today: boolean;
        selected: boolean;
        friday: boolean;
        holiday: boolean;
        disabled: boolean;
        empty: boolean;
        'has-event': boolean | undefined;
    };
}, __VLS_46: {
    day: CalendarDay;
    index: number;
}, __VLS_48: {
    selectedDate: number[] | null;
    formattedSelectedDate: string;
}, __VLS_50: {
    formattedDate: string;
};
type __VLS_Slots = {} & {
    input?: (props: typeof __VLS_1) => any;
} & {
    'input-field'?: (props: typeof __VLS_3) => any;
} & {
    icon?: (props: typeof __VLS_5) => any;
} & {
    'clear-button'?: (props: typeof __VLS_7) => any;
} & {
    popup?: (props: typeof __VLS_14) => any;
} & {
    'popup-header'?: (props: typeof __VLS_16) => any;
} & {
    'year-selector'?: (props: typeof __VLS_18) => any;
} & {
    'next-year-icon'?: (props: typeof __VLS_20) => any;
} & {
    'year-display'?: (props: typeof __VLS_22) => any;
} & {
    'prev-year-icon'?: (props: typeof __VLS_24) => any;
} & {
    'month-selector'?: (props: typeof __VLS_26) => any;
} & {
    'next-month-icon'?: (props: typeof __VLS_28) => any;
} & {
    'month-display'?: (props: typeof __VLS_30) => any;
} & {
    'prev-month-icon'?: (props: typeof __VLS_32) => any;
} & {
    'quick-actions'?: (props: typeof __VLS_34) => any;
} & {
    'today-button'?: (props: typeof __VLS_36) => any;
} & {
    'close-button'?: (props: typeof __VLS_38) => any;
} & {
    'day-names'?: (props: typeof __VLS_40) => any;
} & {
    'day-name'?: (props: typeof __VLS_42) => any;
} & {
    'calendar-grid'?: (props: typeof __VLS_44) => any;
} & {
    'day-cell'?: (props: typeof __VLS_46) => any;
} & {
    'popup-footer'?: (props: typeof __VLS_48) => any;
} & {
    'selected-date-text'?: (props: typeof __VLS_50) => any;
};
declare const __VLS_base: import("vue").DefineComponent<Props, {
    setDate: (date: number[] | string | null) => void;
    setDateFromGregorian: (gregorianDate: number[] | string) => void;
    getSelectedDate: () => number[] | null;
    selectToday: () => void;
    clearDate: () => void;
    openPopup: () => void;
    closePopup: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (value: number[] | null) => any;
    "update:modelValue": (value: number[] | null) => any;
    open: () => any;
    close: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onChange?: ((value: number[] | null) => any) | undefined;
    "onUpdate:modelValue"?: ((value: number[] | null) => any) | undefined;
    onOpen?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
}>, {
    fontFamily: string;
    defaultDate: number[] | string | null;
    showOccasions: boolean;
    theme: "light" | "dark" | "auto";
    modelValue: string | number[] | null;
    placeholder: string;
    format: string;
    disabled: boolean;
    readonly: boolean;
    clearable: boolean;
    position: "bottom" | "top" | "auto";
    showTodayButton: boolean;
    showCloseButton: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
