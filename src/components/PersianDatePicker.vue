<script setup lang="ts">

import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { usePersianCalendar } from '../composables';

interface CalendarDay
{
    day: number
    display: string
    isToday: boolean
    isSelected: boolean
    isFriday: boolean
    isHoliday: boolean
    isDisabled: boolean
    weekDay: number
    events?: { persianEvents: string[], hijriEvents: string[] }
}

interface ColorScheme
{
    inputBg?: string
    inputText?: string
    inputBorder?: string
    inputBorderHover?: string
    inputBorderFocus?: string
    inputFocusShadow?: string
    iconColor?: string
    iconColorHover?: string
    clearColor?: string
    clearColorHover?: string
    popupBg?: string
    popupBorder?: string
    popupShadow?: string
    navBtnBg?: string
    navBtnBgHover?: string
    navBtnText?: string
    yearMonthText?: string
    quickBtnBg?: string
    quickBtnBgHover?: string
    quickBtnText?: string
    dayNameText?: string
    dayNameBg?: string
    dayBg?: string
    dayText?: string
    dayBgHover?: string
    todayBg?: string
    todayText?: string
    selectedBg?: string
    selectedText?: string
    fridayText?: string
    holidayText?: string
    disabledOpacity?: number
    eventDotColor?: string
    footerBorderColor?: string
    footerText?: string
}

interface Props
{
    modelValue?: string | number[] | null
    placeholder?: string
    format?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    position?: 'bottom' | 'top' | 'auto'
    from?: number[]
    to?: number[]
    fontFamily?: string
    defaultDate?: number[] | string | null
    showTodayButton?: boolean
    showCloseButton?: boolean
    showOccasions?: boolean
    theme?: 'light' | 'dark' | 'auto'
    lightColors?: ColorScheme
    darkColors?: ColorScheme
}

const defaultLightColors: ColorScheme =
{
    inputBg: '#fff',
    inputText: '#333',
    inputBorder: '#e0e0e0',
    inputBorderHover: '#3498db',
    inputBorderFocus: '#3498db',
    inputFocusShadow: 'rgba(52, 152, 219, 0.2)',
    iconColor: '#7f8c8d',
    iconColorHover: '#3498db',
    clearColor: '#7f8c8d',
    clearColorHover: '#e74c3c',
    popupBg: '#fff',
    popupBorder: '#e0e0e0',
    popupShadow: 'rgba(0, 0, 0, 0.15)',
    navBtnBg: '#f5f5f5',
    navBtnBgHover: '#e0e0e0',
    navBtnText: '#333',
    yearMonthText: '#2c3e50',
    quickBtnBg: '#3498db',
    quickBtnBgHover: '#2980b9',
    quickBtnText: '#fff',
    dayNameText: '#7f8c8d',
    dayNameBg: 'transparent',
    dayBg: 'transparent',
    dayText: '#333',
    dayBgHover: '#f5f5f5',
    todayBg: '#e8f0fe',
    todayText: '#3498db',
    selectedBg: '#3498db',
    selectedText: '#fff',
    fridayText: '#e74c3c',
    holidayText: '#e74c3c',
    disabledOpacity: 0.4,
    eventDotColor: '#f39c12',
    footerBorderColor: 'transparent',
    footerText: '#7f8c8d'
}

const defaultDarkColors: ColorScheme =
{
    inputBg: '#2c3e50',
    inputText: '#ecf0f1',
    inputBorder: '#34495e',
    inputBorderHover: '#3498db',
    inputBorderFocus: '#3498db',
    inputFocusShadow: 'rgba(52, 152, 219, 0.3)',
    iconColor: '#95a5a6',
    iconColorHover: '#3498db',
    clearColor: '#95a5a6',
    clearColorHover: '#e74c3c',
    popupBg: '#34495e',
    popupBorder: '#2c3e50',
    popupShadow: 'rgba(0, 0, 0, 0.5)',
    navBtnBg: '#2c3e50',
    navBtnBgHover: '#1a252f',
    navBtnText: '#ecf0f1',
    yearMonthText: '#ecf0f1',
    quickBtnBg: '#3498db',
    quickBtnBgHover: '#2980b9',
    quickBtnText: '#fff',
    dayNameText: '#95a5a6',
    dayNameBg: 'transparent',
    dayBg: 'transparent',
    dayText: '#ecf0f1',
    dayBgHover: '#2c3e50',
    todayBg: '#2c3e50',
    todayText: '#3498db',
    selectedBg: '#3498db',
    selectedText: '#fff',
    fridayText: '#e74c3c',
    holidayText: '#e74c3c',
    disabledOpacity: 0.4,
    eventDotColor: '#f39c12',
    footerBorderColor: '#2c3e50',
    footerText: '#95a5a6'
}

const props = withDefaults(defineProps<Props>(),
{
    modelValue: null,
    placeholder: 'تاریخ را انتخاب کنید',
    format: 'YYYY/MM/DD',
    disabled: false,
    readonly: true,
    clearable: true,
    position: 'auto',
    fontFamily: 'Tahoma, sans-serif',
    defaultDate: null,
    showTodayButton: true,
    showCloseButton: true,
    showOccasions: true,
    theme: 'light'
});

const emit = defineEmits<
{
    (e: 'update:modelValue', value: number[] | null): void
    (e: 'change', value: number[] | null): void
    (e: 'open'): void
    (e: 'close'): void
}>();

const
{
    today,
    persianMonthName,
    dayCountInMonth,
    dayIndexOfWeek,
    jalaliToHijri,
    gregorianToJalali,
    getDayEvents
} = usePersianCalendar();

// State
const isOpen = ref(false);
const currentYear = ref(today.value[0]);
const currentMonth = ref(today.value[1]);
const selectedDate = ref<number[] | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const popupPosition = ref<'bottom' | 'top'>('bottom');

const dayNames = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// Detect system theme
const systemTheme = ref<'light' | 'dark'>('light');

const detectSystemTheme = () =>
{
    if (typeof window !== 'undefined' && window.matchMedia)
    {
        systemTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

const currentTheme = computed(() =>
{
    if (props.theme === 'auto')
        return systemTheme.value;
    return props.theme;
});

const currentColors = computed((): ColorScheme =>
{
    const isLight = currentTheme.value === 'light'
    const defaultColors = isLight ? defaultLightColors : defaultDarkColors
    const customColors = isLight ? props.lightColors : props.darkColors

    return {
        ...defaultColors,
        ...customColors
    }
})

const getCSSVariables = computed(() =>
{
    const colors = currentColors.value
    return {
        '--input-bg': colors.inputBg,
        '--input-text': colors.inputText,
        '--input-border': colors.inputBorder,
        '--input-border-hover': colors.inputBorderHover,
        '--input-border-focus': colors.inputBorderFocus,
        '--input-focus-shadow': colors.inputFocusShadow,
        '--icon-color': colors.iconColor,
        '--icon-color-hover': colors.iconColorHover,
        '--clear-color': colors.clearColor,
        '--clear-color-hover': colors.clearColorHover,
        '--popup-bg': colors.popupBg,
        '--popup-border': colors.popupBorder,
        '--popup-shadow': colors.popupShadow,
        '--nav-btn-bg': colors.navBtnBg,
        '--nav-btn-bg-hover': colors.navBtnBgHover,
        '--nav-btn-text': colors.navBtnText,
        '--year-month-text': colors.yearMonthText,
        '--quick-btn-bg': colors.quickBtnBg,
        '--quick-btn-bg-hover': colors.quickBtnBgHover,
        '--quick-btn-text': colors.quickBtnText,
        '--day-name-text': colors.dayNameText,
        '--day-name-bg': colors.dayNameBg,
        '--day-bg': colors.dayBg,
        '--day-text': colors.dayText,
        '--day-bg-hover': colors.dayBgHover,
        '--today-bg': colors.todayBg,
        '--today-text': colors.todayText,
        '--selected-bg': colors.selectedBg,
        '--selected-text': colors.selectedText,
        '--friday-text': colors.fridayText,
        '--holiday-text': colors.holidayText,
        '--disabled-opacity': colors.disabledOpacity,
        '--event-dot-color': colors.eventDotColor,
        '--footer-border-color': colors.footerBorderColor,
        '--footer-text': colors.footerText
    }
})

const initializeDate = () =>
{
    const value = props.modelValue || props.defaultDate;

    if (value)
    {
        if (Array.isArray(value))
        {
            selectedDate.value = value;
            currentYear.value = value[0];
            currentMonth.value = value[1];
        }
        else if (typeof value === 'string')
        {
            const parts = value.split(/[\/\-]/).map(Number);
            if (parts.length === 3)
            {
                selectedDate.value = parts;
                currentYear.value = parts[0];
                currentMonth.value = parts[1];
            }
        }
    }
}

watch(() => props.modelValue, (value) =>
{
    if (value)
    {
        if (Array.isArray(value))
        {
            selectedDate.value = value
            currentYear.value = value[0]
            currentMonth.value = value[1]
        }
        else if (typeof value === 'string')
        {
            const parts = value.split(/[\/\-]/).map(Number);

            if (parts.length === 3)
            {
                selectedDate.value = parts;
                currentYear.value = parts[0];
                currentMonth.value = parts[1];
            }
        }
    }
    else
    {
        selectedDate.value = null;
    }
}, { immediate: true });

const displayValue = computed(() =>
{
    if (!selectedDate.value)
        return '';

    const [year, month, day] = selectedDate.value;

    if (props.format === 'YYYY/MM/DD')
    {
        return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    }
    else if (props.format === 'YYYY-MM-DD')
    {
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    else if (props.format === 'DD/MM/YYYY')
    {
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    }
    else if (props.format === 'text')
    {
        return `${day} ${persianMonthName(month)} ${year}`;
    }

    return `${year}/${month}/${day}`;
})

const formattedSelectedDate = computed(() =>
{
    if (!selectedDate.value)
        return '';

    const [year, month, day] = selectedDate.value;
    return `${day} ${persianMonthName(month)} ${year}`;
})

const calendarDays = computed((): CalendarDay[] =>
{
    const year = currentYear.value;
    const month = currentMonth.value;
    const dayOfWeek = dayIndexOfWeek(year, month, 1);
    const daysCount = dayCountInMonth(year, month);
    const days: CalendarDay[] = [];

    let cellCounter = 1;

    for (let i = 0; i < 42; i++)
    {
        if (i >= dayOfWeek && cellCounter <= daysCount)
        {
            const isToday = today.value[0] === year &&
                today.value[1] === month &&
                today.value[2] === cellCounter;

            const isSelected = selectedDate.value ?
                selectedDate.value[0] === year &&
                selectedDate.value[1] === month &&
                selectedDate.value[2] === cellCounter : false;

            const weekDay = i % 7;
            const isFriday = weekDay === 6;
            const isDisabled = checkIfDisabled(year, month, cellCounter);

            const events = props.showOccasions ? getDayEvents(year, month, cellCounter) : undefined;

            days.push({
                day: cellCounter,
                display: cellCounter.toString(),
                isToday,
                isSelected,
                isFriday,
                isHoliday: false,
                isDisabled,
                weekDay,
                events
            });
            cellCounter++;
        }
        else
        {
            days.push({
                day: 0,
                display: '',
                isToday: false,
                isSelected: false,
                isFriday: false,
                isHoliday: false,
                isDisabled: true,
                weekDay: i % 7
            });
        }
    }

    return days;
})

const checkIfDisabled = (year: number, month: number, day: number): boolean =>
{
    if (props.from)
    {
        const [fromY, fromM, fromD] = props.from;
        if (year < fromY || (year === fromY && month < fromM) || (year === fromY && month === fromM && day < fromD))
        {
            return true;
        }
    }

    if (props.to)
    {
        const [toY, toM, toD] = props.to;
        if (year > toY || (year === toY && month > toM) || (year === toY && month === toM && day > toD))
        {
            return true;
        }
    }

    return false;
}

const getDayClasses = (day: CalendarDay) =>
{
    return {
        'calendar-day': true,
        'today': day.isToday,
        'selected': day.isSelected,
        'friday': day.isFriday,
        'holiday': day.isHoliday,
        'disabled': day.isDisabled,
        'empty': day.day === 0,
        'has-event': day.events && (day.events.persianEvents.length > 0 || day.events.hijriEvents.length > 0)
    };
}

const getDayTooltip = (day: CalendarDay): string =>
{
    if (!day.events || day.day === 0)
        return '';

    const events: string[] = [];
    if (day.events.persianEvents.length > 0)
    {
        events.push(...day.events.persianEvents);
    }

    if (day.events.hijriEvents.length > 0)
    {
        events.push(...day.events.hijriEvents);
    }

    return events.join('\n');
}

const handleInputClick = () =>
{
    if (props.disabled)
        return;

    togglePopup();
}

const togglePopup = () =>
{
    if (props.disabled)
        return;

    if (isOpen.value)
    {
        closePopup();
    }
    else
    {
        openPopup();
    }
}

const openPopup = () =>
{
    if (props.disabled)
        return;

    if (selectedDate.value)
    {
        currentYear.value = selectedDate.value[0];
        currentMonth.value = selectedDate.value[1];
    }
    else
    {
        currentYear.value = today.value[0];
        currentMonth.value = today.value[1];
    }

    isOpen.value = true;
    emit('open');

    nextTick(() =>
    {
        calculatePopupPosition();
    })
}

const closePopup = () =>
{
    isOpen.value = false;
    emit('close');
}

const calculatePopupPosition = () =>
{
    if (!wrapperRef.value)
        return;

    if (props.position === 'top')
    {
        popupPosition.value = 'top';
    }
    else if (props.position === 'bottom')
    {
        popupPosition.value = 'bottom';
    }
    else
    {
        const rect = wrapperRef.value.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        popupPosition.value = spaceBelow < 400 && spaceAbove > spaceBelow ? 'top' : 'bottom';
    }
}

const selectDate = (day: CalendarDay) =>
{
    if (day.isDisabled || day.day === 0)
        return;

    selectedDate.value = [currentYear.value, currentMonth.value, day.day];
    emit('update:modelValue', selectedDate.value);
    emit('change', selectedDate.value);

    closePopup();
}

const selectToday = () =>
{
    selectedDate.value = [...today.value];
    currentYear.value = today.value[0];
    currentMonth.value = today.value[1];

    emit('update:modelValue', selectedDate.value);
    emit('change', selectedDate.value);

    closePopup();
}

const clearDate = () =>
{
    selectedDate.value = null;
    emit('update:modelValue', null);
    emit('change', null);
}

const handleNextMonth = () =>
{
    if (currentMonth.value === 12)
    {
        currentMonth.value = 1;
        currentYear.value++;
    }
    else
    {
        currentMonth.value++;
    }
}

const handlePrevMonth = () =>
{
    if (currentMonth.value === 1)
    {
        currentMonth.value = 12;
        currentYear.value--;
    }
    else
    {
        currentMonth.value--;
    }
}

const handleNextYear = () =>
{
    currentYear.value++;
}

const handlePrevYear = () =>
{
    currentYear.value--;
}

const onFocus = () =>
{
    if (!props.readonly)
        return;
}

const onBlur = () =>
{
}

const setDate = (date: number[] | string | null) =>
{
    if (!date)
    {
        selectedDate.value = null;
        emit('update:modelValue', null);
        emit('change', null);

        return;
    }

    if (Array.isArray(date))
    {
        selectedDate.value = date
        currentYear.value = date[0]
        currentMonth.value = date[1]
    }
    else if (typeof date === 'string')
    {
        const parts = date.split(/[\/\-]/).map(Number);

        if (parts.length === 3)
        {
            selectedDate.value = parts;
            currentYear.value = parts[0];
            currentMonth.value = parts[1];
        }
    }

    emit('update:modelValue', selectedDate.value);
    emit('change', selectedDate.value);
}

const setDateFromGregorian = (gregorianDate: number[] | string) =>
{
    let gYear: number, gMonth: number, gDay: number;

    if (Array.isArray(gregorianDate))
    {
        [gYear, gMonth, gDay] = gregorianDate;
    }
    else
    {
        const parts = gregorianDate.split(/[\/\-]/).map(Number);

        if (parts.length !== 3)
            return;

        [gYear, gMonth, gDay] = parts;
    }

    const jalaliDate = gregorianToJalali(gYear, gMonth, gDay);
    setDate(jalaliDate);
}

const getSelectedDate = (): number[] | null =>
{
    return selectedDate.value;
}

defineExpose({
    setDate,
    setDateFromGregorian,
    getSelectedDate,
    selectToday,
    clearDate,
    openPopup,
    closePopup
})

const handleClickOutside = (event: MouseEvent) =>
{
    if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node))
    {
        closePopup();
    }
}

onMounted(() =>
{
    initializeDate();
    detectSystemTheme();

    if (typeof window !== 'undefined' && window.matchMedia)
    {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', detectSystemTheme);
    }

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', calculatePopupPosition);
    window.addEventListener('scroll', calculatePopupPosition, true);
});

onUnmounted(() =>
{
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', calculatePopupPosition);
    window.removeEventListener('scroll', calculatePopupPosition, true);
});

</script>

<template>

    <div
        class="persian-datepicker-wrapper"
        ref="wrapperRef"
        :style="{ fontFamily: fontFamily, ...getCSSVariables }"
        :class="[`theme-${currentTheme}`]"
    >
        <slot
            name="input"
            :displayValue="displayValue"
            :togglePopup="togglePopup"
            :clearDate="clearDate"
            :isOpen="isOpen"
        >
            <div class="datepicker-input-container">
                <slot
                    name="input-field"
                    :displayValue="displayValue"
                    :togglePopup="togglePopup"
                    :onFocus="onFocus"
                    :onBlur="onBlur"
                >
                    <input
                        ref="inputRef"
                        type="text"
                        :value="displayValue"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        :readonly="readonly"
                        class="datepicker-input"
                        @click="handleInputClick"
                        @focus="onFocus"
                        @blur="onBlur"
                    />
                </slot>

                <slot name="icon" :togglePopup="togglePopup">
                    <span class="datepicker-icon" @click.stop="togglePopup">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    </span>
                </slot>

                <slot
                    name="clear-button"
                    :clearDate="clearDate"
                    :displayValue="displayValue"
                >
                    <button
                        v-if="clearable && displayValue"
                        class="datepicker-clear"
                        @click.stop="clearDate"
                        type="button"
                    >
                        ×
                    </button>
                </slot>
            </div>
        </slot>

        <transition name="datepicker-fade">
            <slot
                name="popup"
                v-if="isOpen"
                :closePopup="closePopup"
                :selectToday="selectToday"
                :calendarDays="calendarDays"
                :selectDate="selectDate"
                :currentYear="currentYear"
                :currentMonth="currentMonth"
                :formattedSelectedDate="formattedSelectedDate"
            >
                <div
                    v-if="isOpen"
                    class="datepicker-popup"
                    @click.stop
                >
                    <slot
                        name="popup-header"
                        :currentYear="currentYear"
                        :currentMonth="currentMonth"
                        :handleNextYear="handleNextYear"
                        :handlePrevYear="handlePrevYear"
                        :handleNextMonth="handleNextMonth"
                        :handlePrevMonth="handlePrevMonth"
                        :persianMonthName="persianMonthName"
                    >
                        <div class="datepicker-header">
                            <slot
                                name="year-selector"
                                :currentYear="currentYear"
                                :handleNextYear="handleNextYear"
                                :handlePrevYear="handlePrevYear"
                            >
                                <div class="year-selector">
                                    <button @click="handleNextYear" class="nav-btn" type="button">
                                        <slot name="next-year-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </slot>
                                    </button>

                                    <span class="year-display">
                                        <slot name="year-display" :year="currentYear">
                                            {{ currentYear }}
                                        </slot>
                                    </span>

                                    <button @click="handlePrevYear" class="nav-btn" type="button">
                                        <slot name="prev-year-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </slot>
                                    </button>
                                </div>
                            </slot>

                            <slot
                                name="month-selector"
                                :currentMonth="currentMonth"
                                :monthName="persianMonthName(currentMonth)"
                                :handleNextMonth="handleNextMonth"
                                :handlePrevMonth="handlePrevMonth"
                            >
                                <div class="month-selector">
                                    <button @click="handleNextMonth" class="nav-btn" type="button">
                                        <slot name="next-month-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </slot>
                                    </button>

                                    <span class="month-display">
                                        <slot name="month-display" :month="currentMonth" :monthName="persianMonthName(currentMonth)">
                                            {{ persianMonthName(currentMonth) }}
                                        </slot>
                                    </span>

                                    <button @click="handlePrevMonth" class="nav-btn" type="button">
                                        <slot name="prev-month-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </slot>
                                    </button>
                                </div>
                            </slot>
                        </div>
                    </slot>

                    <slot
                        name="quick-actions"
                        :selectToday="selectToday"
                        :closePopup="closePopup"
                    >
                        <div v-if="showTodayButton || showCloseButton" class="datepicker-quick-actions">
                            <slot name="today-button" :selectToday="selectToday">
                                <button v-if="showTodayButton" @click="selectToday" class="quick-btn" type="button">
                                    امروز
                                </button>
                            </slot>

                            <slot name="close-button" :closePopup="closePopup">
                                <button v-if="showCloseButton" @click="closePopup" class="quick-btn" type="button">
                                    بستن
                                </button>
                            </slot>
                        </div>
                    </slot>

                    <slot name="day-names" :dayNames="dayNames">
                        <div class="datepicker-days-header">
                            <div v-for="(day, index) in dayNames" :key="day" class="day-name">
                                <slot name="day-name" :day="day" :index="index">
                                    {{ day }}
                                </slot>
                            </div>
                        </div>
                    </slot>

                    <slot
                        name="calendar-grid"
                        :calendarDays="calendarDays"
                        :selectDate="selectDate"
                        :getDayClasses="getDayClasses"
                    >
                        <div class="datepicker-days">
                            <div
                                v-for="(day, index) in calendarDays"
                                :key="index"
                                :class="getDayClasses(day)"
                                :title="showOccasions ? getDayTooltip(day) : ''"
                                @click="selectDate(day)"
                            >
                                <slot
                                    name="day-cell"
                                    :day="day"
                                    :index="index"
                                >
                                    <span>
                                        {{ day.display }}
                                    </span>
                                </slot>
                            </div>
                        </div>
                    </slot>

                    <slot
                        name="popup-footer"
                        :selectedDate="selectedDate"
                        :formattedSelectedDate="formattedSelectedDate"
                    >
                        <div v-if="selectedDate" class="datepicker-footer">
                            <slot name="selected-date-text" :formattedDate="formattedSelectedDate">
                                <span class="selected-date-text">
                                    {{ formattedSelectedDate }}
                                </span>
                            </slot>
                        </div>
                    </slot>
                </div>
            </slot>
        </transition>
    </div>

</template>

<style scoped>

@import "../styles/datepicker.css";

</style>