import { defineNuxtModule, createResolver, addImports, addComponent, addPlugin } from '@nuxt/kit';

const module = defineNuxtModule({
  meta: {
    name: "nuxt-persian-calendar",
    configKey: "persianCalendar",
    compatibility: {
      nuxt: "^3.0.0"
    }
  },
  defaults: {
    persianEvent: true,
    hijriEvent: true,
    officialWorldEvent: true,
    unofficialWorldEvent: true,
    updateToday: true,
    updateTodayTimeout: 5e3,
    selectable: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.persianCalendar = options;
    addImports({
      name: "usePersianCalendar",
      as: "usePersianCalendar",
      from: resolver.resolve("./runtime/composables/usePersianCalendar")
    });
    addComponent({
      name: "PersianCalendar",
      filePath: resolver.resolve("./runtime/components/PersianCalendar.vue")
    });
    addComponent({
      name: "PersianDatePicker",
      filePath: resolver.resolve("./runtime/components/PersianDatePicker.vue")
    });
    addPlugin(resolver.resolve("./runtime/plugin"));
  }
});

export { module as default };
