import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'typescript';
import typescriptPlugin from 'rollup-plugin-typescript';
import pkg from './package.json';

export default [
	{
		entry: 'src/main.ts',
		external: ['redux'],
		targets: [
			{ dest: pkg.main, format: 'cjs' },
			{ dest: pkg.module, format: 'es' }
		],
		plugins: [
			resolve(),
			commonjs(),
			typescriptPlugin({ typescript: typescript })
		]
	}
];