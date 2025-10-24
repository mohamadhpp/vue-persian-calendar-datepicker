import { defineBuildConfig } from 'unbuild';
import vue from '@vitejs/plugin-vue';

export default defineBuildConfig(
{
    entries:
    [
        {
            input: 'src/index',
            name: 'index',
        },
        {
            input: 'src/components/index',
            name: 'components/index',
        },
        {
            input: 'src/composables/index',
            name: 'composables/index',
        },
    ],
    declaration: true,
    clean: true,
    rollup:
    {
        emitCJS: true,
        dts:
        {
            respectExternal: true,
        },
        external: ['vue'],
    },
    externals: ['vue'],
    plugins: [vue()],
})
