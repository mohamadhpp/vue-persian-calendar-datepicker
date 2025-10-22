<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
const defaultLightColors = {
  inputBg: "#fff",
  inputText: "#333",
  inputBorder: "#e0e0e0",
  inputBorderHover: "#3498db",
  inputBorderFocus: "#3498db",
  inputFocusShadow: "rgba(52, 152, 219, 0.2)",
  iconColor: "#7f8c8d",
  iconColorHover: "#3498db",
  clearColor: "#7f8c8d",
  clearColorHover: "#e74c3c",
  popupBg: "#fff",
  popupBorder: "#e0e0e0",
  popupShadow: "rgba(0, 0, 0, 0.15)",
  navBtnBg: "#f5f5f5",
  navBtnBgHover: "#e0e0e0",
  navBtnText: "#333",
  yearMonthText: "#2c3e50",
  quickBtnBg: "#3498db",
  quickBtnBgHover: "#2980b9",
  quickBtnText: "#fff",
  dayNameText: "#7f8c8d",
  dayNameBg: "transparent",
  dayBg: "transparent",
  dayText: "#333",
  dayBgHover: "#f5f5f5",
  todayBg: "#e8f0fe",
  todayText: "#3498db",
  selectedBg: "#3498db",
  selectedText: "#fff",
  fridayText: "#e74c3c",
  holidayText: "#e74c3c",
  disabledOpacity: 0.4,
  eventDotColor: "#f39c12",
  footerBorderColor: "transparent",
  footerText: "#7f8c8d"
};
const defaultDarkColors = {
  inputBg: "#2c3e50",
  inputText: "#ecf0f1",
  inputBorder: "#34495e",
  inputBorderHover: "#3498db",
  inputBorderFocus: "#3498db",
  inputFocusShadow: "rgba(52, 152, 219, 0.3)",
  iconColor: "#95a5a6",
  iconColorHover: "#3498db",
  clearColor: "#95a5a6",
  clearColorHover: "#e74c3c",
  popupBg: "#34495e",
  popupBorder: "#2c3e50",
  popupShadow: "rgba(0, 0, 0, 0.5)",
  navBtnBg: "#2c3e50",
  navBtnBgHover: "#1a252f",
  navBtnText: "#ecf0f1",
  yearMonthText: "#ecf0f1",
  quickBtnBg: "#3498db",
  quickBtnBgHover: "#2980b9",
  quickBtnText: "#fff",
  dayNameText: "#95a5a6",
  dayNameBg: "transparent",
  dayBg: "transparent",
  dayText: "#ecf0f1",
  dayBgHover: "#2c3e50",
  todayBg: "#2c3e50",
  todayText: "#3498db",
  selectedBg: "#3498db",
  selectedText: "#fff",
  fridayText: "#e74c3c",
  holidayText: "#e74c3c",
  disabledOpacity: 0.4,
  eventDotColor: "#f39c12",
  footerBorderColor: "#2c3e50",
  footerText: "#95a5a6"
};
const props = defineProps({
  modelValue: { type: [String, Array, null], required: false, default: null },
  placeholder: { type: String, required: false, default: "\u062A\u0627\u0631\u06CC\u062E \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F" },
  format: { type: String, required: false, default: "YYYY/MM/DD" },
  disabled: { type: Boolean, required: false, default: false },
  readonly: { type: Boolean, required: false, default: true },
  clearable: { type: Boolean, required: false, default: true },
  position: { type: String, required: false, default: "auto" },
  from: { type: Array, required: false },
  to: { type: Array, required: false },
  fontFamily: { type: String, required: false, default: "Tahoma, sans-serif" },
  defaultDate: { type: [Array, String, null], required: false, default: null },
  showTodayButton: { type: Boolean, required: false, default: true },
  showCloseButton: { type: Boolean, required: false, default: true },
  showOccasions: { type: Boolean, required: false, default: true },
  theme: { type: String, required: false, default: "light" },
  lightColors: { type: Object, required: false },
  darkColors: { type: Object, required: false }
});
const emit = defineEmits(["update:modelValue", "change", "open", "close"]);
const {
  today,
  persianMonthName,
  dayCountInMonth,
  dayIndexOfWeek,
  jalaliToHijri,
  gregorianToJalali,
  getDayEvents
} = usePersianCalendar();
const isOpen = ref(false);
const currentYear = ref(today.value[0]);
const currentMonth = ref(today.value[1]);
const selectedDate = ref(null);
const wrapperRef = ref(null);
const inputRef = ref(null);
const popupPosition = ref("bottom");
const dayNames = ["\u0634", "\u06CC", "\u062F", "\u0633", "\u0686", "\u067E", "\u062C"];
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
    "--input-bg": colors.inputBg,
    "--input-text": colors.inputText,
    "--input-border": colors.inputBorder,
    "--input-border-hover": colors.inputBorderHover,
    "--input-border-focus": colors.inputBorderFocus,
    "--input-focus-shadow": colors.inputFocusShadow,
    "--icon-color": colors.iconColor,
    "--icon-color-hover": colors.iconColorHover,
    "--clear-color": colors.clearColor,
    "--clear-color-hover": colors.clearColorHover,
    "--popup-bg": colors.popupBg,
    "--popup-border": colors.popupBorder,
    "--popup-shadow": colors.popupShadow,
    "--nav-btn-bg": colors.navBtnBg,
    "--nav-btn-bg-hover": colors.navBtnBgHover,
    "--nav-btn-text": colors.navBtnText,
    "--year-month-text": colors.yearMonthText,
    "--quick-btn-bg": colors.quickBtnBg,
    "--quick-btn-bg-hover": colors.quickBtnBgHover,
    "--quick-btn-text": colors.quickBtnText,
    "--day-name-text": colors.dayNameText,
    "--day-name-bg": colors.dayNameBg,
    "--day-bg": colors.dayBg,
    "--day-text": colors.dayText,
    "--day-bg-hover": colors.dayBgHover,
    "--today-bg": colors.todayBg,
    "--today-text": colors.todayText,
    "--selected-bg": colors.selectedBg,
    "--selected-text": colors.selectedText,
    "--friday-text": colors.fridayText,
    "--holiday-text": colors.holidayText,
    "--disabled-opacity": colors.disabledOpacity,
    "--event-dot-color": colors.eventDotColor,
    "--footer-border-color": colors.footerBorderColor,
    "--footer-text": colors.footerText
  };
});
const initializeDate = () => {
  const value = props.modelValue || props.defaultDate;
  if (value) {
    if (Array.isArray(value)) {
      selectedDate.value = value;
      currentYear.value = value[0];
      currentMonth.value = value[1];
    } else if (typeof value === "string") {
      const parts = value.split(/[\/\-]/).map(Number);
      if (parts.length === 3) {
        selectedDate.value = parts;
        currentYear.value = parts[0];
        currentMonth.value = parts[1];
      }
    }
  }
};
watch(() => props.modelValue, (value) => {
  if (value) {
    if (Array.isArray(value)) {
      selectedDate.value = value;
      currentYear.value = value[0];
      currentMonth.value = value[1];
    } else if (typeof value === "string") {
      const parts = value.split(/[\/\-]/).map(Number);
      if (parts.length === 3) {
        selectedDate.value = parts;
        currentYear.value = parts[0];
        currentMonth.value = parts[1];
      }
    }
  } else {
    selectedDate.value = null;
  }
}, { immediate: true });
const displayValue = computed(() => {
  if (!selectedDate.value)
    return "";
  const [year, month, day] = selectedDate.value;
  if (props.format === "YYYY/MM/DD") {
    return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
  } else if (props.format === "YYYY-MM-DD") {
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  } else if (props.format === "DD/MM/YYYY") {
    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
  } else if (props.format === "text") {
    return `${day} ${persianMonthName(month)} ${year}`;
  }
  return `${year}/${month}/${day}`;
});
const formattedSelectedDate = computed(() => {
  if (!selectedDate.value)
    return "";
  const [year, month, day] = selectedDate.value;
  return `${day} ${persianMonthName(month)} ${year}`;
});
const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const dayOfWeek = dayIndexOfWeek(year, month, 1);
  const daysCount = dayCountInMonth(year, month);
  const days = [];
  let cellCounter = 1;
  for (let i = 0; i < 42; i++) {
    if (i >= dayOfWeek && cellCounter <= daysCount) {
      const isToday = today.value[0] === year && today.value[1] === month && today.value[2] === cellCounter;
      const isSelected = selectedDate.value ? selectedDate.value[0] === year && selectedDate.value[1] === month && selectedDate.value[2] === cellCounter : false;
      const weekDay = i % 7;
      const isFriday = weekDay === 6;
      const isDisabled = checkIfDisabled(year, month, cellCounter);
      const events = props.showOccasions ? getDayEvents(year, month, cellCounter) : void 0;
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
    } else {
      days.push({
        day: 0,
        display: "",
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
    "empty": day.day === 0,
    "has-event": day.events && (day.events.persianEvents.length > 0 || day.events.hijriEvents.length > 0)
  };
};
const getDayTooltip = (day) => {
  if (!day.events || day.day === 0)
    return "";
  const events = [];
  if (day.events.persianEvents.length > 0) {
    events.push(...day.events.persianEvents);
  }
  if (day.events.hijriEvents.length > 0) {
    events.push(...day.events.hijriEvents);
  }
  return events.join("\n");
};
const handleInputClick = () => {
  if (props.disabled)
    return;
  togglePopup();
};
const togglePopup = () => {
  if (props.disabled)
    return;
  if (isOpen.value) {
    closePopup();
  } else {
    openPopup();
  }
};
const openPopup = () => {
  if (props.disabled)
    return;
  if (selectedDate.value) {
    currentYear.value = selectedDate.value[0];
    currentMonth.value = selectedDate.value[1];
  } else {
    currentYear.value = today.value[0];
    currentMonth.value = today.value[1];
  }
  isOpen.value = true;
  emit("open");
  nextTick(() => {
    calculatePopupPosition();
  });
};
const closePopup = () => {
  isOpen.value = false;
  emit("close");
};
const calculatePopupPosition = () => {
  if (!wrapperRef.value)
    return;
  if (props.position === "top") {
    popupPosition.value = "top";
  } else if (props.position === "bottom") {
    popupPosition.value = "bottom";
  } else {
    const rect = wrapperRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    popupPosition.value = spaceBelow < 400 && spaceAbove > spaceBelow ? "top" : "bottom";
  }
};
const selectDate = (day) => {
  if (day.isDisabled || day.day === 0)
    return;
  selectedDate.value = [currentYear.value, currentMonth.value, day.day];
  emit("update:modelValue", selectedDate.value);
  emit("change", selectedDate.value);
  closePopup();
};
const selectToday = () => {
  selectedDate.value = [...today.value];
  currentYear.value = today.value[0];
  currentMonth.value = today.value[1];
  emit("update:modelValue", selectedDate.value);
  emit("change", selectedDate.value);
  closePopup();
};
const clearDate = () => {
  selectedDate.value = null;
  emit("update:modelValue", null);
  emit("change", null);
};
const handleNextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};
const handlePrevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};
const handleNextYear = () => {
  currentYear.value++;
};
const handlePrevYear = () => {
  currentYear.value--;
};
const onFocus = () => {
  if (!props.readonly)
    return;
};
const onBlur = () => {
};
const setDate = (date) => {
  if (!date) {
    selectedDate.value = null;
    emit("update:modelValue", null);
    emit("change", null);
    return;
  }
  if (Array.isArray(date)) {
    selectedDate.value = date;
    currentYear.value = date[0];
    currentMonth.value = date[1];
  } else if (typeof date === "string") {
    const parts = date.split(/[\/\-]/).map(Number);
    if (parts.length === 3) {
      selectedDate.value = parts;
      currentYear.value = parts[0];
      currentMonth.value = parts[1];
    }
  }
  emit("update:modelValue", selectedDate.value);
  emit("change", selectedDate.value);
};
const setDateFromGregorian = (gregorianDate) => {
  let gYear, gMonth, gDay;
  if (Array.isArray(gregorianDate)) {
    [gYear, gMonth, gDay] = gregorianDate;
  } else {
    const parts = gregorianDate.split(/[\/\-]/).map(Number);
    if (parts.length !== 3)
      return;
    [gYear, gMonth, gDay] = parts;
  }
  const jalaliDate = gregorianToJalali(gYear, gMonth, gDay);
  setDate(jalaliDate);
};
const getSelectedDate = () => {
  return selectedDate.value;
};
defineExpose({
  setDate,
  setDateFromGregorian,
  getSelectedDate,
  selectToday,
  clearDate,
  openPopup,
  closePopup
});
const handleClickOutside = (event) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target)) {
    closePopup();
  }
};
onMounted(() => {
  initializeDate();
  detectSystemTheme();
  if (typeof window !== "undefined" && window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", detectSystemTheme);
  }
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", calculatePopupPosition);
  window.addEventListener("scroll", calculatePopupPosition, true);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", calculatePopupPosition);
  window.removeEventListener("scroll", calculatePopupPosition, true);
});
</script>

<template>
    <div
        class="persian-datepicker-wrapper"
        ref="wrapperRef"
        :style="{ fontFamily, ...getCSSVariables }"
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
:root{--input-bg:#fff;--input-text:#333;--input-border:#e0e0e0;--input-border-hover:#3498db;--input-border-focus:#3498db;--input-focus-shadow:rgba(52,152,219,.2);--icon-color:#7f8c8d;--icon-color-hover:#3498db;--clear-color:#7f8c8d;--clear-color-hover:#e74c3c;--popup-bg:#fff;--popup-border:#e0e0e0;--popup-shadow:rgba(0,0,0,.15);--nav-btn-bg:#f5f5f5;--nav-btn-bg-hover:#e0e0e0;--nav-btn-text:#333;--year-month-text:#2c3e50;--quick-btn-bg:#3498db;--quick-btn-bg-hover:#2980b9;--quick-btn-text:#fff;--day-name-text:#7f8c8d;--day-name-bg:transparent;--day-bg:transparent;--day-text:#333;--day-bg-hover:#f5f5f5;--today-bg:#e8f0fe;--today-text:#3498db;--selected-bg:#3498db;--selected-text:#fff;--friday-text:#e74c3c;--holiday-text:#e74c3c;--disabled-opacity:0.4;--event-dot-color:#f39c12;--footer-border-color:transparent;--footer-text:#7f8c8d}.persian-datepicker-wrapper{direction:rtl;font-family:Tahoma,sans-serif;font-size:.9rem;max-width:300px;position:relative;width:100%}.datepicker-input-container{align-items:center;display:flex;position:relative}.datepicker-input{background:var(--input-bg);border:1px solid var(--input-border);border-radius:6px;color:var(--input-text);cursor:pointer;padding:.6rem 2.5rem .6rem .8rem;transition:border-color .2s ease;width:100%}.datepicker-input:hover{border-color:var(--input-border-hover)}.datepicker-input:focus{border-color:var(--input-border-focus);box-shadow:0 0 0 2px var(--input-focus-shadow);outline:none}.datepicker-input:disabled{cursor:not-allowed;opacity:.6}.datepicker-icon{align-items:center;color:var(--icon-color);cursor:pointer;display:flex;left:.6rem;position:absolute;transition:color .2s ease}.datepicker-icon:hover{color:var(--icon-color-hover)}.datepicker-clear{align-items:center;background:none;border:none;color:var(--clear-color);cursor:pointer;display:flex;font-size:1.5rem;height:20px;justify-content:center;left:2rem;padding:0;position:absolute;transition:color .2s ease;width:20px}.datepicker-clear:hover{color:var(--clear-color-hover)}.datepicker-popup{background:var(--popup-bg);border:1px solid var(--popup-border);border-radius:6px;box-shadow:0 4px 12px var(--popup-shadow);left:0;min-width:280px;padding:.8rem;position:absolute;right:0;top:calc(100% + .4rem);z-index:1000}.datepicker-popup.position-top{bottom:calc(100% + .4rem);top:auto}.nav-btn{align-items:center;background:var(--nav-btn-bg);border:none;border-radius:4px;color:var(--nav-btn-text);cursor:pointer;display:flex;padding:.4rem;transition:background .2s ease}.nav-btn:hover{background:var(--nav-btn-bg-hover)}.month-display,.year-display{color:var(--year-month-text);font-weight:600;text-align:center}.quick-btn{background:var(--quick-btn-bg);border:none;border-radius:4px;color:var(--quick-btn-text);cursor:pointer;flex:1;font-size:.85rem;padding:.5rem;transition:background .2s ease}.quick-btn:hover{background:var(--quick-btn-bg-hover)}.day-name{background:var(--day-name-bg);color:var(--day-name-text);font-size:.75rem;font-weight:600;padding:.3rem 0;text-align:center}.calendar-day{align-items:center;aspect-ratio:1;background:var(--day-bg);border-radius:4px;color:var(--day-text);cursor:pointer;display:flex;font-size:.85rem;justify-content:center;position:relative;transition:all .2s ease}.calendar-day:not(.disabled):not(.selected):not(.empty):hover{background:var(--day-bg-hover);transform:scale(1.05)}.calendar-day.today{background:var(--today-bg);color:var(--today-text);font-weight:600}.calendar-day.selected{background:var(--selected-bg);color:var(--selected-text);font-weight:600}.calendar-day.friday,.calendar-day.holiday{color:var(--friday-text)}.selected-date-text{color:var(--footer-text);font-size:.85rem}.datepicker-header{align-items:center;display:flex;justify-content:space-between;margin-bottom:.8rem}.year-selector{width:30%}.month-selector{width:60%}.month-selector,.year-selector{align-items:center;display:flex;gap:.4rem}.month-display,.year-display{width:100%!important}.datepicker-quick-actions{display:flex;gap:.4rem;margin-bottom:.8rem}.datepicker-days-header{margin-bottom:.4rem}.datepicker-days,.datepicker-days-header{display:grid;gap:.2rem;grid-template-columns:repeat(7,1fr)}.calendar-day.empty{cursor:default;pointer-events:none}.calendar-day.disabled{cursor:not-allowed;opacity:var(--disabled-opacity);pointer-events:none}.calendar-day.has-event:after{background:var(--event-dot-color);border-radius:50%;bottom:2px;content:"";height:4px;left:50%;position:absolute;transform:translateX(-50%);width:4px}.calendar-day.selected.has-event:after{background:var(--selected-text)}.datepicker-footer{border-top:1px solid var(--footer-border-color);margin-top:.8rem;padding-top:.8rem;text-align:center}.datepicker-fade-enter-active,.datepicker-fade-leave-active{transition:all .2s ease}.datepicker-fade-enter-from{opacity:0;transform:translateY(-8px)}.datepicker-fade-leave-to{opacity:0;transform:translateY(8px)}
</style>
