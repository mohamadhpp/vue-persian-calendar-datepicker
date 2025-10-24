<script setup lang="ts">

import { ref, computed, watch, onMounted } from 'vue';
import { usePersianCalendar } from '../composables';

interface CalendarDay
{
    day: number
    display: string
    title: string
    isToday: boolean
    isSelected: boolean
    isFriday: boolean
    isHoliday: boolean
    isDisabled: boolean
    weekDay: number
    events?: { persianEvents: string[], hijriEvents: string[] }
}

interface ColorScheme {
    background?: string
    text?: string
    navButton?: string
    navButtonHover?: string
    dayNameBg?: string
    dayNameText?: string
    dayBg?: string
    dayText?: string
    dayHover?: string
    todayBg?: string
    todayText?: string
    selectedBg?: string
    selectedText?: string
    fridayBg?: string
    fridayText?: string
    infoBg?: string
    infoText?: string
    border?: string
    disabledOpacity?: number
}

interface Props
{
    from?: number[]
    to?: number[]
    showInfo?: boolean
    showEvents?: boolean
    fontFamily?: string
    defaultDate?: number[] | string | null
    showOccasions?: boolean
    theme?: 'light' | 'dark' | 'auto'
    lightColors?: ColorScheme
    darkColors?: ColorScheme
}

const defaultLightColors: ColorScheme = {
    background: '#f5f5f5',
    text: '#333',
    navButton: '#cccccc',
    navButtonHover: '#b8b8b8',
    dayNameBg: '#e0e0e0',
    dayNameText: '#333',
    dayBg: '#ffffff',
    dayText: '#333',
    dayHover: '#e8e8e8',
    todayBg: 'rgba(76, 79, 255, 0.53)',
    todayText: '#ffffff',
    selectedBg: 'rgba(117, 206, 72, 0.49)',
    selectedText: '#ffffff',
    fridayBg: 'rgba(255, 52, 52, 0.55)',
    fridayText: '#ffffff',
    infoBg: '#ffffff',
    infoText: '#333',
    border: '#ccc',
    disabledOpacity: 0.3
}

const defaultDarkColors: ColorScheme = {
    background: '#2c3e50',
    text: '#ecf0f1',
    navButton: '#34495e',
    navButtonHover: '#1a252f',
    dayNameBg: '#34495e',
    dayNameText: '#ecf0f1',
    dayBg: '#34495e',
    dayText: '#ecf0f1',
    dayHover: '#1a252f',
    todayBg: 'rgba(52, 152, 219, 0.6)',
    todayText: '#ffffff',
    selectedBg: 'rgba(46, 204, 113, 0.6)',
    selectedText: '#ffffff',
    fridayBg: 'rgba(231, 76, 60, 0.6)',
    fridayText: '#ffffff',
    infoBg: '#34495e',
    infoText: '#ecf0f1',
    border: '#2c3e50',
    disabledOpacity: 0.3
}

const props = withDefaults(defineProps<Props>(),
{
    showInfo: true,
    showEvents: true,
    fontFamily: 'Tahoma, sans-serif',
    defaultDate: null,
    showOccasions: true,
    theme: 'light'
})

const emit = defineEmits<
{
    (e: 'select-date', date: any): void
    (e: 'update-today'): void
}>()

const
{
    today,
    selectedDay: composableSelectedDay,
    persianMonthName,
    nextMonth: composableNextMonth,
    prevMonth: composablePrevMonth,
    nextYear: composableNextYear,
    prevYear: composablePrevYear,
    getTodayEvents,
    getSelectedDayEvents,
    getSelectedDayPersianInfo,
    getSelectedDayHijriInfo,
    getSelectedDayGregorianInfo,
    dayCountInMonth,
    dayIndexOfWeek,
    jalaliToHijri,
    gregorianToJalali,
    getDayEvents
} = usePersianCalendar()

const selectedDay = ref([...composableSelectedDay.value])
const currentEvents = ref(getTodayEvents())

const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']

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

const currentColors = computed((): ColorScheme => {
    const isLight = currentTheme.value === 'light'
    const defaultColors = isLight ? defaultLightColors : defaultDarkColors
    const customColors = isLight ? props.lightColors : props.darkColors

    return {
        ...defaultColors,
        ...customColors
    }
})

const getCSSVariables = computed(() => {
    const colors = currentColors.value
    return {
        '--bg-color': colors.background,
        '--text-color': colors.text,
        '--nav-btn-color': colors.navButton,
        '--nav-btn-hover': colors.navButtonHover,
        '--day-name-bg': colors.dayNameBg,
        '--day-name-text': colors.dayNameText,
        '--day-bg': colors.dayBg,
        '--day-text': colors.dayText,
        '--day-hover': colors.dayHover,
        '--today-bg': colors.todayBg,
        '--today-text': colors.todayText,
        '--selected-bg': colors.selectedBg,
        '--selected-text': colors.selectedText,
        '--friday-bg': colors.fridayBg,
        '--friday-text': colors.fridayText,
        '--info-bg': colors.infoBg,
        '--info-text': colors.infoText,
        '--border-color': colors.border,
        '--disabled-opacity': colors.disabledOpacity
    }
})

const initializeDate = () =>
{
    const value = props.defaultDate;

    if (value)
    {
        if (Array.isArray(value))
        {
            selectedDay.value = value;
        }
        else if (typeof value === 'string')
        {
            const parts = value.split(/[\/\-]/).map(Number);
            if (parts.length === 3)
            {
                selectedDay.value = parts;
            }
        }
    }
}

const calendarDays = computed((): CalendarDay[] =>
{
    const year = selectedDay.value[0]
    const month = selectedDay.value[1]
    const dayOfWeek = dayIndexOfWeek(year, month, 1)
    const daysCount = dayCountInMonth(year, month)
    const days: CalendarDay[] = []

    let cellCounter = 1

    for (let i = 0; i < 42; i++)
    {
        if (i >= dayOfWeek && cellCounter <= daysCount)
        {
            const isToday = today.value[0] === year &&
            today.value[1] === month &&
            today.value[2] === cellCounter

            const isSelected = selectedDay.value[2] === cellCounter
            const weekDay = (i % 7)
            const isFriday = weekDay === 6
            const isDisabled = checkIfDisabled(year, month, cellCounter)

            const events = props.showOccasions ? getDayEvents(year, month, cellCounter) : undefined

            days.push({
                day: cellCounter,
                display: cellCounter.toString(),
                title: `${dayNames[weekDay]} ${cellCounter} ${persianMonthName(month)} ${year}`,
                isToday,
                isSelected,
                isFriday,
                isHoliday: false,
                isDisabled,
                weekDay,
                events
            })
            cellCounter++
        }
        else
        {
            days.push({
                day: 0,
                display: '.',
                title: '',
                isToday: false,
                isSelected: false,
                isFriday: false,
                isHoliday: false,
                isDisabled: true,
                weekDay: i % 7
            })
        }
    }

    return days
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
        'has-event': day.events && (day.events.persianEvents.length > 0 || day.events.hijriEvents.length > 0)
    }
}

const getDayTooltip = (day: CalendarDay): string =>
{
    if (!day.events || day.day === 0)
        return day.title;

    const events: string[] = [day.title];

    if (day.events.persianEvents.length > 0)
    {
        events.push('', '🎉 رویدادهای ایرانی:');
        events.push(...day.events.persianEvents);
    }

    if (day.events.hijriEvents.length > 0)
    {
        events.push('', '🌙 رویدادهای اسلامی:');
        events.push(...day.events.hijriEvents);
    }

    return events.join('\n');
}

const selectDay = (day: CalendarDay) =>
{
    if (day.isDisabled)
        return

    selectedDay.value[2] = day.day
    currentEvents.value = getSelectedDayEvents()

    emit('select-date',
    {
        date: [...selectedDay.value],
        events: currentEvents.value
    })
}

const handleNextMonth = () =>
{
    composableNextMonth()
    selectedDay.value = [...composableSelectedDay.value]
}

const handlePrevMonth = () =>
{
    composablePrevMonth()
    selectedDay.value = [...composableSelectedDay.value]
}

const handleNextYear = () =>
{
    composableNextYear()
    selectedDay.value = [...composableSelectedDay.value]
}

const handlePrevYear = () =>
{
    composablePrevYear()
    selectedDay.value = [...composableSelectedDay.value]
}

const setDate = (date: number[] | string | null) =>
{
    if (!date)
    {
        selectedDay.value = [...today.value];
        return;
    }

    if (Array.isArray(date))
    {
        selectedDay.value = date;
    }
    else if (typeof date === 'string')
    {
        const parts = date.split(/[\/\-]/).map(Number);
        if (parts.length === 3)
        {
            selectedDay.value = parts;
        }
    }
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
        if (parts.length !== 3) return;
        [gYear, gMonth, gDay] = parts;
    }

    const jalaliDate = gregorianToJalali(gYear, gMonth, gDay);
    setDate(jalaliDate);
}

const getSelectedDate = (): number[] =>
{
    return [...selectedDay.value];
}

const goToToday = () =>
{
    selectedDay.value = [...today.value];
    currentEvents.value = getTodayEvents();
}

defineExpose({
    setDate,
    setDateFromGregorian,
    getSelectedDate,
    goToToday
})

onMounted(() =>
{
    initializeDate();
    detectSystemTheme();

    if (typeof window !== 'undefined' && window.matchMedia)
    {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', detectSystemTheme);
    }

    if (!props.defaultDate)
    {
        selectedDay.value = [...today.value];
    }
    currentEvents.value = getTodayEvents();
})

</script>


<template>

    <div
        class="persian-calendar"
        :style="{ fontFamily: fontFamily, ...getCSSVariables }"
        :class="[`theme-${currentTheme}`]"
    >
        <slot
            name="header"
            :selectedDay="selectedDay"
            :persianMonthName="persianMonthName"
            :handleNextYear="handleNextYear"
            :handlePrevYear="handlePrevYear"
            :handleNextMonth="handleNextMonth"
            :handlePrevMonth="handlePrevMonth"
        >
            <div class="calendar-header">
                <slot
                    name="year-selector"
                    :year="selectedDay[0]"
                    :handleNextYear="handleNextYear"
                    :handlePrevYear="handlePrevYear"
                >
                    <div class="year-selector">
                        <button @click="handleNextYear" class="nav-btn">
                            <slot name="next-year-icon">
                                سال بعد
                            </slot>
                        </button>

                        <span class="year-display">
                            <slot name="year-display" :year="selectedDay[0]">
                                {{ selectedDay[0] }}
                            </slot>
                        </span>

                        <button @click="handlePrevYear" class="nav-btn">
                            <slot name="prev-year-icon">
                                سال قبل
                            </slot>
                        </button>
                    </div>
                </slot>

                <slot
                    name="month-selector"
                    :month="selectedDay[1]"
                    :monthName="persianMonthName(selectedDay[1])"
                    :handleNextMonth="handleNextMonth"
                    :handlePrevMonth="handlePrevMonth"
                >
                    <div class="month-selector">
                        <button @click="handleNextMonth" class="nav-btn">
                            <slot name="next-month-icon">
                                ماه بعد
                            </slot>
                        </button>

                        <span class="month-display">
                            <slot name="month-display" :month="selectedDay[1]" :monthName="persianMonthName(selectedDay[1])">
                                {{ persianMonthName(selectedDay[1]) }}
                            </slot>
                        </span>

                        <button @click="handlePrevMonth" class="nav-btn">
                            <slot name="prev-month-icon">
                                ماه قبل
                            </slot>
                        </button>
                    </div>
                </slot>
            </div>
        </slot>

        <slot name="day-names" :dayNames="dayNames">
            <div class="day-names">
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
            :selectDay="selectDay"
            :getDayClasses="getDayClasses"
        >
            <div class="calendar-days">
                <div
                    v-for="(day, index) in calendarDays"
                    :key="index"
                    :class="getDayClasses(day)"
                    :title="showOccasions ? getDayTooltip(day) : day.title"
                    @click="selectDay(day)"
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
            name="day-info"
            v-if="showInfo"
            :persianInfo="getSelectedDayPersianInfo()"
            :hijriInfo="getSelectedDayHijriInfo()"
            :gregorianInfo="getSelectedDayGregorianInfo()"
            :selectedDay="selectedDay"
        >
            <div class="day-info">
                <slot name="persian-info" :info="getSelectedDayPersianInfo()">
                    <p>
                        {{ getSelectedDayPersianInfo() }}
                    </p>
                </slot>

                <slot name="hijri-info" :info="getSelectedDayHijriInfo()">
                    <p>
                        {{ getSelectedDayHijriInfo() }}
                    </p>
                </slot>

                <slot name="gregorian-info" :info="getSelectedDayGregorianInfo()">
                    <p>
                        {{ getSelectedDayGregorianInfo() }}
                    </p>
                </slot>
            </div>
        </slot>

        <slot
            name="events"
            v-if="showEvents"
            :events="currentEvents"
        >
            <div class="day-events">
                <slot
                    name="persian-events"
                    :events="currentEvents.persianEvents"
                >
                    <div v-if="currentEvents.persianEvents.length" class="event-group">
                        <span v-for="(event, i) in currentEvents.persianEvents" :key="i">
                            <slot name="persian-event" :event="event" :index="i">
                                {{ event }}
                            </slot>
                        </span>
                    </div>
                </slot>

                <slot name="hijri-events"
                      :events="currentEvents.hijriEvents"
                >
                    <div v-if="currentEvents.hijriEvents.length"
                         class="event-group"
                    >
                        <span v-for="(event, i) in currentEvents.hijriEvents"
                              :key="i"
                        >
                            <slot name="hijri-event"
                                  :event="event"
                                  :index="i"
                            >
                                {{ event }}
                            </slot>
                        </span>
                    </div>
                </slot>
            </div>
        </slot>

        <slot name="footer"
              :selectedDay="selectedDay"
              :currentEvents="currentEvents"
        ></slot>
    </div>

</template>

<style scoped>

@import "../styles/calendar.css";

</style>