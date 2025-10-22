import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) =>
{
    return {
        provide:
        {
            persianCalendar:
            {
                version: '1.0.0'
            }
        }
    }
})