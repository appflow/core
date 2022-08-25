import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json';

const extensions = [ '.ts' ];

export default defineConfig( [
	// UMD Development
	{
		input: 'src/index.ts',
		output: {
			file: 'dist/appflow-core.js',
			format: 'umd',
			name: 'core',
			indent: false,
		},
		plugins: [
			json(),
			nodeResolve( {
				extensions
			} ),
			typescript( ),
			babel( {
				extensions,
				exclude: 'node_modules/**',
				babelHelpers: 'bundled'
			} ),
			replace( {
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify( 'development' )
			} )
		]
	},

	// UMD Production
	{
		input: 'src/index.ts',
		output: {
			file: 'dist/appflow-core.min.js',
			format: 'umd',
			name: 'AppFlow-core',
			indent: false,
		},
		plugins: [
			json(),
			nodeResolve( {
				extensions
			} ),
			typescript(),
			babel( {
				extensions,
				exclude: 'node_modules/**',
				skipPreflightCheck: true,
				babelHelpers: 'bundled'
			} ),
			replace( {
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify( 'production' )
			} ),
			terser( {
				compress: {
					pure_getters: true,
					unsafe: true,
					unsafe_comps: true
				}
			} )
		]
	},
] );
