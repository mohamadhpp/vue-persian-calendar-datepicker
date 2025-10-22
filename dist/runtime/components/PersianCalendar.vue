<script setup>
import { ref, computed, watch, onMounted } from "vue";
const defaultLightColors = {
  background: "#f5f5f5",
  text: "#333",
  navButton: "#cccccc",
  navButtonHover: "#b8b8b8",
  dayNameBg: "#e0e0e0",
  dayNameText: "#333",
  dayBg: "#ffffff",
  dayText: "#333",
  dayHover: "#e8e8e8",
  todayBg: "rgba(76, 79, 255, 0.53)",
  todayText: "#ffffff",
  selectedBg: "rgba(117, 206, 72, 0.49)",
  selectedText: "#ffffff",
  fridayBg: "rgba(255, 52, 52, 0.55)",
  fridayText: "#ffffff",
  infoBg: "#ffffff",
  infoText: "#333",
  border: "#ccc",
  disabledOpacity: 0.3
};
const defaultDarkColors = {
  background: "#2c3e50",
  text: "#ecf0f1",
  navButton: "#34495e",
  navButtonHover: "#1a252f",
  dayNameBg: "#34495e",
  dayNameText: "#ecf0f1",
  dayBg: "#34495e",
  dayText: "#ecf0f1",
  dayHover: "#1a252f",
  todayBg: "rgba(52, 152, 219, 0.6)",
  todayText: "#ffffff",
  selectedBg: "rgba(46, 204, 113, 0.6)",
  selectedText: "#ffffff",
  fridayBg: "rgba(231, 76, 60, 0.6)",
  fridayText: "#ffffff",
  infoBg: "#34495e",
  infoText: "#ecf0f1",
  border: "#2c3e50",
  disabledOpacity: 0.3
};
const props = defineProps({
  from: { type: Array, required: false },
  to: { type: Array, required: false },
  showInfo: { type: Boolean, required: false, default: true },
  showEvents: { type: Boolean, required: false, default: true },
  fontFamily: { type: String, required: false, default: "Tahoma, sans-serif" },
  defaultDate: { type: [Array, String, null], required: false, default: null },
  showOccasions: { type: Boolean, required: false, default: true },
  theme: { type: String, required: false, default: "light" },
  lightColors: { type: Object, required: false },
  darkColors: { type: Object, required: false }
});
const emit = defineEmits(["select-date", "update-today"]);
const {
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
} = usePersianCalendar();
const selectedDay = ref([...composableSelectedDay.value]);
const currentEvents = ref(getTodayEvents());
const dayNames = ["\u0634\u0646\u0628\u0647", "\u06CC\u06A9\u0634\u0646\u0628\u0647", "\u062F\u0648\u0634\u0646\u0628\u0647", "\u0633\u0647\u200C\u0634\u0646\u0628\u0647", "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647", "\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647", "\u062C\u0645\u0639\u0647"];
const systemTheme = ref("light");
const detectSystemTheme = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    systemTheme.value = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
};
const currentTheme = computed(() => {
  if (props.theme === "auto")
    return systemTheme.value;
  return props.theme;
});
const currentColors = computed(() => {
  const isLight = currentTheme.value === "light";
  const defaultColors = isLight ? defaultLightColors : defaultDarkColors;
  const customColors = isLight ? props.lightColors : props.darkColors;
  return {
    ...defaultColors,
    ...customColors
  };
});
const getCSSVariables = computed(() => {
  const colors = currentColors.value;
  return {
    "--bg-color": colors.background,
    "--text-color": colors.text,
    "--nav-btn-color": colors.navButton,
    "--nav-btn-hover": colors.navButtonHover,
    "--day-name-bg": colors.dayNameBg,
    "--day-name-text": colors.dayNameText,
    "--day-bg": colors.dayBg,
    "--day-text": colors.dayText,
    "--day-hover": colors.dayHover,
    "--today-bg": colors.todayBg,
    "--today-text": colors.todayText,
    "--selected-bg": colors.selectedBg,
    "--selected-text": colors.selectedText,
    "--friday-bg": colors.fridayBg,
    "--friday-text": colors.fridayText,
    "--info-bg": colors.infoBg,
    "--info-text": colors.infoText,
    "--border-color": colors.border,
    "--disabled-opacity": colors.disabledOpacity
  };
});
const initializeDate = () => {
  const value = props.defaultDate;
  if (value) {
    if (Array.isArray(value)) {
      selectedDay.value = value;
    } else if (typeof value === "string") {
      const parts = value.split(/[\/\-]/).map(Number);
      if (parts.length === 3) {
        selectedDay.value = parts;
      }
    }
  }
};
const calendarDays = computed(() => {
  const year = selectedDay.value[0];
  const month = selectedDay.value[1];
  const dayOfWeek = dayIndexOfWeek(year, month, 1);
  const daysCount = dayCountInMonth(year, month);
  const days = [];
  let cellCounter = 1;
  for (let i = 0; i < 42; i++) {
    if (i >= dayOfWeek && cellCounter <= daysCount) {
      const isToday = today.value[0] === year && today.value[1] === month && today.value[2] === cellCounter;
      const isSelected = selectedDay.value[2] === cellCounter;
      const weekDay = i % 7;
      const isFriday = weekDay === 6;
      const isDisabled = checkIfDisabled(year, month, cellCounter);
      const events = props.showOccasions ? getDayEvents(year, month, cellCounter) : void 0;
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
      });
      cellCounter++;
    } else {
      days.push({
        day: 0,
        display: ".",
        title: "",
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
});
const checkIfDisabled = (year, month, day) => {
  if (props.from) {
    const [fromY, fromM, fromD] = props.from;
    if (year < fromY || year === fromY && month < fromM || year === fromY && month === fromM && day < fromD) {
      return true;
    }
  }
  if (props.to) {
    const [toY, toM, toD] = props.to;
    if (year > toY || year === toY && month > toM || year === toY && month === toM && day > toD) {
      return true;
    }
  }
  return false;
};
const getDayClasses = (day) => {
  return {
    "calendar-day": true,
    "today": day.isToday,
    "selected": day.isSelected,
    "friday": day.isFriday,
    "holiday": day.isHoliday,
    "disabled": day.isDisabled,
    "has-event": day.events && (day.events.persianEvents.length > 0 || day.events.hijriEvents.length > 0)
  };
};
const getDayTooltip = (day) => {
  if (!day.events || day.day === 0)
    return day.title;
  const events = [day.title];
  if (day.events.persianEvents.length > 0) {
    events.push("", "\u{1F389} \u0631\u0648\u06CC\u062F\u0627\u062F\u0647\u0627\u06CC \u0627\u06CC\u0631\u0627\u0646\u06CC:");
    events.push(...day.events.persianEvents);
  }
  if (day.events.hijriEvents.length > 0) {
    events.push("", "\u{1F319} \u0631\u0648\u06CC\u062F\u0627\u062F\u0647\u0627\u06CC \u0627\u0633\u0644\u0627\u0645\u06CC:");
    events.push(...day.events.hijriEvents);
  }
  return events.join("\n");
};
const selectDay = (day) => {
  if (day.isDisabled)
    return;
  selectedDay.value[2] = day.day;
  currentEvents.value = getSelectedDayEvents();
  emit(
    "select-date",
    {
      date: [...selectedDay.value],
      events: currentEvents.value
    }
  );
};
const handleNextMonth = () => {
  composableNextMonth();
  selectedDay.value = [...composableSelectedDay.value];
};
const handlePrevMonth = () => {
  composablePrevMonth();
  selectedDay.value = [...composableSelectedDay.value];
};
const handleNextYear = () => {
  composableNextYear();
  selectedDay.value = [...composableSelectedDay.value];
};
const handlePrevYear = () => {
  composablePrevYear();
  selectedDay.value = [...composableSelectedDay.value];
};
const setDate = (date) => {
  if (!date) {
    selectedDay.value = [...today.value];
    return;
  }
  if (Array.isArray(date)) {
    selectedDay.value = date;
  } else if (typeof date === "string") {
    const parts = date.split(/[\/\-]/).map(Number);
    if (parts.length === 3) {
      selectedDay.value = parts;
    }
  }
};
const setDateFromGregorian = (gregorianDate) => {
  let gYear, gMonth, gDay;
  if (Array.isArray(gregorianDate)) {
    [gYear, gMonth, gDay] = gregorianDate;
  } else {
    const parts = gregorianDate.split(/[\/\-]/).map(Number);
    if (parts.length !== 3) return;
    [gYear, gMonth, gDay] = parts;
  }
  const jalaliDate = gregorianToJalali(gYear, gMonth, gDay);
  setDate(jalaliDate);
};
const getSelectedDate = () => {
  return [...selectedDay.value];
};
const goToToday = () => {
  selectedDay.value = [...today.value];
  currentEvents.value = getTodayEvents();
};
defineExpose({
  setDate,
  setDateFromGregorian,
  getSelectedDate,
  goToToday
});
onMounted(() => {
  initializeDate();
  detectSystemTheme();
  if (typeof window !== "undefined" && window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", detectSystemTheme);
  }
  if (!props.defaultDate) {
    selectedDay.value = [...today.value];
  }
  currentEvents.value = getTodayEvents();
});
</script>

<template>
    <div
        class="persian-calendar"
        :style="{ fontFamily, ...getCSSVariables }"
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

                <slot
                    name="hijri-events"
                    :events="currentEvents.hijriEvents"
                >
                    <div v-if="currentEvents.hijriEvents.length" class="event-group">
                        <span v-for="(event, i) in currentEvents.hijriEvents" :key="i">
                            <slot name="hijri-event" :event="event" :index="i">
                                {{ event }}
                            </slot>
                        </span>
                    </div>
                </slot>
            </div>
        </slot>

        <slot name="footer" :selectedDay="selectedDay" :currentEvents="currentEvents"></slot>
    </div>
</template>

<style scoped>
:root{--bg-color:#f5f5f5;--text-color:#333;--nav-btn-color:#ccc;--nav-btn-hover:#b8b8b8;--day-name-bg:#e0e0e0;--day-name-text:#333;--day-bg:#fff;--day-text:#333;--day-hover:#e8e8e8;--today-bg:rgba(76,79,255,.53);--today-text:#fff;--selected-bg:rgba(117,206,72,.49);--selected-text:#fff;--friday-bg:rgba(255,52,52,.55);--friday-text:#fff;--info-bg:#fff;--info-text:#333;--border-color:#ccc;--disabled-opacity:0.3}.persian-calendar{background-color:var(--bg-color);border-radius:8px;color:var(--text-color);direction:rtl;font-family:Tahoma,sans-serif;margin:0 auto;max-width:700px;padding:1rem;width:100%}.calendar-header{align-items:center;display:flex;gap:1rem;justify-content:space-between;margin-bottom:1rem}.nav-btn{background-color:var(--nav-btn-color);border:1px solid var(--border-color);border-radius:5px;color:var(--text-color);cursor:pointer;padding:.5rem 1rem;transition:background-color .2s}.nav-btn:hover{background-color:var(--nav-btn-hover)}.month-display,.year-display{color:var(--text-color);font-weight:700;min-width:80px;text-align:center}.day-name{background-color:var(--day-name-bg);border-radius:4px;color:var(--day-name-text);font-weight:700;padding:.5rem;text-align:center}.calendar-day{align-items:center;aspect-ratio:1;background-color:var(--day-bg);border:1px solid var(--border-color);border-radius:5px;color:var(--day-text);cursor:pointer;display:flex;justify-content:center;padding:.5rem;position:relative;transition:all .2s}.calendar-day:not(.disabled):not(.selected):hover{background-color:var(--day-hover);transform:scale(1.05)}.calendar-day.today{background-color:var(--today-bg);color:var(--today-text);font-weight:700}.calendar-day.selected{background-color:var(--selected-bg);color:var(--selected-text);font-weight:700}.calendar-day.friday,.calendar-day.holiday{background-color:var(--friday-bg);color:var(--friday-text)}.day-events,.day-info{background-color:var(--info-bg);border-radius:5px;color:var(--info-text);line-height:1.8;margin-top:1rem;padding:1rem;text-align:center}.month-selector,.year-selector{align-items:center;display:flex;gap:.5rem}.day-names{margin-bottom:.5rem}.calendar-days,.day-names{display:grid;gap:.5rem;grid-template-columns:repeat(7,1fr)}.calendar-days{margin-bottom:1rem}.calendar-day.disabled{cursor:not-allowed;opacity:var(--disabled-opacity)}.calendar-day.has-event:after{background:#f39c12;border-radius:50%;bottom:4px;content:"";height:5px;left:50%;position:absolute;transform:translateX(-50%);width:5px}.calendar-day.selected.has-event:after,.calendar-day.today.has-event:after{background:var(--today-text)}.event-group{margin:.5rem 0}.event-group span{display:block;padding:.25rem 0}
</style>
