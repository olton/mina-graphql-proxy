import babel from 'rollup-plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
    input: 'src/index.js',
    output: {
        file: "bin/proxy.js",
        format: "cjs",
        inlineDynamicImports: true
    },
    plugins: [
        babel(),
        nodeResolve(),
        commonjs({
            namedExports: {
                'valid-url': [ 'isWebUri' ]
            },
        }),
        json()
    ]
};