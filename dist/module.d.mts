import * as _nuxt_schema from '@nuxt/schema';

interface ModuleOptions {
    persianEvent?: boolean;
    hijriEvent?: boolean;
    officialWorldEvent?: boolean;
    unofficialWorldEvent?: boolean;
    updateToday?: boolean;
    updateTodayTimeout?: number;
    selectable?: boolean;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ModuleOptions };
