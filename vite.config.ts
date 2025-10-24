import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(
{
    plugins:
    [
        vue(),
        cssInjectedByJsPlugin(),
        dts(
        {
            insertTypesEntry: true,
            include: ['src/**/*'],
            exclude: ['src/**/*.test.*', 'src/**/*.spec.*'],
        })
    ],
    build:
    {
        lib:
        {
            entry:
            {
                index: resolve(__dirname, 'src/index.ts'),
                components: resolve(__dirname, 'src/components/index.ts'),
                composables: resolve(__dirname, 'src/composables/index.ts'),
            },
            formats: ['es', 'cjs'],
            fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`
        },
        rollupOptions:
        {
            external: ['vue'],
            output:
            {
                exports: 'named',
                globals:
                {
                    vue: 'Vue'
                }
            }
        }
    }
})