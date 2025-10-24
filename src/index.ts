import type { App } from "vue";
import PersianCalendar from "./components/PersianCalendar.vue";
import PersianDatePicker from "./components/PersianDatePicker.vue";
import { usePersianCalendar } from "./composables/usePersianCalendar";

// Vue plugin
export default
{
    install(app: App)
    {
        app.component("PersianCalendar", PersianCalendar);
        app.component("PersianDatePicker", PersianDatePicker);
    },
};

// Named exports
export { PersianCalendar, PersianDatePicker, usePersianCalendar };

// Re-export types
export type { PersianDate, DateWithEvents, CalendarEvents } from "./composables/usePersianCalendar";