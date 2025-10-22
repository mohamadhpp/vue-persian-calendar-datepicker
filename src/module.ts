import { defineNuxtModule, createResolver, addComponent, addPlugin, addImports } from '@nuxt/kit'

export interface ModuleOptions
{
    persianEvent?: boolean
    hijriEvent?: boolean
    officialWorldEvent?: boolean
    unofficialWorldEvent?: boolean
    updateToday?: boolean
    updateTodayTimeout?: number
    selectable?: boolean
}

export default defineNuxtModule<ModuleOptions>({
    meta:
    {
        name: 'nuxt-persian-calendar',
        configKey: 'persianCalendar',
        compatibility:
        {
            nuxt: '^3.0.0'
        }
    },

    defaults:
    {
        persianEvent: true,
        hijriEvent: true,
        officialWorldEvent: true,
        unofficialWorldEvent: true,
        updateToday: true,
        updateTodayTimeout: 5000,
        selectable: true
    },

    setup(options, nuxt)
    {
        const resolver = createResolver(import.meta.url);

        // Add runtime config
        nuxt.options.runtimeConfig.public.persianCalendar = options;

        // Auto-import composable
        addImports({
            name: 'usePersianCalendar',
            as: 'usePersianCalendar',
            from: resolver.resolve('./runtime/composables/usePersianCalendar')
        });

        // Register components
        addComponent({
            name: 'PersianCalendar',
            filePath: resolver.resolve('./runtime/components/PersianCalendar.vue')
        });

        addComponent({
            name: 'PersianDatePicker',
            filePath: resolver.resolve('./runtime/components/PersianDatePicker.vue')
        });

        // Add plugin
        addPlugin(resolver.resolve('./runtime/plugin'));
    }
})