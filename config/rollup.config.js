import { terser } from 'rollup-plugin-terser';

export default {
    input: './dist/es/index.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: './test_tmp/rollup.bundle.js'
    },
    plugins: [
        terser()
    ]
};