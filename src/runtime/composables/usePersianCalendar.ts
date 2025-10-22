import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useRuntimeConfig } from "nuxt/app"

export interface PersianDate
{
    year: number
    month: number
    day: number
}

export interface DateWithEvents
{
    date: number[]
    hijriDate: number[]
    gregorianDate: number[]
    persianEvents: string[]
    hijriEvents: string[]
    officialWorldEvents: string[]
    unofficialWorldEvents: string[]
}

export interface CalendarEvents
{
    persianEvents: string[]
    hijriEvents: string[]
    officialWorldEvents: string[]
    unofficialWorldEvents: string[]
}

export const usePersianCalendar = () =>
{
    const config = useRuntimeConfig();
    const options = config.public.persianCalendar as any;

    const today: Ref<number[]> = ref([1403, 1, 1]);
    const selectedDay: Ref<number[]> = ref([1403, 1, 1]);
    const todayHijri: Ref<number[]> = ref([1445, 1, 1]);
    const todayGregorian: Ref<number[]> = ref([2024, 1, 1]);

    let updateInterval: ReturnType<typeof setInterval> | null = null;

    const persianMonthNames = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];

    const hijriMonthNames = [
        'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانیه',
        'رجب', 'شعبان', 'رمضان', 'شوال', 'ذیقعده', 'ذیحجه'
    ];

    const gregorianMonthNames = [
        'ژانویه', 'فوریه', 'مارس', 'آپریل', 'می', 'ژوئن',
        'جولای', 'آگوست', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'
    ];

    const dayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

    const persianEvents = [
        { "date": [1, 1], "title": ["عید نوروز"], "is_holiday": true },
        { "date": [1, 2], "title": ["عید نوروز"], "is_holiday": true },
        { "date": [1, 3], "title": ["عید نوروز"], "is_holiday": true },
        { "date": [1, 4], "title": ["عید نوروز"], "is_holiday": true },
        { "date": [1, 6], "title": ["ولادت زرتشت"], "is_holiday": false },
        { "date": [1, 7], "title": ["روز هنرهای نمایشی"], "is_holiday": false },
        { "date": [1, 12], "title": ["روز جمهوری اسلامی"], "is_holiday": true },
        { "date": [1, 13], "title": ["روز طبیعت"], "is_holiday": true },
        { "date": [1, 18], "title": ["روز سلامتی"], "is_holiday": false },
        { "date": [1, 20], "title": ["روز ملی فناوری هسته‌ای"], "is_holiday": false },
        { "date": [1, 25], "title": ["روز بزرگداشت عطار نیشابوری"], "is_holiday": false },
        { "date": [1, 29], "title": ["روز ارتش جمهوری اسلامی و نیروی زمینی"], "is_holiday": false },
        { "date": [2, 1], "title": ["روز بزرگداشت سعدی"], "is_holiday": false },
        { "date": [2, 3], "title": ["روز بزرگداشت شیخ بهایی", "روز معماری"], "is_holiday": false },
        { "date": [2, 7], "title": ["روز ایمنی حمل و نقل"], "is_holiday": false },
        { "date": [2, 9], "title": ["روز شوراها"], "is_holiday": false },
        { "date": [2, 10], "title": ["روز ملی خلیج فارس"], "is_holiday": false },
        { "date": [2, 15], "title": ["روز بزرگداشت شیخ صدوق"], "is_holiday": false },
        { "date": [2, 18], "title": ["روز بیماری‌های خاص و صعب العلاج"], "is_holiday": false },
        { "date": [2, 19], "title": ["روز بزرگداشت شیخ کلینی"], "is_holiday": false },
        { "date": [2, 25], "title": ["روز پاسداشت زبان فارسی و بزرگداشت حکیم ابوالقاسم فردوسی"], "is_holiday": false },
        { "date": [2, 28], "title": ["روز بزرگداشت حکیم عمر خیام"], "is_holiday": false },
        { "date": [2, 30], "title": ["روز ملی جمعیت"], "is_holiday": false },
        { "date": [2, 31], "title": ["روز اهدای عضو", "اهدای زندگی"], "is_holiday": false },
        { "date": [3, 1], "title": ["روز بهره‌وری و بهینه‌سازی مصرف", "روز بزرگداشت ملاصدرا"], "is_holiday": false },
        { "date": [3, 8], "title": ["روز فرهنگ پهلوانی و ورزش زورخانه‌ای"], "is_holiday": false },
        { "date": [3, 14], "title": ["رحلت امام خمینی"], "is_holiday": true },
        { "date": [3, 15], "title": ["قیام خونین 15 خرداد"], "is_holiday": true },
        { "date": [3, 20], "title": ["روز صنایع دستی"], "is_holiday": false },
        { "date": [3, 29], "title": ["درگذشت دکتر علی شریعتی"], "is_holiday": false },
        { "date": [3, 31], "title": ["شهادت دکتر مصطفی چمران", "روز بسیج استادان"], "is_holiday": false },
        { "date": [4, 1], "title": ["روز اصناف"], "is_holiday": false },
        { "date": [4, 7], "title": ["روز قوه قضاییه"], "is_holiday": false },
        { "date": [4, 8], "title": ["روز مبارزه با سلاح‌های شیمیایی و میکروبی"], "is_holiday": false },
        { "date": [4, 10], "title": ["روز صنعت و معدن"], "is_holiday": false },
        { "date": [4, 14], "title": ["روز قلم"], "is_holiday": false },
        { "date": [4, 18], "title": ["روز ادبیات کودکان و نوجوانان"], "is_holiday": false },
        { "date": [4, 23], "title": ["روز گفت‌وگو و تعامل سازنده با جهان"], "is_holiday": false },
        { "date": [4, 25], "title": ["روز بهزیستی و تامین اجتماعی"], "is_holiday": false },
        { "date": [5, 9], "title": ["روز اهدای خون"], "is_holiday": false },
        { "date": [5, 14], "title": ["روز خانواده و تکریم بازنشستگان"], "is_holiday": false },
        { "date": [5, 17], "title": ["روز خبرنگار"], "is_holiday": false },
        { "date": [5, 21], "title": ["روز حمایت از صنایع کوچک"], "is_holiday": false },
        { "date": [5, 22], "title": ["روز تشکل‌ها و مشارکت‌های اجتماعی"], "is_holiday": false },
        { "date": [5, 23], "title": ["روز مقاومت اسلامی"], "is_holiday": false },
        { "date": [5, 29], "title": ["روز تجلیل از اسرا و مفقودان"], "is_holiday": false },
        { "date": [5, 30], "title": ["روز بزرگداشت علامه مجلسی", "روز جهانی مسجد"], "is_holiday": false },
        { "date": [6, 1], "title": ["روز بزرگداشت ابوعلی سینا", "روز پزشک"], "is_holiday": false },
        { "date": [6, 4], "title": ["روز کارمند"], "is_holiday": false },
        { "date": [6, 5], "title": ["روز بزرگداشت محمدبن‌زکریا رازی", "روز داروسازی", "روز کشتی"], "is_holiday": false },
        { "date": [6, 8], "title": ["روز مبارزه با تروریسم"], "is_holiday": false },
        { "date": [6, 13], "title": ["روز بزرگداشت ابوریحان بیرونی", "روز تعاون"], "is_holiday": false },
        { "date": [6, 21], "title": ["روز سینما"], "is_holiday": false },
        { "date": [6, 23], "title": ["روز بزرگداشت سلمان فارسی"], "is_holiday": false },
        { "date": [6, 27], "title": ["روز بزرگداشت شهریار", "روز شعر و ادب فارسی"], "is_holiday": false },
        { "date": [7, 5], "title": ["روز گردشگری"], "is_holiday": false },
        { "date": [7, 7], "title": ["روز آتش‌نشانی و امنیت", "روز بزرگداشت شمس"], "is_holiday": false },
        { "date": [7, 8], "title": ["روز بزرگداشت مولوی"], "is_holiday": false },
        { "date": [7, 12], "title": ["روز وقف"], "is_holiday": false },
        { "date": [7, 13], "title": ["روز نیروی انتظامی"], "is_holiday": false },
        { "date": [7, 14], "title": ["روز دامپزشکی"], "is_holiday": false },
        { "date": [7, 15], "title": ["روز روستا و عشایر"], "is_holiday": false },
        { "date": [7, 20], "title": ["روز بزرگداشت حافظ"], "is_holiday": false },
        { "date": [7, 24], "title": ["روز ملی پارالمپیک"], "is_holiday": false },
        { "date": [7, 26], "title": ["روز تربیت بدنی و ورزش"], "is_holiday": false },
        { "date": [7, 29], "title": ["روز صادرات"], "is_holiday": false },
        { "date": [8, 8], "title": ["روز نوجوان و بسیج دانشجویی"], "is_holiday": false },
        { "date": [8, 13], "title": ["روز دانش‌آموز"], "is_holiday": false },
        { "date": [8, 14], "title": ["روز فرهنگ عمومی"], "is_holiday": false },
        { "date": [8, 24], "title": ["روز کتاب", "کتاب‌خوانی و کتابدار"], "is_holiday": false },
        { "date": [9, 7], "title": ["روز نیروی دریایی"], "is_holiday": false },
        { "date": [9, 9], "title": ["روز بزرگداشت شیخ مفید"], "is_holiday": false },
        { "date": [9, 16], "title": ["روز دانشجو"], "is_holiday": false },
        { "date": [9, 25], "title": ["روز پژوهش"], "is_holiday": false },
        { "date": [9, 27], "title": ["روز وحدت حوزه و دانشگاه"], "is_holiday": false },
        { "date": [9, 30], "title": ["شب یلدا"], "is_holiday": false },
        { "date": [10, 5], "title": ["روز ایمنی در برابر زلزله و کاهش اثرات بلایای طبیعی"], "is_holiday": false },
        { "date": [11, 14], "title": ["روز فناوری فضایی"], "is_holiday": false },
        { "date": [11, 19], "title": ["روز نیروی هوایی"], "is_holiday": false },
        { "date": [11, 22], "title": ["پیروزی انقلاب اسلامی"], "is_holiday": true },
        { "date": [11, 19], "title": ["روز اقتصاد مقاومتی و کارآفرینی"], "is_holiday": false },
        { "date": [12, 5], "title": ["روز بزرگداشت خواجه نصیرالدین طوسی", "روز مهندسی"], "is_holiday": false },
        { "date": [12, 14], "title": ["روز احسان و نیکوکاری", "روز ترویج فرهنگ قرض‌الحسنه"], "is_holiday": false },
        { "date": [12, 15], "title": ["روز درختکاری"], "is_holiday": false },
        { "date": [12, 20], "title": ["روز راهیان نور"], "is_holiday": false },
        { "date": [12, 21], "title": ["روز بزرگداشت نظامی گنجوی"], "is_holiday": false },
        { "date": [12, 25], "title": ["روز بزرگداشت پروین اعتصامی"], "is_holiday": false },
        { "date": [12, 29], "title": ["روز ملی شدن صنعت نفت"], "is_holiday": true }
    ];

    const unofficialWorldEvents = [
        { "date": [1, 1], "title": ["آغاز سال جدید هجری قمری"], "is_holiday": false },
        { "date": [1, 9], "title": ["تاسوعای حسینی"], "is_holiday": true },
        { "date": [1, 10], "title": ["عاشورای حسینی"], "is_holiday": true },
        { "date": [1, 12], "title": ["شهادت امام سجاد (ع)"], "is_holiday": false },
        { "date": [2, 20], "title": ["اربعین حسینی"], "is_holiday": true },
        { "date": [2, 28], "title": ["رحلت حضرت رسول اکرم (ص)", "شهادت امام حسن مجتبی (ع)"], "is_holiday": true },
        { "date": [2, 30], "title": ["شهادت امام رضا (ع)"], "is_holiday": true },
        { "date": [3, 1], "title": ["هجرت حضرت رسول اکرم (ص) از مکه به مدینه"], "is_holiday": false },
        { "date": [3, 8], "title": ["شهادت امام حسن عسکری (ع)"], "is_holiday": true },
        { "date": [3, 17], "title": ["ولادت حضرت رسول اکرم (ص)"], "is_holiday": true },
        { "date": [3, 19], "title": ["ولادت حضرت رسول اکرم (ص) به روایت اهل سنت"], "is_holiday": false },
        { "date": [4, 8], "title": ["ولادت امام حسن عسکری (ع)"], "is_holiday": false },
        { "date": [4, 10], "title": ["وفات حضرت معصومه (س)"], "is_holiday": false },
        { "date": [5, 5], "title": ["ولادت حضرت زینب (س)"], "is_holiday": false },
        { "date": [6, 3], "title": ["شهادت حضرت فاطمه (س)"], "is_holiday": true },
        { "date": [6, 13], "title": ["وفات حضرت ام‌البنین (س)"], "is_holiday": false },
        { "date": [6, 20], "title": ["ولادت حضرت فاطمه (س) و روز زن"], "is_holiday": false },
        { "date": [7, 1], "title": ["ولادت امام محمد باقر (ع)"], "is_holiday": false },
        { "date": [7, 3], "title": ["شهادت امام علی نقی (ع)"], "is_holiday": false },
        { "date": [7, 10], "title": ["ولادت امام محمد تقی (ع)"], "is_holiday": false },
        { "date": [7, 13], "title": ["ولادت امام علی (ع)"], "is_holiday": true },
        { "date": [7, 15], "title": ["ارتحال حضرت زینب (س)"], "is_holiday": false },
        { "date": [7, 25], "title": ["شهادت امام موسی کاظم (ع)"], "is_holiday": false },
        { "date": [7, 27], "title": ["مبعث حضرت رسول اکرم (ص)"], "is_holiday": true },
        { "date": [8, 3], "title": ["ولادت امام حسین (ع)"], "is_holiday": false },
        { "date": [8, 4], "title": ["ولادت ابوالفضل عباس (ع)"], "is_holiday": false },
        { "date": [8, 5], "title": ["ولادت امام سجاد (ع)"], "is_holiday": false },
        { "date": [8, 11], "title": ["ولادت علی اکبر (ع)"], "is_holiday": false },
        { "date": [8, 15], "title": ["ولادت حضرت قائم (عجل)"], "is_holiday": true },
        { "date": [9, 15], "title": ["ولادت امام حسن مجتبی (ع)"], "is_holiday": false },
        { "date": [9, 18], "title": ["شب قدر"], "is_holiday": false },
        { "date": [9, 19], "title": ["ضربت خوردن امام علی (ع)"], "is_holiday": false },
        { "date": [9, 20], "title": ["شب قدر"], "is_holiday": false },
        { "date": [9, 21], "title": ["شهادت حضرت علی (ع)"], "is_holiday": true },
        { "date": [9, 22], "title": ["شب قدر"], "is_holiday": false },
        { "date": [10, 1], "title": ["عید فطر"], "is_holiday": true },
        { "date": [10, 2], "title": ["تعطیلات عید فطر"], "is_holiday": true },
        { "date": [10, 25], "title": ["شهادت امام جعفر صادق (ع)"], "is_holiday": true },
        { "date": [11, 1], "title": ["ولادت حضرت معصومه (س)"], "is_holiday": false },
        { "date": [11, 11], "title": ["ولادت امام رضا (ع)"], "is_holiday": false },
        { "date": [11, 30], "title": ["شهادت امام محمد تقی (ع)"], "is_holiday": false },
        { "date": [12, 1], "title": ["سالروز ازدواج امام علی (ع) و حضرت فاطمه (س)"], "is_holiday": false },
        { "date": [12, 7], "title": ["شهادت امام محمد باقر (ع)"], "is_holiday": false },
        { "date": [12, 9], "title": ["روز عرفه"], "is_holiday": false },
        { "date": [12, 10], "title": ["عید قربان"], "is_holiday": true },
        { "date": [12, 15], "title": ["ولادت امام علی نقی (ع)"], "is_holiday": false },
        { "date": [12, 18], "title": ["عید غدیر خم"], "is_holiday": true },
        { "date": [12, 20], "title": ["ولادت امام موسی کاظم (ع)"], "is_holiday": false }
    ];

    const officialWorldEvents = [
        { "date": [1, 1], "title": ["جشن آغاز سال نو میلادی"], "is_holiday": false },
        { "date": [1, 14], "title": ["روز جهانی منطق"], "is_holiday": false },
        { "date": [1, 24], "title": ["روز جهانی آموزش", "روز جهانی فرهنگ آفریقایی"], "is_holiday": false },
        { "date": [1, 26], "title": ["روز جهانی گمرک"], "is_holiday": false },
        { "date": [1, 27], "title": ["روز جهانی یادبود هولوکاست"], "is_holiday": false },
        { "date": [2, 11], "title": ["روز جهانی زنان و دختران در علم"], "is_holiday": false },
        { "date": [2, 13], "title": ["روز جهانی رادیو"], "is_holiday": false },
        { "date": [2, 14], "title": ["جشن ولنتاین"], "is_holiday": false },
        { "date": [2, 20], "title": ["روز جهانی عدالت اجتماعی"], "is_holiday": false },
        { "date": [2, 21], "title": ["روز جهانی زبان مادری"], "is_holiday": false },
        { "date": [3, 4], "title": ["روز جهانی مهندسی برای توسعه پایدار"], "is_holiday": false },
        { "date": [3, 8], "title": ["روز جهانی زن"], "is_holiday": false },
        { "date": [3, 14], "title": ["روز جهانی ریاضیات"], "is_holiday": false },
        { "date": [3, 20], "title": ["روز جهانی شادی", "روز جهانی فرانکفونی"], "is_holiday": false },
        { "date": [3, 21], "title": ["روز جهانی نوروز", "روز جهانی شعر", "روز جهانی رفع تبعیض نژادی"], "is_holiday": false },
        { "date": [3, 22], "title": ["روز جهانی آب"], "is_holiday": false },
        { "date": [3, 23], "title": ["روز جهانی هواشناسی"], "is_holiday": false },
        { "date": [3, 27], "title": ["روز جهانی تئاتر"], "is_holiday": false },
        { "date": [4, 4], "title": ["روز جهانی ضد مین"], "is_holiday": false },
        { "date": [4, 6], "title": ["روز جهانی ورزش برای توسعه و صلح"], "is_holiday": false },
        { "date": [4, 7], "title": ["روز جهانی بهداشت"], "is_holiday": false },
        { "date": [4, 12], "title": ["روز جهانی کیهان نوردی"], "is_holiday": false },
        { "date": [4, 15], "title": ["روز جهانی هنر"], "is_holiday": false },
        { "date": [4, 22], "title": ["روز زمین"], "is_holiday": false },
        { "date": [4, 23], "title": ["روز جهانی کتاب"], "is_holiday": false },
        { "date": [4, 27], "title": ["روز جهانی طراحی و گرافیک"], "is_holiday": false },
        { "date": [4, 30], "title": ["روز جهانی جاز"], "is_holiday": false },
        { "date": [5, 1], "title": ["روز جهانی کارگر"], "is_holiday": false },
        { "date": [5, 3], "title": ["روز جهانی آزادی مطبوعات"], "is_holiday": false },
        { "date": [5, 5], "title": ["روز جهانی ماما", "روز میراث جهانی آفریقا", "روز جهانی زبان پرتغالی"], "is_holiday": false },
        { "date": [5, 8], "title": ["روز جهانی صلیب سرخ و هلال احمر"], "is_holiday": false },
        { "date": [5, 15], "title": ["روز جهانی خانواده"], "is_holiday": false },
        { "date": [5, 16], "title": ["روز جهانی نور", "روز جهانی زندگی با هم در صلح"], "is_holiday": false },
        { "date": [5, 17], "title": ["روز جهانی ارتباطات"], "is_holiday": false },
        { "date": [5, 18], "title": ["روز جهانی موزه و میراث فرهنگی"], "is_holiday": false },
        { "date": [5, 21], "title": ["روز جهانی تنوع فرهنگی برای گفتگو و توسعه"], "is_holiday": false },
        { "date": [5, 22], "title": ["روز جهانی تنوع زیستی"], "is_holiday": false },
        { "date": [5, 29], "title": ["روز جهانی کلاه‌آبی‌های سازمان ملل"], "is_holiday": false },
        { "date": [5, 31], "title": ["روز جهانی بدون دخانیات"], "is_holiday": false },
        { "date": [6, 4], "title": ["روز جهانی کودکان قربانی تجاوز"], "is_holiday": false },
        { "date": [6, 5], "title": ["روز جهانی محیط زیست"], "is_holiday": false },
        { "date": [6, 8], "title": ["روز جهانی اقیانوس‌ها"], "is_holiday": false },
        { "date": [6, 10], "title": ["روز جهانی صنایع دستی"], "is_holiday": false },
        { "date": [6, 12], "title": ["روز جهانی مبارزه با کار کودکان"], "is_holiday": false },
        { "date": [6, 14], "title": ["روز جهانی اهدای خون"], "is_holiday": false },
        { "date": [6, 17], "title": ["روز جهانی مبارزه با بیابان و خشکسالی"], "is_holiday": false },
        { "date": [6, 20], "title": ["روز جهانی پناهندگان"], "is_holiday": false },
        { "date": [6, 23], "title": ["روز جهانی خدمات دولتی"], "is_holiday": false },
        { "date": [6, 26], "title": ["روز جهانی مبارزه با مواد مخدر"], "is_holiday": false },
        { "date": [7, 11], "title": ["روز جهانی جمعیت"], "is_holiday": false },
        { "date": [7, 18], "title": ["روز جهانی نلسون ماندلا"], "is_holiday": false },
        { "date": [7, 26], "title": ["روز جهانی حفاظت از اکوسیستم حرا"], "is_holiday": false },
        { "date": [8, 1], "title": ["روز جهانی شیر مادر"], "is_holiday": false },
        { "date": [8, 9], "title": ["روز جهانی بومیان"], "is_holiday": false },
        { "date": [8, 12], "title": ["روز جهانی جوانان"], "is_holiday": false },
        { "date": [8, 13], "title": ["روز جهانی چپ‌دست‌ها"], "is_holiday": false },
        { "date": [8, 19], "title": ["روز جهانی عکاسی"], "is_holiday": false },
        { "date": [8, 23], "title": ["روز جهانی یادآوری تجارت برده و لغو آن"], "is_holiday": false },
        { "date": [8, 31], "title": ["روز جهانی وبلاگ"], "is_holiday": false },
        { "date": [9, 8], "title": ["روز جهانی سوادآموزی"], "is_holiday": false },
        { "date": [9, 10], "title": ["روز جهانی پیشگیری از خودکشی"], "is_holiday": false },
        { "date": [9, 15], "title": ["روز جهانی مردم سالاری"], "is_holiday": false },
        { "date": [9, 16], "title": ["روز جهانی نگه‌داری از لایه ازن"], "is_holiday": false },
        { "date": [9, 20], "title": ["روز جهانی ورزش دانشگاهی"], "is_holiday": false },
        { "date": [9, 21], "title": ["روز جهانی صلح"], "is_holiday": false },
        { "date": [9, 27], "title": ["روز جهانی جهان‌گردی"], "is_holiday": false },
        { "date": [9, 28], "title": ["روز جهانی دسترسی جهانی به اطلاعات"], "is_holiday": false },
        { "date": [9, 30], "title": ["روز جهانی دریانوردی", "روز جهانی ناشنوایان", "روز جهانی ترجمه و مترجم"], "is_holiday": false },
        { "date": [10, 1], "title": ["روز جهانی سالمندان"], "is_holiday": false },
        { "date": [10, 4], "title": ["آغاز هفته جهانی فضا"], "is_holiday": false },
        { "date": [10, 5], "title": ["روز جهانی آموزگار"], "is_holiday": false },
        { "date": [10, 8], "title": ["روز جهانی کودک"], "is_holiday": false },
        { "date": [10, 9], "title": ["روز جهانی پست"], "is_holiday": false },
        { "date": [10, 10], "title": ["روز جهانی بهداشت روان", "روز جهانی مبارزه با حکم اعدام"], "is_holiday": false },
        { "date": [10, 11], "title": ["روز جهانی دختر"], "is_holiday": false },
        { "date": [10, 13], "title": ["روز جهانی کاهش بلایا"], "is_holiday": false },
        { "date": [10, 14], "title": ["روز جهانی استاندارد"], "is_holiday": false },
        { "date": [10, 15], "title": ["روز جهانی عصای سفید"], "is_holiday": false },
        { "date": [10, 16], "title": ["روز جهانی غذا"], "is_holiday": false },
        { "date": [10, 17], "title": ["روز جهانی مبارزه با فقر"], "is_holiday": false },
        { "date": [10, 24], "title": ["روز جهانی سازمان ملل", "روز جهانی اخبار"], "is_holiday": false },
        { "date": [10, 27], "title": ["روز جهانی میراث سمعی و بصری"], "is_holiday": false },
        { "date": [11, 2], "title": ["روز جهانی پایان دادن به مصونیت از مجازات برای جنایات علیه خبرنگاران"], "is_holiday": false },
        { "date": [11, 5], "title": ["روز جهانی زبان رومی", "روز جهانی آگاهی از سونامی"], "is_holiday": false },
        { "date": [11, 10], "title": ["روز جهانی علم در خدمت صلح و توسعه پایدار"], "is_holiday": false },
        { "date": [11, 14], "title": ["روز جهانی دیابت", "روز جهانی مبارزه با قاچاق غیرقانونی اموال فرهنگی"], "is_holiday": false },
        { "date": [11, 16], "title": ["روز جهانی مدارا"], "is_holiday": false },
        { "date": [11, 18], "title": ["روز جهانی هنر اسلامی", "روز جهانی فلسفه"], "is_holiday": false },
        { "date": [11, 19], "title": ["روز جهانی آقایان"], "is_holiday": false },
        { "date": [11, 21], "title": ["روز جهانی تلویزیون"], "is_holiday": false },
        { "date": [11, 25], "title": ["روز جهانی مبارزه با خشونت علیه زنان"], "is_holiday": false },
        { "date": [11, 26], "title": ["روز جهانی درخت زیتون"], "is_holiday": false },
        { "date": [11, 29], "title": ["روز جهانی همبستگی با مردم فلسطین"], "is_holiday": false },
        { "date": [12, 1], "title": ["روز جهانی ایدز"], "is_holiday": false },
        { "date": [12, 2], "title": ["روز جهانی آزادی بردگان"], "is_holiday": false },
        { "date": [12, 3], "title": ["روز جهانی افراد دارای معلولیت"], "is_holiday": false },
        { "date": [12, 7], "title": ["روز جهانی هواپیمایی"], "is_holiday": false },
        { "date": [12, 10], "title": ["روز جهانی حقوق بشر"], "is_holiday": false },
        { "date": [12, 11], "title": ["روز جهانی کوه‌نوردی"], "is_holiday": false },
        { "date": [12, 18], "title": ["روز جهانی مهاجرین", "روز جهانی زبان عربی"], "is_holiday": false },
        { "date": [12, 25], "title": ["جشن کریسمس"], "is_holiday": false },
        { "date": [12, 30], "title": ["روز جهانی همبستگی انسانی"], "is_holiday": false }
    ];

    const hijriEvents = [
        { "date": [7, 1], "title": ["روز جهانی بال مرغ"], "is_holiday": false },
        { "date": [7, 3], "title": ["روز جهانی بدون کیسه پلاستیکی"], "is_holiday": false },
        { "date": [7, 6], "title": ["روز جهانی بوسیدن"], "is_holiday": false },
        { "date": [7, 7], "title": ["روز جهانی شکلات"], "is_holiday": false },
        { "date": [7, 13], "title": ["روز جهانی سنگ"], "is_holiday": false },
        { "date": [7, 20], "title": ["روز جهانی پرش"], "is_holiday": false },
        { "date": [7, 28], "title": ["روز جهانی هپاتیت"], "is_holiday": false },
        { "date": [7, 30], "title": ["روز جهانی دوستی"], "is_holiday": false },
        { "date": [8, 4], "title": ["روز جهانی پلنگ ابری"], "is_holiday": false },
        { "date": [8, 12], "title": ["روز جهانی فیل"], "is_holiday": false },
        { "date": [8, 19], "title": ["روز جهانی زنبور عسل"], "is_holiday": false },
        { "date": [8, 20], "title": ["روز جهانی پشه"], "is_holiday": false },
        { "date": [9, 2], "title": ["روز جهانی ریش", "روز جهانی نارگیل"], "is_holiday": false },
        { "date": [9, 9], "title": ["روز جهانی سودوکو"], "is_holiday": false },
        { "date": [9, 13], "title": ["روز جهانی برنامه‌نویسان"], "is_holiday": false },
        { "date": [9, 17], "title": ["روز جهانی موسیقی کانتری"], "is_holiday": false },
        { "date": [9, 21], "title": ["روز جهانی قدردانی"], "is_holiday": false },
        { "date": [9, 23], "title": ["روز جهانی زبان اشاره"], "is_holiday": false },
        { "date": [9, 24], "title": ["روز جهانی بالیوود", "روز جهانی رودخانه‌ها"], "is_holiday": false },
        { "date": [9, 29], "title": ["روز جهانی نجوم"], "is_holiday": false },
        { "date": [9, 30], "title": ["روز جهانی لباس توری"], "is_holiday": false }
    ];

    // Hijri months data table for accurate conversion
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

    const dayCountInMonth = (year: number, month: number): number =>
    {
        month = month - 1;

        if (month < 0)
            return -1;

        if (month < 6)
            return 31;

        if (month < 11)
            return 30;

        const ary = [1, 5, 9, 13, 17, 22, 26, 30];
        const index = year % 33;

        for (let i = 0; i < ary.length; i++)
        {
            if (index === ary[i])
                return 30;
        }

        return 29;
    }

    const getDayEvents = (year: number, month: number, day: number): CalendarEvents =>
    {
        const events: CalendarEvents =
        {
            persianEvents: [],
            hijriEvents: [],
            officialWorldEvents: [],
            unofficialWorldEvents: []
        }

        if (options.persianEvent !== false)
        {
            const pe = persianEvents.find(item => item.date[0] === month && item.date[1] === day);
            if (pe)
                events.persianEvents = pe.title;
        }

        if (options.hijriEvent !== false)
        {
            const hijriDate = jalaliToHijri(year, month, day);
            const he = hijriEvents.find(item => item.date[0] === hijriDate[1] && item.date[1] === hijriDate[2]);
            if (he)
                events.hijriEvents = he.title;
        }

        if (options.officialWorldEvent !== false)
        {
            const gregorianDate = jalaliToGregorian(year, month, day);
            const owe = officialWorldEvents.find(item => item.date[0] === gregorianDate[1] && item.date[1] === gregorianDate[2]);

            if (owe)
                events.officialWorldEvents = owe.title;
        }

        if (options.unofficialWorldEvent !== false)
        {
            const gregorianDate = jalaliToGregorian(year, month, day);
            const uwe = unofficialWorldEvents.find(item => item.date[0] === gregorianDate[1] && item.date[1] === gregorianDate[2]);

            if (uwe)
                events.unofficialWorldEvents = uwe.title;
        }

        return events
    }

    const jalaliToGregorian = (year: number, month: number, day: number): number[] =>
    {
        let gYear = (year <= 979) ? 621 : 1600;
        year -= (year <= 979) ? 0 : 979;

        let days = (365 * year) +
            (Math.floor(year / 33) * 8) +
            Math.floor((Math.floor(year % 33) + 3) / 4) + 78 + day +
            ((month < 7) ? (month - 1) * 31 : ((month - 7) * 30) + 186);

        gYear += 400 * Math.floor(days / 146097);
        days %= 146097;

        if (days > 36524)
        {
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
        const dayCheck = [0, 31, (((gYear % 4 === 0 && gYear % 100 !== 0) || (gYear % 400 === 0)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let gMonth;

        for (gMonth = 0; gMonth < 13; gMonth++)
        {
            const dCount = dayCheck[gMonth];

            if (gDay <= dCount)
                break;

            gDay -= dCount
        }

        return [gYear, gMonth, gDay];
    }

    const hijriToJulianDay = (year: number, month: number, day: number): number =>
    {
        year += 990;
        return (day + Math.floor((29.5 * (month - 1)) + 0.5) + ((year - 1) * 354) + Math.floor((3 + (year * 11)) / 30) + 1597615.5);
    }

    const jalaliToHijri = (year: number, month: number, day: number): number[] =>
    {
        year += 1595;

        const julianDay = 1365392 +
            (365 * year) +
            (Math.floor(year / 33) * 8) +
            Math.floor((Math.floor(year % 33) + 3) / 4) +
            day +
            ((month < 7) ? (month - 1) * 31 : ((month - 7) * 30) + 186) - 0.5;

        let hijriYear = Math.floor(((30 * (julianDay - 1948439.5)) + 10646) / 10631);
        let temp = julianDay - (1948439.5 + ((hijriYear - 1) * 354) + Math.floor((3 + (11 * hijriYear)) / 30));

        hijriYear -= 990;

        // Use lookup table if within range
        if (julianDay >= hijriMonthsDays.start_julian_day && julianDay <= hijriMonthsDays.end_julian_day)
        {
            let hijriDay = Math.floor(julianDay - hijriMonthsDays.start_julian_day + 1);

            for (let y in hijriMonthsDays.days)
            {
                const yearData = hijriMonthsDays.days[y as keyof typeof hijriMonthsDays.days];
                if (hijriDay > yearData[0])
                {
                    hijriDay -= yearData[0];
                }
                else
                {
                    let hijriMonth = 1;
                    while (hijriMonth < 13 && hijriDay > yearData[hijriMonth])
                    {
                        hijriDay -= yearData[hijriMonth];
                        hijriMonth++;
                    }

                    return [parseInt(y), hijriMonth, hijriDay]
                }
            }
        }

        // Fallback calculation
        let hijriMonth = Math.floor(((temp - 29) / 29.5) + 1.99);
        if (hijriMonth > 12) hijriMonth = 12;

        const hijriDay = Math.floor(1 + temp - Math.floor((29.5 * (hijriMonth - 1)) + 0.5));

        return [hijriYear, hijriMonth, hijriDay]
    }

    const dayIndexOfWeek = (year: number, month: number, day: number): number =>
    {
        const date = jalaliToGregorian(year, month, day);
        let gDate = new Date(date[0], date[1] - 1, date[2]).getDay();
        let num = ++gDate;

        if (num === 7)
            num = 0;

        return num;
    }

    const persianMonthName = (month: number): string => persianMonthNames[month - 1];
    const hijriMonthName = (month: number): string => hijriMonthNames[month - 1];
    const gregorianMonthName = (month: number): string => gregorianMonthNames[month - 1];

    const updateTodayDate = () =>
    {
        const todayDate = new Date()
            .toLocaleDateString('fa-IR-u-nu-latn')
            .split('/')
            .map(item => parseInt(item))

        today.value = todayDate;
        todayGregorian.value = jalaliToGregorian(todayDate[0], todayDate[1], todayDate[2]);
        todayHijri.value = jalaliToHijri(todayDate[0], todayDate[1], todayDate[2]);
    }

    const nextMonth = (): number[] =>
    {
        let year = selectedDay.value[0];
        let month = selectedDay.value[1];

        if (month === 12)
        {
            year++;
            month = 1;
        }
        else
        {
            month++;
        }

        selectedDay.value = [year, month, selectedDay.value[2]];
        return selectedDay.value;
    }

    const prevMonth = (): number[] =>
    {
        let year = selectedDay.value[0];
        let month = selectedDay.value[1];

        if (month === 1)
        {
            year--;
            month = 12;
        }
        else
        {
            month--;
        }

        selectedDay.value = [year, month, selectedDay.value[2]];
        return selectedDay.value;
    }

    const nextYear = (): number[] =>
    {
        selectedDay.value[0]++;
        return selectedDay.value;
    }

    const prevYear = (): number[] =>
    {
        selectedDay.value[0]--;
        return selectedDay.value;
    }

    const setYear = (year: number, month?: number) =>
    {
        selectedDay.value[0] = year;
        if (month !== undefined)
            selectedDay.value[1] = month;
    }

    const setMonth = (month: number) =>
    {
        selectedDay.value[1] = month;
    }

    const getDayInfo = (date: number[], isHijri = false, isGregorian = false): string =>
    {
        const dayIndex = dayIndexOfWeek(date[0], date[1], date[2]);
        const monthName = persianMonthName(date[1]);
        const dayName = dayNames[dayIndex];

        let content = dayName + ' ';

        if (isHijri)
        {
            const hijriDate = jalaliToHijri(date[0], date[1], date[2]);
            content += hijriDate[2] + 'ام ' + hijriMonthName(hijriDate[1]) + ' سال ' + hijriDate[0] + ' هجری قمری';
        }
        else if (isGregorian)
        {
            const gregorianDate = jalaliToGregorian(date[0], date[1], date[2]);
            content += gregorianDate[2] + 'ام ' + gregorianMonthName(gregorianDate[1]) + ' سال ' + gregorianDate[0] + ' میلادی';
        }
        else
        {
            content += date[2] + 'ام ' + monthName + ' سال ' + date[0] + ' شمسی';
        }

        return content;
    }

    const getTodayPersianInfo = () => getDayInfo(today.value);
    const getSelectedDayPersianInfo = () => getDayInfo(selectedDay.value);
    const getTodayGregorianInfo = () => getDayInfo(today.value, false, true);
    const getSelectedDayGregorianInfo = () => getDayInfo(selectedDay.value, false, true);
    const getTodayHijriInfo = () => getDayInfo(today.value, true);
    const getSelectedDayHijriInfo = () => getDayInfo(selectedDay.value, true);

    const getTodayEvents = (): CalendarEvents => getDayEvents(today.value[0], today.value[1], today.value[2]);
    const getSelectedDayEvents = (): CalendarEvents => getDayEvents(selectedDay.value[0], selectedDay.value[1], selectedDay.value[2]);

    onMounted(() =>
    {
        updateTodayDate();
        selectedDay.value = [...today.value];

        if (options.updateToday)
        {
            updateInterval = setInterval(updateTodayDate, options.updateTodayTimeout || 5000);
        }
    })

    onUnmounted(() =>
    {
        if (updateInterval !== null)
        {
            clearInterval(updateInterval);
        }
    })

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
    }
}