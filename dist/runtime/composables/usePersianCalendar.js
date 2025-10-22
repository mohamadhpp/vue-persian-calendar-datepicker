import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRuntimeConfig } from "nuxt/app";
export const usePersianCalendar = () => {
  const config = useRuntimeConfig();
  const options = config.public.persianCalendar;
  const today = ref([1403, 1, 1]);
  const selectedDay = ref([1403, 1, 1]);
  const todayHijri = ref([1445, 1, 1]);
  const todayGregorian = ref([2024, 1, 1]);
  let updateInterval = null;
  const persianMonthNames = [
    "\u0641\u0631\u0648\u0631\u062F\u06CC\u0646",
    "\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A",
    "\u062E\u0631\u062F\u0627\u062F",
    "\u062A\u06CC\u0631",
    "\u0645\u0631\u062F\u0627\u062F",
    "\u0634\u0647\u0631\u06CC\u0648\u0631",
    "\u0645\u0647\u0631",
    "\u0622\u0628\u0627\u0646",
    "\u0622\u0630\u0631",
    "\u062F\u06CC",
    "\u0628\u0647\u0645\u0646",
    "\u0627\u0633\u0641\u0646\u062F"
  ];
  const hijriMonthNames = [
    "\u0645\u062D\u0631\u0645",
    "\u0635\u0641\u0631",
    "\u0631\u0628\u06CC\u0639 \u0627\u0644\u0627\u0648\u0644",
    "\u0631\u0628\u06CC\u0639 \u0627\u0644\u062B\u0627\u0646\u06CC",
    "\u062C\u0645\u0627\u062F\u06CC \u0627\u0644\u0627\u0648\u0644",
    "\u062C\u0645\u0627\u062F\u06CC \u0627\u0644\u062B\u0627\u0646\u06CC\u0647",
    "\u0631\u062C\u0628",
    "\u0634\u0639\u0628\u0627\u0646",
    "\u0631\u0645\u0636\u0627\u0646",
    "\u0634\u0648\u0627\u0644",
    "\u0630\u06CC\u0642\u0639\u062F\u0647",
    "\u0630\u06CC\u062D\u062C\u0647"
  ];
  const gregorianMonthNames = [
    "\u0698\u0627\u0646\u0648\u06CC\u0647",
    "\u0641\u0648\u0631\u06CC\u0647",
    "\u0645\u0627\u0631\u0633",
    "\u0622\u067E\u0631\u06CC\u0644",
    "\u0645\u06CC",
    "\u0698\u0648\u0626\u0646",
    "\u062C\u0648\u0644\u0627\u06CC",
    "\u0622\u06AF\u0648\u0633\u062A",
    "\u0633\u067E\u062A\u0627\u0645\u0628\u0631",
    "\u0627\u06A9\u062A\u0628\u0631",
    "\u0646\u0648\u0627\u0645\u0628\u0631",
    "\u062F\u0633\u0627\u0645\u0628\u0631"
  ];
  const dayNames = ["\u0634\u0646\u0628\u0647", "\u06CC\u06A9\u0634\u0646\u0628\u0647", "\u062F\u0648\u0634\u0646\u0628\u0647", "\u0633\u0647\u200C\u0634\u0646\u0628\u0647", "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647", "\u067E\u0646\u062C\u200C\u0634\u0646\u0628\u0647", "\u062C\u0645\u0639\u0647"];
  const persianEvents = [
    { "date": [1, 1], "title": ["\u0639\u06CC\u062F \u0646\u0648\u0631\u0648\u0632"], "is_holiday": true },
    { "date": [1, 2], "title": ["\u0639\u06CC\u062F \u0646\u0648\u0631\u0648\u0632"], "is_holiday": true },
    { "date": [1, 3], "title": ["\u0639\u06CC\u062F \u0646\u0648\u0631\u0648\u0632"], "is_holiday": true },
    { "date": [1, 4], "title": ["\u0639\u06CC\u062F \u0646\u0648\u0631\u0648\u0632"], "is_holiday": true },
    { "date": [1, 6], "title": ["\u0648\u0644\u0627\u062F\u062A \u0632\u0631\u062A\u0634\u062A"], "is_holiday": false },
    { "date": [1, 7], "title": ["\u0631\u0648\u0632 \u0647\u0646\u0631\u0647\u0627\u06CC \u0646\u0645\u0627\u06CC\u0634\u06CC"], "is_holiday": false },
    { "date": [1, 12], "title": ["\u0631\u0648\u0632 \u062C\u0645\u0647\u0648\u0631\u06CC \u0627\u0633\u0644\u0627\u0645\u06CC"], "is_holiday": true },
    { "date": [1, 13], "title": ["\u0631\u0648\u0632 \u0637\u0628\u06CC\u0639\u062A"], "is_holiday": true },
    { "date": [1, 18], "title": ["\u0631\u0648\u0632 \u0633\u0644\u0627\u0645\u062A\u06CC"], "is_holiday": false },
    { "date": [1, 20], "title": ["\u0631\u0648\u0632 \u0645\u0644\u06CC \u0641\u0646\u0627\u0648\u0631\u06CC \u0647\u0633\u062A\u0647\u200C\u0627\u06CC"], "is_holiday": false },
    { "date": [1, 25], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0639\u0637\u0627\u0631 \u0646\u06CC\u0634\u0627\u0628\u0648\u0631\u06CC"], "is_holiday": false },
    { "date": [1, 29], "title": ["\u0631\u0648\u0632 \u0627\u0631\u062A\u0634 \u062C\u0645\u0647\u0648\u0631\u06CC \u0627\u0633\u0644\u0627\u0645\u06CC \u0648 \u0646\u06CC\u0631\u0648\u06CC \u0632\u0645\u06CC\u0646\u06CC"], "is_holiday": false },
    { "date": [2, 1], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0633\u0639\u062F\u06CC"], "is_holiday": false },
    { "date": [2, 3], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0634\u06CC\u062E \u0628\u0647\u0627\u06CC\u06CC", "\u0631\u0648\u0632 \u0645\u0639\u0645\u0627\u0631\u06CC"], "is_holiday": false },
    { "date": [2, 7], "title": ["\u0631\u0648\u0632 \u0627\u06CC\u0645\u0646\u06CC \u062D\u0645\u0644 \u0648 \u0646\u0642\u0644"], "is_holiday": false },
    { "date": [2, 9], "title": ["\u0631\u0648\u0632 \u0634\u0648\u0631\u0627\u0647\u0627"], "is_holiday": false },
    { "date": [2, 10], "title": ["\u0631\u0648\u0632 \u0645\u0644\u06CC \u062E\u0644\u06CC\u062C \u0641\u0627\u0631\u0633"], "is_holiday": false },
    { "date": [2, 15], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0634\u06CC\u062E \u0635\u062F\u0648\u0642"], "is_holiday": false },
    { "date": [2, 18], "title": ["\u0631\u0648\u0632 \u0628\u06CC\u0645\u0627\u0631\u06CC\u200C\u0647\u0627\u06CC \u062E\u0627\u0635 \u0648 \u0635\u0639\u0628 \u0627\u0644\u0639\u0644\u0627\u062C"], "is_holiday": false },
    { "date": [2, 19], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0634\u06CC\u062E \u06A9\u0644\u06CC\u0646\u06CC"], "is_holiday": false },
    { "date": [2, 25], "title": ["\u0631\u0648\u0632 \u067E\u0627\u0633\u062F\u0627\u0634\u062A \u0632\u0628\u0627\u0646 \u0641\u0627\u0631\u0633\u06CC \u0648 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u062D\u06A9\u06CC\u0645 \u0627\u0628\u0648\u0627\u0644\u0642\u0627\u0633\u0645 \u0641\u0631\u062F\u0648\u0633\u06CC"], "is_holiday": false },
    { "date": [2, 28], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u062D\u06A9\u06CC\u0645 \u0639\u0645\u0631 \u062E\u06CC\u0627\u0645"], "is_holiday": false },
    { "date": [2, 30], "title": ["\u0631\u0648\u0632 \u0645\u0644\u06CC \u062C\u0645\u0639\u06CC\u062A"], "is_holiday": false },
    { "date": [2, 31], "title": ["\u0631\u0648\u0632 \u0627\u0647\u062F\u0627\u06CC \u0639\u0636\u0648", "\u0627\u0647\u062F\u0627\u06CC \u0632\u0646\u062F\u06AF\u06CC"], "is_holiday": false },
    { "date": [3, 1], "title": ["\u0631\u0648\u0632 \u0628\u0647\u0631\u0647\u200C\u0648\u0631\u06CC \u0648 \u0628\u0647\u06CC\u0646\u0647\u200C\u0633\u0627\u0632\u06CC \u0645\u0635\u0631\u0641", "\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0645\u0644\u0627\u0635\u062F\u0631\u0627"], "is_holiday": false },
    { "date": [3, 8], "title": ["\u0631\u0648\u0632 \u0641\u0631\u0647\u0646\u06AF \u067E\u0647\u0644\u0648\u0627\u0646\u06CC \u0648 \u0648\u0631\u0632\u0634 \u0632\u0648\u0631\u062E\u0627\u0646\u0647\u200C\u0627\u06CC"], "is_holiday": false },
    { "date": [3, 14], "title": ["\u0631\u062D\u0644\u062A \u0627\u0645\u0627\u0645 \u062E\u0645\u06CC\u0646\u06CC"], "is_holiday": true },
    { "date": [3, 15], "title": ["\u0642\u06CC\u0627\u0645 \u062E\u0648\u0646\u06CC\u0646 15 \u062E\u0631\u062F\u0627\u062F"], "is_holiday": true },
    { "date": [3, 20], "title": ["\u0631\u0648\u0632 \u0635\u0646\u0627\u06CC\u0639 \u062F\u0633\u062A\u06CC"], "is_holiday": false },
    { "date": [3, 29], "title": ["\u062F\u0631\u06AF\u0630\u0634\u062A \u062F\u06A9\u062A\u0631 \u0639\u0644\u06CC \u0634\u0631\u06CC\u0639\u062A\u06CC"], "is_holiday": false },
    { "date": [3, 31], "title": ["\u0634\u0647\u0627\u062F\u062A \u062F\u06A9\u062A\u0631 \u0645\u0635\u0637\u0641\u06CC \u0686\u0645\u0631\u0627\u0646", "\u0631\u0648\u0632 \u0628\u0633\u06CC\u062C \u0627\u0633\u062A\u0627\u062F\u0627\u0646"], "is_holiday": false },
    { "date": [4, 1], "title": ["\u0631\u0648\u0632 \u0627\u0635\u0646\u0627\u0641"], "is_holiday": false },
    { "date": [4, 7], "title": ["\u0631\u0648\u0632 \u0642\u0648\u0647 \u0642\u0636\u0627\u06CC\u06CC\u0647"], "is_holiday": false },
    { "date": [4, 8], "title": ["\u0631\u0648\u0632 \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u0633\u0644\u0627\u062D\u200C\u0647\u0627\u06CC \u0634\u06CC\u0645\u06CC\u0627\u06CC\u06CC \u0648 \u0645\u06CC\u06A9\u0631\u0648\u0628\u06CC"], "is_holiday": false },
    { "date": [4, 10], "title": ["\u0631\u0648\u0632 \u0635\u0646\u0639\u062A \u0648 \u0645\u0639\u062F\u0646"], "is_holiday": false },
    { "date": [4, 14], "title": ["\u0631\u0648\u0632 \u0642\u0644\u0645"], "is_holiday": false },
    { "date": [4, 18], "title": ["\u0631\u0648\u0632 \u0627\u062F\u0628\u06CC\u0627\u062A \u06A9\u0648\u062F\u06A9\u0627\u0646 \u0648 \u0646\u0648\u062C\u0648\u0627\u0646\u0627\u0646"], "is_holiday": false },
    { "date": [4, 23], "title": ["\u0631\u0648\u0632 \u06AF\u0641\u062A\u200C\u0648\u06AF\u0648 \u0648 \u062A\u0639\u0627\u0645\u0644 \u0633\u0627\u0632\u0646\u062F\u0647 \u0628\u0627 \u062C\u0647\u0627\u0646"], "is_holiday": false },
    { "date": [4, 25], "title": ["\u0631\u0648\u0632 \u0628\u0647\u0632\u06CC\u0633\u062A\u06CC \u0648 \u062A\u0627\u0645\u06CC\u0646 \u0627\u062C\u062A\u0645\u0627\u0639\u06CC"], "is_holiday": false },
    { "date": [5, 9], "title": ["\u0631\u0648\u0632 \u0627\u0647\u062F\u0627\u06CC \u062E\u0648\u0646"], "is_holiday": false },
    { "date": [5, 14], "title": ["\u0631\u0648\u0632 \u062E\u0627\u0646\u0648\u0627\u062F\u0647 \u0648 \u062A\u06A9\u0631\u06CC\u0645 \u0628\u0627\u0632\u0646\u0634\u0633\u062A\u06AF\u0627\u0646"], "is_holiday": false },
    { "date": [5, 17], "title": ["\u0631\u0648\u0632 \u062E\u0628\u0631\u0646\u06AF\u0627\u0631"], "is_holiday": false },
    { "date": [5, 21], "title": ["\u0631\u0648\u0632 \u062D\u0645\u0627\u06CC\u062A \u0627\u0632 \u0635\u0646\u0627\u06CC\u0639 \u06A9\u0648\u0686\u06A9"], "is_holiday": false },
    { "date": [5, 22], "title": ["\u0631\u0648\u0632 \u062A\u0634\u06A9\u0644\u200C\u0647\u0627 \u0648 \u0645\u0634\u0627\u0631\u06A9\u062A\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC"], "is_holiday": false },
    { "date": [5, 23], "title": ["\u0631\u0648\u0632 \u0645\u0642\u0627\u0648\u0645\u062A \u0627\u0633\u0644\u0627\u0645\u06CC"], "is_holiday": false },
    { "date": [5, 29], "title": ["\u0631\u0648\u0632 \u062A\u062C\u0644\u06CC\u0644 \u0627\u0632 \u0627\u0633\u0631\u0627 \u0648 \u0645\u0641\u0642\u0648\u062F\u0627\u0646"], "is_holiday": false },
    { "date": [5, 30], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0639\u0644\u0627\u0645\u0647 \u0645\u062C\u0644\u0633\u06CC", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0633\u062C\u062F"], "is_holiday": false },
    { "date": [6, 1], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0627\u0628\u0648\u0639\u0644\u06CC \u0633\u06CC\u0646\u0627", "\u0631\u0648\u0632 \u067E\u0632\u0634\u06A9"], "is_holiday": false },
    { "date": [6, 4], "title": ["\u0631\u0648\u0632 \u06A9\u0627\u0631\u0645\u0646\u062F"], "is_holiday": false },
    { "date": [6, 5], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0645\u062D\u0645\u062F\u0628\u0646\u200C\u0632\u06A9\u0631\u06CC\u0627 \u0631\u0627\u0632\u06CC", "\u0631\u0648\u0632 \u062F\u0627\u0631\u0648\u0633\u0627\u0632\u06CC", "\u0631\u0648\u0632 \u06A9\u0634\u062A\u06CC"], "is_holiday": false },
    { "date": [6, 8], "title": ["\u0631\u0648\u0632 \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u062A\u0631\u0648\u0631\u06CC\u0633\u0645"], "is_holiday": false },
    { "date": [6, 13], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0627\u0628\u0648\u0631\u06CC\u062D\u0627\u0646 \u0628\u06CC\u0631\u0648\u0646\u06CC", "\u0631\u0648\u0632 \u062A\u0639\u0627\u0648\u0646"], "is_holiday": false },
    { "date": [6, 21], "title": ["\u0631\u0648\u0632 \u0633\u06CC\u0646\u0645\u0627"], "is_holiday": false },
    { "date": [6, 23], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0633\u0644\u0645\u0627\u0646 \u0641\u0627\u0631\u0633\u06CC"], "is_holiday": false },
    { "date": [6, 27], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0634\u0647\u0631\u06CC\u0627\u0631", "\u0631\u0648\u0632 \u0634\u0639\u0631 \u0648 \u0627\u062F\u0628 \u0641\u0627\u0631\u0633\u06CC"], "is_holiday": false },
    { "date": [7, 5], "title": ["\u0631\u0648\u0632 \u06AF\u0631\u062F\u0634\u06AF\u0631\u06CC"], "is_holiday": false },
    { "date": [7, 7], "title": ["\u0631\u0648\u0632 \u0622\u062A\u0634\u200C\u0646\u0634\u0627\u0646\u06CC \u0648 \u0627\u0645\u0646\u06CC\u062A", "\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0634\u0645\u0633"], "is_holiday": false },
    { "date": [7, 8], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0645\u0648\u0644\u0648\u06CC"], "is_holiday": false },
    { "date": [7, 12], "title": ["\u0631\u0648\u0632 \u0648\u0642\u0641"], "is_holiday": false },
    { "date": [7, 13], "title": ["\u0631\u0648\u0632 \u0646\u06CC\u0631\u0648\u06CC \u0627\u0646\u062A\u0638\u0627\u0645\u06CC"], "is_holiday": false },
    { "date": [7, 14], "title": ["\u0631\u0648\u0632 \u062F\u0627\u0645\u067E\u0632\u0634\u06A9\u06CC"], "is_holiday": false },
    { "date": [7, 15], "title": ["\u0631\u0648\u0632 \u0631\u0648\u0633\u062A\u0627 \u0648 \u0639\u0634\u0627\u06CC\u0631"], "is_holiday": false },
    { "date": [7, 20], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u062D\u0627\u0641\u0638"], "is_holiday": false },
    { "date": [7, 24], "title": ["\u0631\u0648\u0632 \u0645\u0644\u06CC \u067E\u0627\u0631\u0627\u0644\u0645\u067E\u06CC\u06A9"], "is_holiday": false },
    { "date": [7, 26], "title": ["\u0631\u0648\u0632 \u062A\u0631\u0628\u06CC\u062A \u0628\u062F\u0646\u06CC \u0648 \u0648\u0631\u0632\u0634"], "is_holiday": false },
    { "date": [7, 29], "title": ["\u0631\u0648\u0632 \u0635\u0627\u062F\u0631\u0627\u062A"], "is_holiday": false },
    { "date": [8, 8], "title": ["\u0631\u0648\u0632 \u0646\u0648\u062C\u0648\u0627\u0646 \u0648 \u0628\u0633\u06CC\u062C \u062F\u0627\u0646\u0634\u062C\u0648\u06CC\u06CC"], "is_holiday": false },
    { "date": [8, 13], "title": ["\u0631\u0648\u0632 \u062F\u0627\u0646\u0634\u200C\u0622\u0645\u0648\u0632"], "is_holiday": false },
    { "date": [8, 14], "title": ["\u0631\u0648\u0632 \u0641\u0631\u0647\u0646\u06AF \u0639\u0645\u0648\u0645\u06CC"], "is_holiday": false },
    { "date": [8, 24], "title": ["\u0631\u0648\u0632 \u06A9\u062A\u0627\u0628", "\u06A9\u062A\u0627\u0628\u200C\u062E\u0648\u0627\u0646\u06CC \u0648 \u06A9\u062A\u0627\u0628\u062F\u0627\u0631"], "is_holiday": false },
    { "date": [9, 7], "title": ["\u0631\u0648\u0632 \u0646\u06CC\u0631\u0648\u06CC \u062F\u0631\u06CC\u0627\u06CC\u06CC"], "is_holiday": false },
    { "date": [9, 9], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0634\u06CC\u062E \u0645\u0641\u06CC\u062F"], "is_holiday": false },
    { "date": [9, 16], "title": ["\u0631\u0648\u0632 \u062F\u0627\u0646\u0634\u062C\u0648"], "is_holiday": false },
    { "date": [9, 25], "title": ["\u0631\u0648\u0632 \u067E\u0698\u0648\u0647\u0634"], "is_holiday": false },
    { "date": [9, 27], "title": ["\u0631\u0648\u0632 \u0648\u062D\u062F\u062A \u062D\u0648\u0632\u0647 \u0648 \u062F\u0627\u0646\u0634\u06AF\u0627\u0647"], "is_holiday": false },
    { "date": [9, 30], "title": ["\u0634\u0628 \u06CC\u0644\u062F\u0627"], "is_holiday": false },
    { "date": [10, 5], "title": ["\u0631\u0648\u0632 \u0627\u06CC\u0645\u0646\u06CC \u062F\u0631 \u0628\u0631\u0627\u0628\u0631 \u0632\u0644\u0632\u0644\u0647 \u0648 \u06A9\u0627\u0647\u0634 \u0627\u062B\u0631\u0627\u062A \u0628\u0644\u0627\u06CC\u0627\u06CC \u0637\u0628\u06CC\u0639\u06CC"], "is_holiday": false },
    { "date": [11, 14], "title": ["\u0631\u0648\u0632 \u0641\u0646\u0627\u0648\u0631\u06CC \u0641\u0636\u0627\u06CC\u06CC"], "is_holiday": false },
    { "date": [11, 19], "title": ["\u0631\u0648\u0632 \u0646\u06CC\u0631\u0648\u06CC \u0647\u0648\u0627\u06CC\u06CC"], "is_holiday": false },
    { "date": [11, 22], "title": ["\u067E\u06CC\u0631\u0648\u0632\u06CC \u0627\u0646\u0642\u0644\u0627\u0628 \u0627\u0633\u0644\u0627\u0645\u06CC"], "is_holiday": true },
    { "date": [11, 19], "title": ["\u0631\u0648\u0632 \u0627\u0642\u062A\u0635\u0627\u062F \u0645\u0642\u0627\u0648\u0645\u062A\u06CC \u0648 \u06A9\u0627\u0631\u0622\u0641\u0631\u06CC\u0646\u06CC"], "is_holiday": false },
    { "date": [12, 5], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u062E\u0648\u0627\u062C\u0647 \u0646\u0635\u06CC\u0631\u0627\u0644\u062F\u06CC\u0646 \u0637\u0648\u0633\u06CC", "\u0631\u0648\u0632 \u0645\u0647\u0646\u062F\u0633\u06CC"], "is_holiday": false },
    { "date": [12, 14], "title": ["\u0631\u0648\u0632 \u0627\u062D\u0633\u0627\u0646 \u0648 \u0646\u06CC\u06A9\u0648\u06A9\u0627\u0631\u06CC", "\u0631\u0648\u0632 \u062A\u0631\u0648\u06CC\u062C \u0641\u0631\u0647\u0646\u06AF \u0642\u0631\u0636\u200C\u0627\u0644\u062D\u0633\u0646\u0647"], "is_holiday": false },
    { "date": [12, 15], "title": ["\u0631\u0648\u0632 \u062F\u0631\u062E\u062A\u06A9\u0627\u0631\u06CC"], "is_holiday": false },
    { "date": [12, 20], "title": ["\u0631\u0648\u0632 \u0631\u0627\u0647\u06CC\u0627\u0646 \u0646\u0648\u0631"], "is_holiday": false },
    { "date": [12, 21], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u0646\u0638\u0627\u0645\u06CC \u06AF\u0646\u062C\u0648\u06CC"], "is_holiday": false },
    { "date": [12, 25], "title": ["\u0631\u0648\u0632 \u0628\u0632\u0631\u06AF\u062F\u0627\u0634\u062A \u067E\u0631\u0648\u06CC\u0646 \u0627\u0639\u062A\u0635\u0627\u0645\u06CC"], "is_holiday": false },
    { "date": [12, 29], "title": ["\u0631\u0648\u0632 \u0645\u0644\u06CC \u0634\u062F\u0646 \u0635\u0646\u0639\u062A \u0646\u0641\u062A"], "is_holiday": true }
  ];
  const unofficialWorldEvents = [
    { "date": [1, 1], "title": ["\u0622\u063A\u0627\u0632 \u0633\u0627\u0644 \u062C\u062F\u06CC\u062F \u0647\u062C\u0631\u06CC \u0642\u0645\u0631\u06CC"], "is_holiday": false },
    { "date": [1, 9], "title": ["\u062A\u0627\u0633\u0648\u0639\u0627\u06CC \u062D\u0633\u06CC\u0646\u06CC"], "is_holiday": true },
    { "date": [1, 10], "title": ["\u0639\u0627\u0634\u0648\u0631\u0627\u06CC \u062D\u0633\u06CC\u0646\u06CC"], "is_holiday": true },
    { "date": [1, 12], "title": ["\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0633\u062C\u0627\u062F (\u0639)"], "is_holiday": false },
    { "date": [2, 20], "title": ["\u0627\u0631\u0628\u0639\u06CC\u0646 \u062D\u0633\u06CC\u0646\u06CC"], "is_holiday": true },
    { "date": [2, 28], "title": ["\u0631\u062D\u0644\u062A \u062D\u0636\u0631\u062A \u0631\u0633\u0648\u0644 \u0627\u06A9\u0631\u0645 (\u0635)", "\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u062D\u0633\u0646 \u0645\u062C\u062A\u0628\u06CC (\u0639)"], "is_holiday": true },
    { "date": [2, 30], "title": ["\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0631\u0636\u0627 (\u0639)"], "is_holiday": true },
    { "date": [3, 1], "title": ["\u0647\u062C\u0631\u062A \u062D\u0636\u0631\u062A \u0631\u0633\u0648\u0644 \u0627\u06A9\u0631\u0645 (\u0635) \u0627\u0632 \u0645\u06A9\u0647 \u0628\u0647 \u0645\u062F\u06CC\u0646\u0647"], "is_holiday": false },
    { "date": [3, 8], "title": ["\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u062D\u0633\u0646 \u0639\u0633\u06A9\u0631\u06CC (\u0639)"], "is_holiday": true },
    { "date": [3, 17], "title": ["\u0648\u0644\u0627\u062F\u062A \u062D\u0636\u0631\u062A \u0631\u0633\u0648\u0644 \u0627\u06A9\u0631\u0645 (\u0635)"], "is_holiday": true },
    { "date": [3, 19], "title": ["\u0648\u0644\u0627\u062F\u062A \u062D\u0636\u0631\u062A \u0631\u0633\u0648\u0644 \u0627\u06A9\u0631\u0645 (\u0635) \u0628\u0647 \u0631\u0648\u0627\u06CC\u062A \u0627\u0647\u0644 \u0633\u0646\u062A"], "is_holiday": false },
    { "date": [4, 8], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u062D\u0633\u0646 \u0639\u0633\u06A9\u0631\u06CC (\u0639)"], "is_holiday": false },
    { "date": [4, 10], "title": ["\u0648\u0641\u0627\u062A \u062D\u0636\u0631\u062A \u0645\u0639\u0635\u0648\u0645\u0647 (\u0633)"], "is_holiday": false },
    { "date": [5, 5], "title": ["\u0648\u0644\u0627\u062F\u062A \u062D\u0636\u0631\u062A \u0632\u06CC\u0646\u0628 (\u0633)"], "is_holiday": false },
    { "date": [6, 3], "title": ["\u0634\u0647\u0627\u062F\u062A \u062D\u0636\u0631\u062A \u0641\u0627\u0637\u0645\u0647 (\u0633)"], "is_holiday": true },
    { "date": [6, 13], "title": ["\u0648\u0641\u0627\u062A \u062D\u0636\u0631\u062A \u0627\u0645\u200C\u0627\u0644\u0628\u0646\u06CC\u0646 (\u0633)"], "is_holiday": false },
    { "date": [6, 20], "title": ["\u0648\u0644\u0627\u062F\u062A \u062D\u0636\u0631\u062A \u0641\u0627\u0637\u0645\u0647 (\u0633) \u0648 \u0631\u0648\u0632 \u0632\u0646"], "is_holiday": false },
    { "date": [7, 1], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0645\u062D\u0645\u062F \u0628\u0627\u0642\u0631 (\u0639)"], "is_holiday": false },
    { "date": [7, 3], "title": ["\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0639\u0644\u06CC \u0646\u0642\u06CC (\u0639)"], "is_holiday": false },
    { "date": [7, 10], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0645\u062D\u0645\u062F \u062A\u0642\u06CC (\u0639)"], "is_holiday": false },
    { "date": [7, 13], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0639\u0644\u06CC (\u0639)"], "is_holiday": true },
    { "date": [7, 15], "title": ["\u0627\u0631\u062A\u062D\u0627\u0644 \u062D\u0636\u0631\u062A \u0632\u06CC\u0646\u0628 (\u0633)"], "is_holiday": false },
    { "date": [7, 25], "title": ["\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0645\u0648\u0633\u06CC \u06A9\u0627\u0638\u0645 (\u0639)"], "is_holiday": false },
    { "date": [7, 27], "title": ["\u0645\u0628\u0639\u062B \u062D\u0636\u0631\u062A \u0631\u0633\u0648\u0644 \u0627\u06A9\u0631\u0645 (\u0635)"], "is_holiday": true },
    { "date": [8, 3], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u062D\u0633\u06CC\u0646 (\u0639)"], "is_holiday": false },
    { "date": [8, 4], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0628\u0648\u0627\u0644\u0641\u0636\u0644 \u0639\u0628\u0627\u0633 (\u0639)"], "is_holiday": false },
    { "date": [8, 5], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0633\u062C\u0627\u062F (\u0639)"], "is_holiday": false },
    { "date": [8, 11], "title": ["\u0648\u0644\u0627\u062F\u062A \u0639\u0644\u06CC \u0627\u06A9\u0628\u0631 (\u0639)"], "is_holiday": false },
    { "date": [8, 15], "title": ["\u0648\u0644\u0627\u062F\u062A \u062D\u0636\u0631\u062A \u0642\u0627\u0626\u0645 (\u0639\u062C\u0644)"], "is_holiday": true },
    { "date": [9, 15], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u062D\u0633\u0646 \u0645\u062C\u062A\u0628\u06CC (\u0639)"], "is_holiday": false },
    { "date": [9, 18], "title": ["\u0634\u0628 \u0642\u062F\u0631"], "is_holiday": false },
    { "date": [9, 19], "title": ["\u0636\u0631\u0628\u062A \u062E\u0648\u0631\u062F\u0646 \u0627\u0645\u0627\u0645 \u0639\u0644\u06CC (\u0639)"], "is_holiday": false },
    { "date": [9, 20], "title": ["\u0634\u0628 \u0642\u062F\u0631"], "is_holiday": false },
    { "date": [9, 21], "title": ["\u0634\u0647\u0627\u062F\u062A \u062D\u0636\u0631\u062A \u0639\u0644\u06CC (\u0639)"], "is_holiday": true },
    { "date": [9, 22], "title": ["\u0634\u0628 \u0642\u062F\u0631"], "is_holiday": false },
    { "date": [10, 1], "title": ["\u0639\u06CC\u062F \u0641\u0637\u0631"], "is_holiday": true },
    { "date": [10, 2], "title": ["\u062A\u0639\u0637\u06CC\u0644\u0627\u062A \u0639\u06CC\u062F \u0641\u0637\u0631"], "is_holiday": true },
    { "date": [10, 25], "title": ["\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u062C\u0639\u0641\u0631 \u0635\u0627\u062F\u0642 (\u0639)"], "is_holiday": true },
    { "date": [11, 1], "title": ["\u0648\u0644\u0627\u062F\u062A \u062D\u0636\u0631\u062A \u0645\u0639\u0635\u0648\u0645\u0647 (\u0633)"], "is_holiday": false },
    { "date": [11, 11], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0631\u0636\u0627 (\u0639)"], "is_holiday": false },
    { "date": [11, 30], "title": ["\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0645\u062D\u0645\u062F \u062A\u0642\u06CC (\u0639)"], "is_holiday": false },
    { "date": [12, 1], "title": ["\u0633\u0627\u0644\u0631\u0648\u0632 \u0627\u0632\u062F\u0648\u0627\u062C \u0627\u0645\u0627\u0645 \u0639\u0644\u06CC (\u0639) \u0648 \u062D\u0636\u0631\u062A \u0641\u0627\u0637\u0645\u0647 (\u0633)"], "is_holiday": false },
    { "date": [12, 7], "title": ["\u0634\u0647\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0645\u062D\u0645\u062F \u0628\u0627\u0642\u0631 (\u0639)"], "is_holiday": false },
    { "date": [12, 9], "title": ["\u0631\u0648\u0632 \u0639\u0631\u0641\u0647"], "is_holiday": false },
    { "date": [12, 10], "title": ["\u0639\u06CC\u062F \u0642\u0631\u0628\u0627\u0646"], "is_holiday": true },
    { "date": [12, 15], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0639\u0644\u06CC \u0646\u0642\u06CC (\u0639)"], "is_holiday": false },
    { "date": [12, 18], "title": ["\u0639\u06CC\u062F \u063A\u062F\u06CC\u0631 \u062E\u0645"], "is_holiday": true },
    { "date": [12, 20], "title": ["\u0648\u0644\u0627\u062F\u062A \u0627\u0645\u0627\u0645 \u0645\u0648\u0633\u06CC \u06A9\u0627\u0638\u0645 (\u0639)"], "is_holiday": false }
  ];
  const officialWorldEvents = [
    { "date": [1, 1], "title": ["\u062C\u0634\u0646 \u0622\u063A\u0627\u0632 \u0633\u0627\u0644 \u0646\u0648 \u0645\u06CC\u0644\u0627\u062F\u06CC"], "is_holiday": false },
    { "date": [1, 14], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0646\u0637\u0642"], "is_holiday": false },
    { "date": [1, 24], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0622\u0645\u0648\u0632\u0634", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0641\u0631\u0647\u0646\u06AF \u0622\u0641\u0631\u06CC\u0642\u0627\u06CC\u06CC"], "is_holiday": false },
    { "date": [1, 26], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06AF\u0645\u0631\u06A9"], "is_holiday": false },
    { "date": [1, 27], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06CC\u0627\u062F\u0628\u0648\u062F \u0647\u0648\u0644\u0648\u06A9\u0627\u0633\u062A"], "is_holiday": false },
    { "date": [2, 11], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0646\u0627\u0646 \u0648 \u062F\u062E\u062A\u0631\u0627\u0646 \u062F\u0631 \u0639\u0644\u0645"], "is_holiday": false },
    { "date": [2, 13], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0631\u0627\u062F\u06CC\u0648"], "is_holiday": false },
    { "date": [2, 14], "title": ["\u062C\u0634\u0646 \u0648\u0644\u0646\u062A\u0627\u06CC\u0646"], "is_holiday": false },
    { "date": [2, 20], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0639\u062F\u0627\u0644\u062A \u0627\u062C\u062A\u0645\u0627\u0639\u06CC"], "is_holiday": false },
    { "date": [2, 21], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0628\u0627\u0646 \u0645\u0627\u062F\u0631\u06CC"], "is_holiday": false },
    { "date": [3, 4], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0647\u0646\u062F\u0633\u06CC \u0628\u0631\u0627\u06CC \u062A\u0648\u0633\u0639\u0647 \u067E\u0627\u06CC\u062F\u0627\u0631"], "is_holiday": false },
    { "date": [3, 8], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0646"], "is_holiday": false },
    { "date": [3, 14], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0631\u06CC\u0627\u0636\u06CC\u0627\u062A"], "is_holiday": false },
    { "date": [3, 20], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0634\u0627\u062F\u06CC", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0641\u0631\u0627\u0646\u06A9\u0641\u0648\u0646\u06CC"], "is_holiday": false },
    { "date": [3, 21], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0646\u0648\u0631\u0648\u0632", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0634\u0639\u0631", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0631\u0641\u0639 \u062A\u0628\u0639\u06CC\u0636 \u0646\u0698\u0627\u062F\u06CC"], "is_holiday": false },
    { "date": [3, 22], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0622\u0628"], "is_holiday": false },
    { "date": [3, 23], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0647\u0648\u0627\u0634\u0646\u0627\u0633\u06CC"], "is_holiday": false },
    { "date": [3, 27], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062A\u0626\u0627\u062A\u0631"], "is_holiday": false },
    { "date": [4, 4], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0636\u062F \u0645\u06CC\u0646"], "is_holiday": false },
    { "date": [4, 6], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0648\u0631\u0632\u0634 \u0628\u0631\u0627\u06CC \u062A\u0648\u0633\u0639\u0647 \u0648 \u0635\u0644\u062D"], "is_holiday": false },
    { "date": [4, 7], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u0647\u062F\u0627\u0634\u062A"], "is_holiday": false },
    { "date": [4, 12], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06A9\u06CC\u0647\u0627\u0646 \u0646\u0648\u0631\u062F\u06CC"], "is_holiday": false },
    { "date": [4, 15], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0647\u0646\u0631"], "is_holiday": false },
    { "date": [4, 22], "title": ["\u0631\u0648\u0632 \u0632\u0645\u06CC\u0646"], "is_holiday": false },
    { "date": [4, 23], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06A9\u062A\u0627\u0628"], "is_holiday": false },
    { "date": [4, 27], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0637\u0631\u0627\u062D\u06CC \u0648 \u06AF\u0631\u0627\u0641\u06CC\u06A9"], "is_holiday": false },
    { "date": [4, 30], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062C\u0627\u0632"], "is_holiday": false },
    { "date": [5, 1], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06A9\u0627\u0631\u06AF\u0631"], "is_holiday": false },
    { "date": [5, 3], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0622\u0632\u0627\u062F\u06CC \u0645\u0637\u0628\u0648\u0639\u0627\u062A"], "is_holiday": false },
    { "date": [5, 5], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0627\u0645\u0627", "\u0631\u0648\u0632 \u0645\u06CC\u0631\u0627\u062B \u062C\u0647\u0627\u0646\u06CC \u0622\u0641\u0631\u06CC\u0642\u0627", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0628\u0627\u0646 \u067E\u0631\u062A\u063A\u0627\u0644\u06CC"], "is_holiday": false },
    { "date": [5, 8], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0635\u0644\u06CC\u0628 \u0633\u0631\u062E \u0648 \u0647\u0644\u0627\u0644 \u0627\u062D\u0645\u0631"], "is_holiday": false },
    { "date": [5, 15], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062E\u0627\u0646\u0648\u0627\u062F\u0647"], "is_holiday": false },
    { "date": [5, 16], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0646\u0648\u0631", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0646\u062F\u06AF\u06CC \u0628\u0627 \u0647\u0645 \u062F\u0631 \u0635\u0644\u062D"], "is_holiday": false },
    { "date": [5, 17], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0627\u0631\u062A\u0628\u0627\u0637\u0627\u062A"], "is_holiday": false },
    { "date": [5, 18], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0648\u0632\u0647 \u0648 \u0645\u06CC\u0631\u0627\u062B \u0641\u0631\u0647\u0646\u06AF\u06CC"], "is_holiday": false },
    { "date": [5, 21], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062A\u0646\u0648\u0639 \u0641\u0631\u0647\u0646\u06AF\u06CC \u0628\u0631\u0627\u06CC \u06AF\u0641\u062A\u06AF\u0648 \u0648 \u062A\u0648\u0633\u0639\u0647"], "is_holiday": false },
    { "date": [5, 22], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062A\u0646\u0648\u0639 \u0632\u06CC\u0633\u062A\u06CC"], "is_holiday": false },
    { "date": [5, 29], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06A9\u0644\u0627\u0647\u200C\u0622\u0628\u06CC\u200C\u0647\u0627\u06CC \u0633\u0627\u0632\u0645\u0627\u0646 \u0645\u0644\u0644"], "is_holiday": false },
    { "date": [5, 31], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u062F\u0648\u0646 \u062F\u062E\u0627\u0646\u06CC\u0627\u062A"], "is_holiday": false },
    { "date": [6, 4], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06A9\u0648\u062F\u06A9\u0627\u0646 \u0642\u0631\u0628\u0627\u0646\u06CC \u062A\u062C\u0627\u0648\u0632"], "is_holiday": false },
    { "date": [6, 5], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u062D\u06CC\u0637 \u0632\u06CC\u0633\u062A"], "is_holiday": false },
    { "date": [6, 8], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0627\u0642\u06CC\u0627\u0646\u0648\u0633\u200C\u0647\u0627"], "is_holiday": false },
    { "date": [6, 10], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0635\u0646\u0627\u06CC\u0639 \u062F\u0633\u062A\u06CC"], "is_holiday": false },
    { "date": [6, 12], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u06A9\u0627\u0631 \u06A9\u0648\u062F\u06A9\u0627\u0646"], "is_holiday": false },
    { "date": [6, 14], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0627\u0647\u062F\u0627\u06CC \u062E\u0648\u0646"], "is_holiday": false },
    { "date": [6, 17], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u0628\u06CC\u0627\u0628\u0627\u0646 \u0648 \u062E\u0634\u06A9\u0633\u0627\u0644\u06CC"], "is_holiday": false },
    { "date": [6, 20], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u067E\u0646\u0627\u0647\u0646\u062F\u06AF\u0627\u0646"], "is_holiday": false },
    { "date": [6, 23], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062E\u062F\u0645\u0627\u062A \u062F\u0648\u0644\u062A\u06CC"], "is_holiday": false },
    { "date": [6, 26], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u0645\u0648\u0627\u062F \u0645\u062E\u062F\u0631"], "is_holiday": false },
    { "date": [7, 11], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062C\u0645\u0639\u06CC\u062A"], "is_holiday": false },
    { "date": [7, 18], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0646\u0644\u0633\u0648\u0646 \u0645\u0627\u0646\u062F\u0644\u0627"], "is_holiday": false },
    { "date": [7, 26], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062D\u0641\u0627\u0638\u062A \u0627\u0632 \u0627\u06A9\u0648\u0633\u06CC\u0633\u062A\u0645 \u062D\u0631\u0627"], "is_holiday": false },
    { "date": [8, 1], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0634\u06CC\u0631 \u0645\u0627\u062F\u0631"], "is_holiday": false },
    { "date": [8, 9], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u0648\u0645\u06CC\u0627\u0646"], "is_holiday": false },
    { "date": [8, 12], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062C\u0648\u0627\u0646\u0627\u0646"], "is_holiday": false },
    { "date": [8, 13], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0686\u067E\u200C\u062F\u0633\u062A\u200C\u0647\u0627"], "is_holiday": false },
    { "date": [8, 19], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0639\u06A9\u0627\u0633\u06CC"], "is_holiday": false },
    { "date": [8, 23], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06CC\u0627\u062F\u0622\u0648\u0631\u06CC \u062A\u062C\u0627\u0631\u062A \u0628\u0631\u062F\u0647 \u0648 \u0644\u063A\u0648 \u0622\u0646"], "is_holiday": false },
    { "date": [8, 31], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0648\u0628\u0644\u0627\u06AF"], "is_holiday": false },
    { "date": [9, 8], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0633\u0648\u0627\u062F\u0622\u0645\u0648\u0632\u06CC"], "is_holiday": false },
    { "date": [9, 10], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u067E\u06CC\u0634\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u062E\u0648\u062F\u06A9\u0634\u06CC"], "is_holiday": false },
    { "date": [9, 15], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0631\u062F\u0645 \u0633\u0627\u0644\u0627\u0631\u06CC"], "is_holiday": false },
    { "date": [9, 16], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0646\u06AF\u0647\u200C\u062F\u0627\u0631\u06CC \u0627\u0632 \u0644\u0627\u06CC\u0647 \u0627\u0632\u0646"], "is_holiday": false },
    { "date": [9, 20], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0648\u0631\u0632\u0634 \u062F\u0627\u0646\u0634\u06AF\u0627\u0647\u06CC"], "is_holiday": false },
    { "date": [9, 21], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0635\u0644\u062D"], "is_holiday": false },
    { "date": [9, 27], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062C\u0647\u0627\u0646\u200C\u06AF\u0631\u062F\u06CC"], "is_holiday": false },
    { "date": [9, 28], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062F\u0633\u062A\u0631\u0633\u06CC \u062C\u0647\u0627\u0646\u06CC \u0628\u0647 \u0627\u0637\u0644\u0627\u0639\u0627\u062A"], "is_holiday": false },
    { "date": [9, 30], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062F\u0631\u06CC\u0627\u0646\u0648\u0631\u062F\u06CC", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0646\u0627\u0634\u0646\u0648\u0627\u06CC\u0627\u0646", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062A\u0631\u062C\u0645\u0647 \u0648 \u0645\u062A\u0631\u062C\u0645"], "is_holiday": false },
    { "date": [10, 1], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0633\u0627\u0644\u0645\u0646\u062F\u0627\u0646"], "is_holiday": false },
    { "date": [10, 4], "title": ["\u0622\u063A\u0627\u0632 \u0647\u0641\u062A\u0647 \u062C\u0647\u0627\u0646\u06CC \u0641\u0636\u0627"], "is_holiday": false },
    { "date": [10, 5], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0622\u0645\u0648\u0632\u06AF\u0627\u0631"], "is_holiday": false },
    { "date": [10, 8], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06A9\u0648\u062F\u06A9"], "is_holiday": false },
    { "date": [10, 9], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u067E\u0633\u062A"], "is_holiday": false },
    { "date": [10, 10], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u0647\u062F\u0627\u0634\u062A \u0631\u0648\u0627\u0646", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u062D\u06A9\u0645 \u0627\u0639\u062F\u0627\u0645"], "is_holiday": false },
    { "date": [10, 11], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062F\u062E\u062A\u0631"], "is_holiday": false },
    { "date": [10, 13], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06A9\u0627\u0647\u0634 \u0628\u0644\u0627\u06CC\u0627"], "is_holiday": false },
    { "date": [10, 14], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F"], "is_holiday": false },
    { "date": [10, 15], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0639\u0635\u0627\u06CC \u0633\u0641\u06CC\u062F"], "is_holiday": false },
    { "date": [10, 16], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u063A\u0630\u0627"], "is_holiday": false },
    { "date": [10, 17], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u0641\u0642\u0631"], "is_holiday": false },
    { "date": [10, 24], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0633\u0627\u0632\u0645\u0627\u0646 \u0645\u0644\u0644", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0627\u062E\u0628\u0627\u0631"], "is_holiday": false },
    { "date": [10, 27], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u06CC\u0631\u0627\u062B \u0633\u0645\u0639\u06CC \u0648 \u0628\u0635\u0631\u06CC"], "is_holiday": false },
    { "date": [11, 2], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u067E\u0627\u06CC\u0627\u0646 \u062F\u0627\u062F\u0646 \u0628\u0647 \u0645\u0635\u0648\u0646\u06CC\u062A \u0627\u0632 \u0645\u062C\u0627\u0632\u0627\u062A \u0628\u0631\u0627\u06CC \u062C\u0646\u0627\u06CC\u0627\u062A \u0639\u0644\u06CC\u0647 \u062E\u0628\u0631\u0646\u06AF\u0627\u0631\u0627\u0646"], "is_holiday": false },
    { "date": [11, 5], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0628\u0627\u0646 \u0631\u0648\u0645\u06CC", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0622\u06AF\u0627\u0647\u06CC \u0627\u0632 \u0633\u0648\u0646\u0627\u0645\u06CC"], "is_holiday": false },
    { "date": [11, 10], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0639\u0644\u0645 \u062F\u0631 \u062E\u062F\u0645\u062A \u0635\u0644\u062D \u0648 \u062A\u0648\u0633\u0639\u0647 \u067E\u0627\u06CC\u062F\u0627\u0631"], "is_holiday": false },
    { "date": [11, 14], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062F\u06CC\u0627\u0628\u062A", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u0642\u0627\u0686\u0627\u0642 \u063A\u06CC\u0631\u0642\u0627\u0646\u0648\u0646\u06CC \u0627\u0645\u0648\u0627\u0644 \u0641\u0631\u0647\u0646\u06AF\u06CC"], "is_holiday": false },
    { "date": [11, 16], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u062F\u0627\u0631\u0627"], "is_holiday": false },
    { "date": [11, 18], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0647\u0646\u0631 \u0627\u0633\u0644\u0627\u0645\u06CC", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0641\u0644\u0633\u0641\u0647"], "is_holiday": false },
    { "date": [11, 19], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0622\u0642\u0627\u06CC\u0627\u0646"], "is_holiday": false },
    { "date": [11, 21], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062A\u0644\u0648\u06CC\u0632\u06CC\u0648\u0646"], "is_holiday": false },
    { "date": [11, 25], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0628\u0627\u0631\u0632\u0647 \u0628\u0627 \u062E\u0634\u0648\u0646\u062A \u0639\u0644\u06CC\u0647 \u0632\u0646\u0627\u0646"], "is_holiday": false },
    { "date": [11, 26], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062F\u0631\u062E\u062A \u0632\u06CC\u062A\u0648\u0646"], "is_holiday": false },
    { "date": [11, 29], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0647\u0645\u0628\u0633\u062A\u06AF\u06CC \u0628\u0627 \u0645\u0631\u062F\u0645 \u0641\u0644\u0633\u0637\u06CC\u0646"], "is_holiday": false },
    { "date": [12, 1], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0627\u06CC\u062F\u0632"], "is_holiday": false },
    { "date": [12, 2], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0622\u0632\u0627\u062F\u06CC \u0628\u0631\u062F\u06AF\u0627\u0646"], "is_holiday": false },
    { "date": [12, 3], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0627\u0641\u0631\u0627\u062F \u062F\u0627\u0631\u0627\u06CC \u0645\u0639\u0644\u0648\u0644\u06CC\u062A"], "is_holiday": false },
    { "date": [12, 7], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u06CC\u06CC"], "is_holiday": false },
    { "date": [12, 10], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062D\u0642\u0648\u0642 \u0628\u0634\u0631"], "is_holiday": false },
    { "date": [12, 11], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u06A9\u0648\u0647\u200C\u0646\u0648\u0631\u062F\u06CC"], "is_holiday": false },
    { "date": [12, 18], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0647\u0627\u062C\u0631\u06CC\u0646", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0628\u0627\u0646 \u0639\u0631\u0628\u06CC"], "is_holiday": false },
    { "date": [12, 25], "title": ["\u062C\u0634\u0646 \u06A9\u0631\u06CC\u0633\u0645\u0633"], "is_holiday": false },
    { "date": [12, 30], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0647\u0645\u0628\u0633\u062A\u06AF\u06CC \u0627\u0646\u0633\u0627\u0646\u06CC"], "is_holiday": false }
  ];
  const hijriEvents = [
    { "date": [7, 1], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u0627\u0644 \u0645\u0631\u063A"], "is_holiday": false },
    { "date": [7, 3], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u062F\u0648\u0646 \u06A9\u06CC\u0633\u0647 \u067E\u0644\u0627\u0633\u062A\u06CC\u06A9\u06CC"], "is_holiday": false },
    { "date": [7, 6], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u0648\u0633\u06CC\u062F\u0646"], "is_holiday": false },
    { "date": [7, 7], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0634\u06A9\u0644\u0627\u062A"], "is_holiday": false },
    { "date": [7, 13], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0633\u0646\u06AF"], "is_holiday": false },
    { "date": [7, 20], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u067E\u0631\u0634"], "is_holiday": false },
    { "date": [7, 28], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0647\u067E\u0627\u062A\u06CC\u062A"], "is_holiday": false },
    { "date": [7, 30], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u062F\u0648\u0633\u062A\u06CC"], "is_holiday": false },
    { "date": [8, 4], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u067E\u0644\u0646\u06AF \u0627\u0628\u0631\u06CC"], "is_holiday": false },
    { "date": [8, 12], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0641\u06CC\u0644"], "is_holiday": false },
    { "date": [8, 19], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0646\u0628\u0648\u0631 \u0639\u0633\u0644"], "is_holiday": false },
    { "date": [8, 20], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u067E\u0634\u0647"], "is_holiday": false },
    { "date": [9, 2], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0631\u06CC\u0634", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0646\u0627\u0631\u06AF\u06CC\u0644"], "is_holiday": false },
    { "date": [9, 9], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0633\u0648\u062F\u0648\u06A9\u0648"], "is_holiday": false },
    { "date": [9, 13], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u0631\u0646\u0627\u0645\u0647\u200C\u0646\u0648\u06CC\u0633\u0627\u0646"], "is_holiday": false },
    { "date": [9, 17], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0645\u0648\u0633\u06CC\u0642\u06CC \u06A9\u0627\u0646\u062A\u0631\u06CC"], "is_holiday": false },
    { "date": [9, 21], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0642\u062F\u0631\u062F\u0627\u0646\u06CC"], "is_holiday": false },
    { "date": [9, 23], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0632\u0628\u0627\u0646 \u0627\u0634\u0627\u0631\u0647"], "is_holiday": false },
    { "date": [9, 24], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0628\u0627\u0644\u06CC\u0648\u0648\u062F", "\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0631\u0648\u062F\u062E\u0627\u0646\u0647\u200C\u0647\u0627"], "is_holiday": false },
    { "date": [9, 29], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0646\u062C\u0648\u0645"], "is_holiday": false },
    { "date": [9, 30], "title": ["\u0631\u0648\u0632 \u062C\u0647\u0627\u0646\u06CC \u0644\u0628\u0627\u0633 \u062A\u0648\u0631\u06CC"], "is_holiday": false }
  ];
  const hijriMonthsDays = {
    start_year: 1427,
    start_julian_day: 2192399,
    end_year: 1464,
    end_julian_day: 2195868,
    days: {
      1427: [355, 30, 29, 29, 30, 29, 30, 30, 30, 30, 29, 29, 30],
      1428: [354, 29, 30, 29, 29, 29, 30, 30, 29, 30, 30, 30, 29],
      1429: [354, 30, 29, 30, 29, 29, 29, 30, 30, 29, 30, 30, 29],
      1430: [354, 30, 30, 29, 29, 30, 29, 30, 29, 29, 30, 30, 29],
      1431: [354, 30, 30, 29, 30, 29, 30, 29, 30, 29, 29, 30, 29],
      1432: [355, 30, 30, 29, 30, 30, 30, 29, 29, 30, 29, 30, 29],
      1433: [355, 29, 30, 29, 30, 30, 30, 29, 30, 29, 30, 29, 30],
      1434: [354, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29],
      1435: [355, 29, 30, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
      1436: [354, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29, 30, 30],
      1437: [354, 29, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30, 30],
      1438: [354, 29, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29, 30],
      1439: [354, 29, 30, 30, 30, 30, 29, 30, 29, 29, 30, 29, 29],
      1440: [355, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30, 29],
      1441: [355, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 30],
      1442: [354, 29, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
      1443: [354, 29, 30, 30, 29, 29, 30, 29, 30, 30, 29, 30, 29],
      1444: [354, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29],
      1445: [354, 30, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 29],
      1446: [355, 30, 30, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29],
      1447: [355, 29, 30, 29, 30, 30, 30, 29, 30, 30, 29, 29, 30],
      1448: [354, 29, 29, 30, 29, 30, 30, 29, 30, 30, 30, 29, 29],
      1449: [355, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30, 29, 30],
      1450: [354, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30, 29],
      1451: [354, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 29],
      1452: [354, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 29],
      1453: [355, 30, 30, 29, 30, 29, 30, 30, 29, 29, 30, 29, 30],
      1454: [354, 29, 30, 29, 30, 30, 29, 30, 30, 29, 30, 29, 29],
      1455: [355, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29],
      1456: [355, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30, 30, 30],
      1457: [354, 29, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30],
      1458: [354, 30, 29, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30],
      1459: [354, 30, 29, 30, 29, 30, 29, 29, 30, 29, 30, 29, 30],
      1460: [354, 30, 29, 30, 30, 29, 30, 29, 29, 30, 29, 30, 29],
      1461: [355, 30, 29, 30, 30, 29, 30, 30, 29, 29, 30, 29, 30],
      1462: [354, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29],
      1463: [355, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29, 30],
      1464: [354, 30, 29, 29, 30, 29, 29, 30, 29, 30, 30, 29, 30]
    }
  };
  const dayCountInMonth = (year, month) => {
    month = month - 1;
    if (month < 0)
      return -1;
    if (month < 6)
      return 31;
    if (month < 11)
      return 30;
    const ary = [1, 5, 9, 13, 17, 22, 26, 30];
    const index = year % 33;
    for (let i = 0; i < ary.length; i++) {
      if (index === ary[i])
        return 30;
    }
    return 29;
  };
  const getDayEvents = (year, month, day) => {
    const events = {
      persianEvents: [],
      hijriEvents: [],
      officialWorldEvents: [],
      unofficialWorldEvents: []
    };
    if (options.persianEvent !== false) {
      const pe = persianEvents.find((item) => item.date[0] === month && item.date[1] === day);
      if (pe)
        events.persianEvents = pe.title;
    }
    if (options.hijriEvent !== false) {
      const hijriDate = jalaliToHijri(year, month, day);
      const he = hijriEvents.find((item) => item.date[0] === hijriDate[1] && item.date[1] === hijriDate[2]);
      if (he)
        events.hijriEvents = he.title;
    }
    if (options.officialWorldEvent !== false) {
      const gregorianDate = jalaliToGregorian(year, month, day);
      const owe = officialWorldEvents.find((item) => item.date[0] === gregorianDate[1] && item.date[1] === gregorianDate[2]);
      if (owe)
        events.officialWorldEvents = owe.title;
    }
    if (options.unofficialWorldEvent !== false) {
      const gregorianDate = jalaliToGregorian(year, month, day);
      const uwe = unofficialWorldEvents.find((item) => item.date[0] === gregorianDate[1] && item.date[1] === gregorianDate[2]);
      if (uwe)
        events.unofficialWorldEvents = uwe.title;
    }
    return events;
  };
  const jalaliToGregorian = (year, month, day) => {
    let gYear = year <= 979 ? 621 : 1600;
    year -= year <= 979 ? 0 : 979;
    let days = 365 * year + Math.floor(year / 33) * 8 + Math.floor((Math.floor(year % 33) + 3) / 4) + 78 + day + (month < 7 ? (month - 1) * 31 : (month - 7) * 30 + 186);
    gYear += 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
      gYear += 100 * Math.floor(--days / 36524);
      days %= 36524;
      if (days >= 365)
        days++;
    }
    gYear += 4 * Math.floor(days / 1461);
    days %= 1461;
    gYear += Math.floor((days - 1) / 365);
    if (days > 365)
      days = (days - 1) % 365;
    let gDay = days + 1;
    const dayCheck = [0, 31, gYear % 4 === 0 && gYear % 100 !== 0 || gYear % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gMonth;
    for (gMonth = 0; gMonth < 13; gMonth++) {
      const dCount = dayCheck[gMonth];
      if (gDay <= dCount)
        break;
      gDay -= dCount;
    }
    return [gYear, gMonth, gDay];
  };
  const hijriToJulianDay = (year, month, day) => {
    year += 990;
    return day + Math.floor(29.5 * (month - 1) + 0.5) + (year - 1) * 354 + Math.floor((3 + year * 11) / 30) + 15976155e-1;
  };
  const jalaliToHijri = (year, month, day) => {
    year += 1595;
    const julianDay = 1365392 + 365 * year + Math.floor(year / 33) * 8 + Math.floor((Math.floor(year % 33) + 3) / 4) + day + (month < 7 ? (month - 1) * 31 : (month - 7) * 30 + 186) - 0.5;
    let hijriYear = Math.floor((30 * (julianDay - 19484395e-1) + 10646) / 10631);
    let temp = julianDay - (19484395e-1 + (hijriYear - 1) * 354 + Math.floor((3 + 11 * hijriYear) / 30));
    hijriYear -= 990;
    if (julianDay >= hijriMonthsDays.start_julian_day && julianDay <= hijriMonthsDays.end_julian_day) {
      let hijriDay2 = Math.floor(julianDay - hijriMonthsDays.start_julian_day + 1);
      for (let y in hijriMonthsDays.days) {
        const yearData = hijriMonthsDays.days[y];
        if (hijriDay2 > yearData[0]) {
          hijriDay2 -= yearData[0];
        } else {
          let hijriMonth2 = 1;
          while (hijriMonth2 < 13 && hijriDay2 > yearData[hijriMonth2]) {
            hijriDay2 -= yearData[hijriMonth2];
            hijriMonth2++;
          }
          return [parseInt(y), hijriMonth2, hijriDay2];
        }
      }
    }
    let hijriMonth = Math.floor((temp - 29) / 29.5 + 1.99);
    if (hijriMonth > 12) hijriMonth = 12;
    const hijriDay = Math.floor(1 + temp - Math.floor(29.5 * (hijriMonth - 1) + 0.5));
    return [hijriYear, hijriMonth, hijriDay];
  };
  const dayIndexOfWeek = (year, month, day) => {
    const date = jalaliToGregorian(year, month, day);
    let gDate = new Date(date[0], date[1] - 1, date[2]).getDay();
    let num = ++gDate;
    if (num === 7)
      num = 0;
    return num;
  };
  const persianMonthName = (month) => persianMonthNames[month - 1];
  const hijriMonthName = (month) => hijriMonthNames[month - 1];
  const gregorianMonthName = (month) => gregorianMonthNames[month - 1];
  const updateTodayDate = () => {
    const todayDate = (/* @__PURE__ */ new Date()).toLocaleDateString("fa-IR-u-nu-latn").split("/").map((item) => parseInt(item));
    today.value = todayDate;
    todayGregorian.value = jalaliToGregorian(todayDate[0], todayDate[1], todayDate[2]);
    todayHijri.value = jalaliToHijri(todayDate[0], todayDate[1], todayDate[2]);
  };
  const nextMonth = () => {
    let year = selectedDay.value[0];
    let month = selectedDay.value[1];
    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }
    selectedDay.value = [year, month, selectedDay.value[2]];
    return selectedDay.value;
  };
  const prevMonth = () => {
    let year = selectedDay.value[0];
    let month = selectedDay.value[1];
    if (month === 1) {
      year--;
      month = 12;
    } else {
      month--;
    }
    selectedDay.value = [year, month, selectedDay.value[2]];
    return selectedDay.value;
  };
  const nextYear = () => {
    selectedDay.value[0]++;
    return selectedDay.value;
  };
  const prevYear = () => {
    selectedDay.value[0]--;
    return selectedDay.value;
  };
  const setYear = (year, month) => {
    selectedDay.value[0] = year;
    if (month !== void 0)
      selectedDay.value[1] = month;
  };
  const setMonth = (month) => {
    selectedDay.value[1] = month;
  };
  const getDayInfo = (date, isHijri = false, isGregorian = false) => {
    const dayIndex = dayIndexOfWeek(date[0], date[1], date[2]);
    const monthName = persianMonthName(date[1]);
    const dayName = dayNames[dayIndex];
    let content = dayName + " ";
    if (isHijri) {
      const hijriDate = jalaliToHijri(date[0], date[1], date[2]);
      content += hijriDate[2] + "\u0627\u0645 " + hijriMonthName(hijriDate[1]) + " \u0633\u0627\u0644 " + hijriDate[0] + " \u0647\u062C\u0631\u06CC \u0642\u0645\u0631\u06CC";
    } else if (isGregorian) {
      const gregorianDate = jalaliToGregorian(date[0], date[1], date[2]);
      content += gregorianDate[2] + "\u0627\u0645 " + gregorianMonthName(gregorianDate[1]) + " \u0633\u0627\u0644 " + gregorianDate[0] + " \u0645\u06CC\u0644\u0627\u062F\u06CC";
    } else {
      content += date[2] + "\u0627\u0645 " + monthName + " \u0633\u0627\u0644 " + date[0] + " \u0634\u0645\u0633\u06CC";
    }
    return content;
  };
  const getTodayPersianInfo = () => getDayInfo(today.value);
  const getSelectedDayPersianInfo = () => getDayInfo(selectedDay.value);
  const getTodayGregorianInfo = () => getDayInfo(today.value, false, true);
  const getSelectedDayGregorianInfo = () => getDayInfo(selectedDay.value, false, true);
  const getTodayHijriInfo = () => getDayInfo(today.value, true);
  const getSelectedDayHijriInfo = () => getDayInfo(selectedDay.value, true);
  const getTodayEvents = () => getDayEvents(today.value[0], today.value[1], today.value[2]);
  const getSelectedDayEvents = () => getDayEvents(selectedDay.value[0], selectedDay.value[1], selectedDay.value[2]);
  onMounted(() => {
    updateTodayDate();
    selectedDay.value = [...today.value];
    if (options.updateToday) {
      updateInterval = setInterval(updateTodayDate, options.updateTodayTimeout || 5e3);
    }
  });
  onUnmounted(() => {
    if (updateInterval !== null) {
      clearInterval(updateInterval);
    }
  });
  return {
    today: computed(() => today.value),
    selectedDay: computed(() => selectedDay.value),
    todayHijri: computed(() => todayHijri.value),
    todayGregorian: computed(() => todayGregorian.value),
    persianMonthName,
    hijriMonthName,
    gregorianMonthName,
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    setYear,
    setMonth,
    getDayEvents,
    getTodayPersianInfo,
    getSelectedDayPersianInfo,
    getTodayGregorianInfo,
    getSelectedDayGregorianInfo,
    getTodayHijriInfo,
    getSelectedDayHijriInfo,
    getTodayEvents,
    getSelectedDayEvents,
    dayCountInMonth,
    jalaliToGregorian,
    jalaliToHijri,
    dayIndexOfWeek
  };
};
