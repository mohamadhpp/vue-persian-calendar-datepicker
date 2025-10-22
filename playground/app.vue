<script setup lang="ts">

import { ref, computed } from 'vue';

const
{
    today,
    persianMonthName,
    hijriMonthName,
    gregorianMonthName,
    jalaliToGregorian,
    jalaliToHijri,
    dayCountInMonth
} = usePersianCalendar();

// State
const activeTab = ref('datepicker');
const tabs = [
    { id: 'datepicker', label: 'انتخابگر تاریخ', icon: '📅' },
    { id: 'calendar', label: 'تقویم', icon: '📆' },
    { id: 'slots', label: 'Slots سفارشی', icon: '🎨' },
    { id: 'api', label: 'API', icon: '⚙️' }
];

// Dates for DatePicker
const dates = ref({
    basic: null as number[] | null,
    format1: null as number[] | null,
    format2: null as number[] | null,
    format3: null as number[] | null,
    format4: null as number[] | null,
    future: null as number[] | null,
    past: null as number[] | null,
    currentMonth: null as number[] | null,
    customIcon: null as number[] | null,
    customInput: null as number[] | null,
    customDayCell: null as number[] | null,
    customActions: null as number[] | null,
    customHeader: null as number[] | null,
    customFooter: null as number[] | null
});

// Dates for Calendar
const calendarDates = ref({
    basic: null as number[] | null,
    customHeader: null as number[] | null,
    customDay: null as number[] | null,
    programmatic: null as number[] | null
});

const dateRange = ref({
    start: null as number[] | null,
    end: null as number[] | null
});

const convertYear = ref(1403);
const convertMonth = ref(7);
const convertDay = ref(15);
const convertedDates = ref<any>(null);

const programmaticDate = ref<number[] | null>(null);
const programmaticPicker = ref<InstanceType<typeof PersianDatePicker> | null>(null);
const customActionsPicker = ref<InstanceType<typeof PersianDatePicker> | null>(null);
const basicCalendar = ref<InstanceType<typeof PersianCalendar> | null>(null);
const customCalendarHeader = ref<InstanceType<typeof PersianCalendar> | null>(null);
const customDayCalendar = ref<InstanceType<typeof PersianCalendar> | null>(null);
const programmaticCalendar = ref<InstanceType<typeof PersianCalendar> | null>(null);

// Computed
const todayPersianInfo = computed(() =>
{
    const [year, month, day] = today.value;
    return `${day} ${persianMonthName(month)} ${year}`;
});

const todayHijriInfo = computed(() =>
{
    const [hYear, hMonth, hDay] = jalaliToHijri(today.value[0], today.value[1], today.value[2]);
    return `${hDay} ${hijriMonthName(hMonth)} ${hYear}`;
});

const currentMonthStart = computed(() => [today.value[0], today.value[1], 1]);
const currentMonthEnd = computed(() =>
{
    const days = dayCountInMonth(today.value[0], today.value[1])
    return [today.value[0], today.value[1], days]
});

const dateRangeDays = computed(() =>
{
    if (!dateRange.value.start || !dateRange.value.end)
        return null;

    const [y1, m1, d1] = dateRange.value.start;
    const [y2, m2, d2] = dateRange.value.end;

    let days = 0;
    let currentYear = y1;
    let currentMonth = m1;
    let currentDay = d1;

    while (
        currentYear < y2 ||
        (currentYear === y2 && currentMonth < m2) ||
        (currentYear === y2 && currentMonth === m2 && currentDay <= d2)
    )
    {
        days++;
        currentDay++;

        const monthDays = dayCountInMonth(currentYear, currentMonth);

        if (currentDay > monthDays)
        {
            currentDay = 1;
            currentMonth++;

            if (currentMonth > 12)
            {
                currentMonth = 1;
                currentYear++;
            }
        }
    }

    return days;
})

// Methods
const formatDate = (date: number[] | null): string =>
{
    if (!date)
        return '';

    const [year, month, day] = date;
    return `${day} ${persianMonthName(month)} ${year}`;
}

const handleDateChange = (type: string, value: number[] | null) =>
{
    console.log(`${type} date changed:`, value);
}

const handleCalendarDateChange = (type: string, event: { date: number[] }) =>
{
    calendarDates.value[type as keyof typeof calendarDates.value] = event.date;
    console.log(`${type} calendar date changed:`, event.date);
}

const convertDate = () =>
{
    const gregorian = jalaliToGregorian(convertYear.value, convertMonth.value, convertDay.value);
    const hijri = jalaliToHijri(convertYear.value, convertMonth.value, convertDay.value);

    convertedDates.value = { gregorian, hijri };
}

const setProgrammaticToday = () =>
{
    programmaticPicker.value?.setDate([...today.value]);
}

const setProgrammaticTomorrow = () =>
{
    const [y, m, d] = today.value;
    let newDay = d + 1;
    let newMonth = m;
    let newYear = y;

    const monthDays = dayCountInMonth(y, m);

    if (newDay > monthDays)
    {
        newDay = 1;
        newMonth++;

        if (newMonth > 12)
        {
            newMonth = 1;
            newYear++;
        }
    }

    programmaticPicker.value?.setDate([newYear, newMonth, newDay]);
}

const setProgrammaticNextWeek = () =>
{
    const [y, m, d] = today.value;
    let newDay = d + 7;
    let newMonth = m;
    let newYear = y;

    while (newDay > dayCountInMonth(newYear, newMonth))
    {
        newDay -= dayCountInMonth(newYear, newMonth);
        newMonth++;

        if (newMonth > 12)
        {
            newMonth = 1;
            newYear++;
        }
    }

    programmaticPicker.value?.setDate([newYear, newMonth, newDay]);
}

const setProgrammaticNextMonth = () =>
{
    const [y, m, d] = today.value;
    let newMonth = m + 1;
    let newYear = y;

    if (newMonth > 12)
    {
        newMonth = 1;
        newYear++;
    }

    programmaticPicker.value?.setDate([newYear, newMonth, d]);
}

const clearProgrammatic = () =>
{
    programmaticPicker.value?.clearDate();
}

const openProgrammaticPicker = () =>
{
    programmaticPicker.value?.openPopup();
}

const closeProgrammaticPicker = () =>
{
    programmaticPicker.value?.closePopup();
}

const selectYesterday = () =>
{
    const [y, m, d] = today.value;
    let newDay = d - 1;
    let newMonth = m;
    let newYear = y;

    if (newDay < 1)
    {
        newMonth--;

        if (newMonth < 1)
        {
            newMonth = 12;
            newYear--;
        }

        newDay = dayCountInMonth(newYear, newMonth);
    }

    customActionsPicker.value?.setDate([newYear, newMonth, newDay]);
}

const setCalendarToday = () =>
{
    basicCalendar.value?.setDate([...today.value]);
    customCalendarHeader.value?.setDate([...today.value]);
    customDayCalendar.value?.setDate([...today.value]);
    programmaticCalendar.value?.setDate([...today.value]);
}

const setCalendarTomorrow = () =>
{
    const [y, m, d] = today.value;
    let newDay = d + 1;
    let newMonth = m;
    let newYear = y;

    const monthDays = dayCountInMonth(y, m);
    if (newDay > monthDays)
    {
        newDay = 1;
        newMonth++;

        if (newMonth > 12)
        {
            newMonth = 1;
            newYear++;
        }
    }

    programmaticCalendar.value?.setDate([newYear, newMonth, newDay]);
}

const setCalendarNextWeek = () =>
{
    const [y, m, d] = today.value;
    let newDay = d + 7;
    let newMonth = m;
    let newYear = y;

    while (newDay > dayCountInMonth(newYear, newMonth))
    {
        newDay -= dayCountInMonth(newYear, newMonth);
        newMonth++;

        if (newMonth > 12)
        {
            newMonth = 1;
            newYear++;
        }
    }

    programmaticCalendar.value?.setDate([newYear, newMonth, newDay]);
}

const setCalendarNextMonth = () =>
{
    const [y, m, d] = today.value;
    let newMonth = m + 1;
    let newYear = y;

    if (newMonth > 12)
    {
        newMonth = 1;
        newYear++;
    }

    programmaticCalendar.value?.setDate([newYear, newMonth, d]);
}

const handleFooterAction = () =>
{
    alert('تاریخ ذخیره شد!');
}

</script>

<template>
    <div class="playground-container">
        <!-- Header -->
        <header class="header">
            <h1>
                تقویم شمسی ایران
            </h1>

            <p class="subtitle">
                Vue Persian DatePicker & Calendar - With Slots
            </p>

            <div class="header-info">
                <span>
                    {{ todayPersianInfo }}
                </span>

                <span>
                    {{ todayHijriInfo }}
                </span>
            </div>
        </header>

        <!-- Navigation Tabs -->
        <div class="tabs">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                :class="['tab', { active: activeTab === tab.id }]"
                @click="activeTab = tab.id"
            >
                {{ tab.icon }} {{ tab.label }}
            </button>
        </div>

        <!-- Tab Content -->
        <div class="content">
            <!-- Tab 1: DatePicker Examples -->
            <section v-show="activeTab === 'datepicker'" class="tab-content">
                <h2>
                    انتخابگر تاریخ (DatePicker)
                </h2>

                <!-- Basic DatePicker -->
                <div class="example-card">
                    <h3>
                        ۱. استفاده پایه
                    </h3>

                    <PersianDatePicker
                        v-model="dates.basic"
                        placeholder="تاریخ را انتخاب کنید"
                        @change="handleDateChange('basic', $event)"
                        :show-today-button="true"
                        :show-close-button="true"
                        :show-occasions="true"
                    />
                    <div v-if="dates.basic" class="result">
                        <strong>
                            مقدار انتخابی:
                        </strong>

                        {{ formatDate(dates.basic) }}
                    </div>
                </div>

                <!-- Different Formats -->
                <div class="example-card">
                    <h3>
                        ۲. فرمت‌های مختلف
                    </h3>

                    <div class="format-grid">
                        <div>
                            <label>
                                YYYY/MM/DD
                            </label>

                            <PersianDatePicker
                                v-model="dates.format1"
                                format="YYYY/MM/DD"
                                placeholder="YYYY/MM/DD"
                            />
                        </div>

                        <div>
                            <label>
                                DD/MM/YYYY
                            </label>

                            <PersianDatePicker
                                v-model="dates.format2"
                                format="DD/MM/YYYY"
                                placeholder="DD/MM/YYYY"
                            />
                        </div>

                        <div>
                            <label>
                                متنی (Text)
                            </label>

                            <PersianDatePicker
                                v-model="dates.format3"
                                format="text"
                                placeholder="متنی"
                            />
                        </div>

                        <div>
                            <label>
                                YYYY-MM-DD
                            </label>

                            <PersianDatePicker
                                v-model="dates.format4"
                                format="YYYY-MM-DD"
                                placeholder="YYYY-MM-DD"
                            />
                        </div>
                    </div>
                </div>

                <!-- Date Range -->
                <div class="example-card">
                    <h3>
                        ۳. بازه تاریخ (Date Range)
                    </h3>

                    <div class="date-range">
                        <div>
                            <label>
                                از تاریخ:
                            </label>

                            <PersianDatePicker
                                v-model="dateRange.start"
                                placeholder="تاریخ شروع"
                                :to="dateRange.end"
                            />
                        </div>

                        <div>
                            <label>
                                تا تاریخ:
                            </label>

                            <PersianDatePicker
                                v-model="dateRange.end"
                                placeholder="تاریخ پایان"
                                :from="dateRange.start"
                            />
                        </div>
                    </div>

                    <div v-if="dateRangeDays" class="result success">
                        تعداد روزهای بازه:

                        <strong>
                            {{ dateRangeDays }} روز
                        </strong>
                    </div>
                </div>

                <!-- Date Limits -->
                <div class="example-card">
                    <h3>
                        ۴. محدودیت تاریخ
                    </h3>

                    <div class="limits-grid">
                        <div>
                            <label>
                                فقط آینده (از امروز)
                            </label>

                            <PersianDatePicker
                                v-model="dates.future"
                                :from="today"
                                placeholder="فقط تاریخ‌های آینده"
                            />
                        </div>

                        <div>
                            <label>
                                فقط گذشته (تا امروز)
                            </label>

                            <PersianDatePicker
                                v-model="dates.past"
                                :to="today"
                                placeholder="فقط تاریخ‌های گذشته"
                            />
                        </div>

                        <div>
                            <label>
                                ماه جاری
                            </label>

                            <PersianDatePicker
                                v-model="dates.currentMonth"
                                :from="currentMonthStart"
                                :to="currentMonthEnd"
                                placeholder="فقط ماه جاری"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Tab 2: Calendar Examples -->
            <section v-show="activeTab === 'calendar'" class="tab-content">
                <h2>
                    تقویم شمسی
                </h2>

                <!-- Basic Calendar -->
                <div class="example-card">
                    <h3>
                        ۱. تقویم پایه
                    </h3>

                    <PersianCalendar
                        ref="basicCalendar"
                        @select-date="handleCalendarDateChange('basic', $event)"
                        :show-info="true"
                        :show-events="true"
                        :show-occasions="true"
                    />

                    <div v-if="calendarDates.basic" class="result">
                        <strong>
                            تاریخ انتخابی:
                        </strong>

                        {{ formatDate(calendarDates.basic) }}
                    </div>
                </div>

                <!-- Custom Calendar Header -->
                <div class="example-card">
                    <h3>
                        ۲. هدر سفارشی تقویم
                    </h3>

                    <PersianCalendar
                        ref="customCalendarHeader"
                        @select-date="handleCalendarDateChange('customHeader', $event)"
                    >
                        <template #header="{ selectedDay, persianMonthName, handleNextMonth, handlePrevMonth }">
                            <div class="custom-calendar-header">
                                <button
                                    @click="handlePrevMonth"
                                    class="calendar-nav-btn"
                                >
                                    ► ماه قبل
                                </button>

                                <h3>
                                    {{ persianMonthName(selectedDay[1]) }} {{ selectedDay[0] }}
                                </h3>

                                <button
                                    @click="handleNextMonth"
                                    class="calendar-nav-btn"
                                >
                                    ماه بعد ◄
                                </button>
                            </div>
                        </template>
                    </PersianCalendar>

                    <div v-if="calendarDates.customHeader" class="result">
                        <strong>
                            تاریخ انتخابی:
                        </strong>

                        {{ formatDate(calendarDates.customHeader) }}
                    </div>
                </div>

                <!-- Custom Day Cell -->
                <div class="example-card">
                    <h3>
                        ۳. سلول روز سفارشی
                    </h3>

                    <PersianCalendar
                        ref="customDayCalendar"
                        @select-date="handleCalendarDateChange('customDay', $event)"
                    >
                        <template #day-cell="{ day }">
                            <div class="custom-day-cell">
                                <span>
                                    {{ day.display }}
                                </span>

                                <span v-if="day.isToday" class="today-badge">
                                    امروز
                                </span>

                                <span v-if="day.isFriday" class="friday-badge">
                                    جمعه
                                </span>
                            </div>
                        </template>
                    </PersianCalendar>

                    <div v-if="calendarDates.customDay" class="result">
                        <strong>
                            تاریخ انتخابی:
                        </strong>

                        {{ formatDate(calendarDates.customDay) }}
                    </div>
                </div>

                <!-- Programmatic Calendar Control -->
                <div class="example-card">
                    <h3>
                        ۴. کنترل متدها
                    </h3>

                    <PersianCalendar
                        ref="programmaticCalendar"
                        @select-date="handleCalendarDateChange('programmatic', $event)"
                    />

                    <div class="button-group">
                        <button @click="setCalendarToday" class="prog-btn">
                            امروز
                        </button>

                        <button @click="setCalendarTomorrow" class="prog-btn">
                            فردا
                        </button>

                        <button @click="setCalendarNextWeek" class="prog-btn">
                            هفته بعد
                        </button>

                        <button @click="setCalendarNextMonth" class="prog-btn">
                            ماه بعد
                        </button>
                    </div>

                    <div v-if="calendarDates.programmatic" class="result">
                        <strong>
                            تاریخ فعلی:
                        </strong>

                        {{ formatDate(calendarDates.programmatic) }}
                    </div>
                </div>
            </section>

            <!-- Tab 3: Slots Customization -->
            <section v-show="activeTab === 'slots'" class="tab-content">
                <h2>
                    سفارشی‌سازی با Slots
                </h2>

                <!-- Custom DatePicker with Icon -->
                <div class="example-card">
                    <h3>
                        ۱. DatePicker با آیکون سفارشی
                    </h3>

                    <PersianDatePicker v-model="dates.customIcon">
                        <template #icon="{ togglePopup }">
                            <span class="custom-icon" @click="togglePopup">
                              🗓️
                            </span>
                        </template>
                    </PersianDatePicker>

                    <div v-if="dates.customIcon" class="result">
                        <strong>
                            تاریخ انتخابی:
                        </strong>

                        {{ formatDate(dates.customIcon) }}
                    </div>
                </div>

                <!-- Custom Input Field -->
                <div class="example-card">
                    <h3>
                        ۲. فیلد ورودی سفارشی
                    </h3>

                    <PersianDatePicker v-model="dates.customInput">
                        <template #input-field="{ displayValue, togglePopup }">
                            <button @click="togglePopup" class="custom-input-btn">
                                📅 {{ displayValue || 'انتخاب تاریخ' }}
                            </button>
                        </template>

                        <template #icon="{ togglePopup }">
                            <span></span>
                        </template>

                        <template #clear-button="{  }">
                            <span></span>
                        </template>
                    </PersianDatePicker>

                    <div v-if="dates.customInput" class="result">
                        <strong>تاریخ انتخابی:</strong> {{ formatDate(dates.customInput) }}
                    </div>
                </div>

                <!-- Custom Day Cell -->
                <div class="example-card">
                    <h3>
                        ۳. سلول روز سفارشی
                    </h3>

                    <PersianDatePicker v-model="dates.customDayCell">
                        <template #day-cell="{ day }">
                            <div class="fancy-day-cell">
                                <span class="day-number">
                                    {{ day.display }}
                                </span>

                                <span v-if="day.isToday" class="today-indicator">
                                    ●
                                </span>

                                <span v-if="day.isFriday" class="friday-indicator">
                                    جمعه
                                </span>
                            </div>
                        </template>
                    </PersianDatePicker>

                    <div v-if="dates.customDayCell" class="result">
                        <strong>
                            تاریخ انتخابی:
                        </strong>

                        {{ formatDate(dates.customDayCell) }}
                    </div>
                </div>

                <!-- Custom Quick Actions -->
                <div class="example-card">
                    <h3>
                        ۴. دکمه‌های سریع سفارشی
                    </h3>

                    <PersianDatePicker v-model="dates.customActions" ref="customActionsPicker">
                        <template #quick-actions="{ selectToday, closePopup }">
                            <div class="custom-quick-actions">
                                <button @click="selectToday" class="action-btn primary">
                                    امروز
                                </button>

                                <button @click="selectYesterday" class="action-btn">
                                    دیروز
                                </button>

                                <button @click="closePopup" class="action-btn danger">
                                    بستن
                                </button>
                            </div>
                        </template>
                    </PersianDatePicker>

                    <div v-if="dates.customActions" class="result">
                        <strong>
                            تاریخ انتخابی:
                        </strong>

                        {{ formatDate(dates.customActions) }}
                    </div>
                </div>

                <!-- Custom Popup Header -->
                <div class="example-card">
                    <h3>
                        ۵. هدر سفارشی
                    </h3>

                    <PersianDatePicker v-model="dates.customHeader">
                        <template
                            #popup-header="{ currentYear, currentMonth, handleNextMonth, handlePrevMonth, handleNextYear, handlePrevYear, persianMonthName }"
                        >
                            <div class="fancy-header">
                                <div class="nav-section">
                                    <button @click="handlePrevYear" class="fancy-btn">
                                        ⏩
                                    </button>

                                    <button @click="handlePrevMonth" class="fancy-btn">
                                        ▶
                                    </button>
                                </div>

                                <div class="date-display">
                                    <h3>
                                        {{ persianMonthName(currentMonth) }}
                                    </h3>

                                    <span class="year-badge">
                                        {{ currentYear }}
                                    </span>
                                </div>

                                <div class="nav-section">
                                    <button @click="handleNextMonth" class="fancy-btn">
                                        ◀
                                    </button>

                                    <button @click="handleNextYear" class="fancy-btn">
                                        ⏪
                                    </button>
                                </div>
                            </div>
                        </template>
                    </PersianDatePicker>

                    <div v-if="dates.customHeader" class="result">
                        <strong>
                            تاریخ انتخابی:
                        </strong>

                        {{ formatDate(dates.customHeader) }}
                    </div>
                </div>

                <!-- Custom Footer -->
                <div class="example-card">
                    <h3>
                        ۶. فوتر سفارشی
                    </h3>

                    <PersianDatePicker v-model="dates.customFooter">
                        <template #popup-footer="{ formattedSelectedDate }">
                            <div class="custom-footer">
                                <div class="footer-content">
                                    <span class="footer-label">
                                        تاریخ انتخابی:
                                    </span>

                                    <span class="footer-value">
                                        {{ formattedSelectedDate || 'هیچ تاریخی انتخاب نشده' }}
                                    </span>
                                </div>

                                <button @click="handleFooterAction" class="footer-btn">
                                    ذخیره تاریخ
                                </button>
                            </div>
                        </template>
                    </PersianDatePicker>

                    <div v-if="dates.customFooter" class="result">
                        <strong>
                            تاریخ انتخابی:
                        </strong>

                        {{ formatDate(dates.customFooter) }}
                    </div>
                </div>
            </section>

            <!-- Tab 4: API Examples -->
            <section v-show="activeTab === 'api'" class="tab-content">
                <h2>
                    کاربردها
                </h2>

                <!-- Composable Usage -->
                <div class="example-card">
                    <h3>
                        استفاده از Composable
                    </h3>

                    <div class="code-example">
                        <pre>
                            <code>
const {
    today,
    persianMonthName,
    hijriMonthName,
    gregorianMonthName,
    jalaliToGregorian,
    jalaliToHijri,
    getDayEvents
} = usePersianCalendar()
                            </code>
                        </pre>
                    </div>

                    <div class="api-demo">
                        <div class="api-item">
                            <strong>
                                today:
                            </strong>

                            <span class="api-value">
                                {{ JSON.stringify(today) }}
                            </span>
                        </div>

                        <div class="api-item">
                            <strong>
                                persianMonthName(7):
                            </strong>

                            <span class="api-value">
                                {{ persianMonthName(7) }}
                            </span>
                        </div>

                        <div class="api-item">
                            <strong>
                                hijriMonthName(1):
                            </strong>

                            <span class="api-value">
                                {{ hijriMonthName(1) }}
                            </span>
                        </div>

                        <div class="api-item">
                            <strong>
                                gregorianMonthName(10):
                            </strong>

                            <span class="api-value">
                                {{ gregorianMonthName(10) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Date Conversion -->
                <div class="example-card">
                    <h3>
                        تبدیل تاریخ
                    </h3>

                    <div class="converter">
                        <div class="converter-inputs">
                            <input v-model.number="convertYear" type="number" placeholder="سال" />
                            <input v-model.number="convertMonth" type="number" placeholder="ماه" min="1" max="12" />
                            <input v-model.number="convertDay" type="number" placeholder="روز" min="1" max="31" />
                            <button @click="convertDate" class="convert-btn">تبدیل</button>
                        </div>

                        <div v-if="convertedDates" class="converter-results">
                            <div class="convert-result">
                                <strong>
                                    میلادی:
                                </strong>

                                <span>
                                    {{ convertedDates.gregorian.join('/') }}
                                </span>
                            </div>

                            <div class="convert-result">
                                <strong>
                                    هجری قمری:
                                </strong>

                                <span>
                                    {{ convertedDates.hijri.join('/') }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Programmatic Control -->
                <div class="example-card">
                    <h3>
                        کنترل برنامه‌نویسی
                    </h3>

                    <PersianDatePicker v-model="programmaticDate" ref="programmaticPicker" />

                    <div class="button-group">
                        <button @click="setProgrammaticToday" class="prog-btn">
                            امروز
                        </button>

                        <button @click="setProgrammaticTomorrow" class="prog-btn">
                            فردا
                        </button>

                        <button @click="setProgrammaticNextWeek" class="prog-btn">
                            هفته بعد
                        </button>

                        <button @click="setProgrammaticNextMonth" class="prog-btn">
                            ماه بعد
                        </button>

                        <button @click="clearProgrammatic" class="prog-btn danger">
                            پاک کردن
                        </button>
                    </div>

                    <div v-if="programmaticDate" class="result">
                        <strong>
                            تاریخ فعلی:
                        </strong>

                        {{ formatDate(programmaticDate) }}
                    </div>
                </div>
            </section>
        </div>
    </div>

</template>

<style scoped>

.playground-container
{
    max-width: 1000px;
    margin: 0 auto;
    padding: 1.5rem;
    font-family: 'Tahoma', 'Segoe UI', sans-serif;
    direction: rtl;
    background: #ffffff;
    color: #333;
    line-height: 1.6;
}

/* Header */
.header
{
    text-align: center;
    margin-bottom: 1.5rem;
}

.header h1
{
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 0.5rem;
}

.subtitle
{
    font-size: 1rem;
    color: #7f8c8d;
    margin: 0;
}

.example-card label
{
    padding-bottom: 20px !important;
}

.header-info
{
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #555;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
}

/* Tabs */
.tabs
{
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
}

.tab
{
    padding: 0.6rem 1.2rem;
    background: #ecf0f1;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #34495e;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.tab.active
{
    background: #3498db;
    color: white;
}

.tab:hover:not(.active)
{
    background: #d5dbdb;
}

/* Content */
.content
{
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
}

.tab-content h2
{
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 1.2rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
}

.example-card
{
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #eaeaea;
}

.example-card h3
{
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 0.8rem;
}

/* Grids & Layouts */
.format-grid,
.limits-grid,
.date-range,
.converter-inputs,
.button-group,
.custom-quick-actions
{
    margin-top: 1.5rem;
    display: grid;
    gap: 0.8rem;
}

.format-grid,
.limits-grid
{
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.date-range,
.converter-inputs,
.button-group,
.custom-quick-actions
{
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

/* Inputs & Buttons */
input,
button,
.convert-btn,
.prog-btn,
.action-btn,
.fancy-btn,
.footer-btn,
.calendar-nav-btn
{
    padding: 0.6rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-family: inherit;
    border: 1px solid #ccc;
    background: #fff;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
}

input
{
    border-color: #ddd;
    direction: rtl;
}

input:focus
{
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

button:hover,
.convert-btn:hover,
.prog-btn:hover,
.action-btn:hover,
.fancy-btn:hover,
.footer-btn:hover,
.calendar-nav-btn:hover
{
    background: #f0f0f0;
}

.action-btn.primary,
.fancy-btn,
.footer-btn,
.prog-btn:not(.danger),
.calendar-nav-btn
{
    background: #3498db;
    color: white;
    border: none;
}

.action-btn.primary:hover,
.fancy-btn:hover,
.footer-btn:hover,
.prog-btn:not(.danger):hover,
.calendar-nav-btn:hover
{
    background: #2980b9;
}

.action-btn.danger,
.prog-btn.danger
{
    background: #e74c3c;
    color: white;
    border: none;
}

.action-btn.danger:hover,
.prog-btn.danger:hover
{
    background: #c0392b;
}

/* Results & Info */
.result,
.api-item,
.convert-result
{
    margin-top: 0.8rem;
    font-size: 0.9rem;
    color: #27ae60;
    font-weight: 500;
}

.result strong,
.api-item strong,
.convert-result strong
{
    color: #2c3e50;
}

/* Custom Slots */
.custom-icon,
.custom-input-btn
{
    font-size: 1.2rem;
    cursor: pointer;
    color: #3498db;
    margin: 5px;
}

.custom-input-btn
{
    background: #f5f5f5;
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    border-radius: 6px;
}

.fancy-day-cell,
.custom-day-cell
{
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.today-indicator,
.friday-indicator,
.today-badge,
.friday-badge
{
    font-size: 0.6rem;
    color: #e74c3c;
    margin-right: 0.2rem;
}

.today-badge,
.friday-badge
{
    position: absolute;
    top: 2px;
    font-size: 0.5rem;
}

.fancy-header,
.custom-calendar-header
{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f5f5f5;
    padding: 0.5rem;
    border-radius: 6px;
}

.custom-calendar-header h3
{
    margin: 0;
    font-size: 1rem;
}

.nav-section
{
    display: flex;
    gap: 0.4rem;
}

.date-display
{
    text-align: center;
}

.date-display h3
{
    margin: 0;
    font-size: 1rem;
}

.year-badge
{
    background: #3498db;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
}

.custom-footer
{
    background: #fff;
    padding: 0.8rem;
    border-radius: 6px;
    border: 1px solid #eaeaea;
    margin-top: 0.8rem;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer-content
{
    display: flex;
    gap: 0.5rem;
}

.footer-label
{
    color: #7f8c8d;
}

.footer-value
{
    font-weight: 500;
    color: #2c3e50;
}

/* Code Block */

.code-example pre code
{
    padding: 0 !important;
}

.code-example pre
{
    color: #ecf0f1;
    font-size: 0.85rem;
    overflow-x: auto;
    margin: 0.8rem 0;
    padding: 15px;
    border-radius: 6px;
    background: #2c3e50;
    font-family: 'Courier New', monospace;
    direction: ltr;
    text-align: left;
}

/* Footer */
.footer
{
    text-align: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px dashed #ddd;
    font-size: 0.85rem;
    color: #95a5a6;
}

.footer-note
{
    font-size: 0.75rem;
    color: #bdc3c7;
    margin-top: 0.3rem;
}

/* Responsive */
@media (max-width: 768px)
{
    .playground-container
    {
        padding: 1rem;
    }

    .header h1
    {
        font-size: 1.5rem;
    }

    .tabs,
    .format-grid,
    .limits-grid,
    .date-range,
    .converter-inputs,
    .button-group,
    .custom-quick-actions
    {
        flex-direction: column;
    }

    .tab
    {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
}

</style>