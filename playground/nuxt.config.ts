export default defineNuxtConfig(
{
    modules: ['../src/module'],

    persianCalendar:
    {
        persianEvent: true,
        hijriEvent: true,
        officialWorldEvent: true,
        unofficialWorldEvent: true,
        updateToday: true,
        updateTodayTimeout: 5000,
        selectable: true
    },

    devtools:
    {
        enabled: true
    }
})