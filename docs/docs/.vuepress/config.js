import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
    lang: 'en-US',

    title: 'Vue Persian Calendar Datepicker',
    description: 'Persian calendar with Iran\'s official holidays and Iranian calendar events and Islamic and world events. And also support for Hijri and Gregorian dates in Vue',

    head:
    [
        [
            'link',
            { rel: 'icon', href: 'logo.svg' }
        ]
    ],

    theme: defaultTheme({
        logo: 'logo.svg',

        navbar: ['/', '/Introduction'],
    }),

    bundler: viteBundler(),
});