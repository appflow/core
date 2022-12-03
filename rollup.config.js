import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json';

import pkg from './package.json'

const extensions = [ '.ts' ],
	babelRuntimeVersion = pkg.dependencies[ '@babel/runtime' ].replace(
		/^[^0-9]*/,
		''
	),
	externalName = 'appflow-core',
	input = 'src/index.ts';

export default defineConfig( [

	// CommonJS
	{
		input,
		output: { file: `lib/${externalName}.js`, format: 'cjs', indent: false, exports: 'auto' },
		plugins: [
			json(),
			nodeResolve( {
				extensions
			} ),
			typescript( { useTsconfigDeclarationDir: true } ),
			babel( {
				extensions,
				plugins: [
					[ '@babel/plugin-transform-runtime', { version: babelRuntimeVersion } ],
				],
				babelHelpers: 'runtime'
			} )
		]
	},

	// UMD Development
	{
		input,
		output: {
			file: `dist/${externalName}.js`,
			format: 'umd',
			name: externalName,
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
		input,
		output: {
			file: `dist/${externalName}.min.js`,
			format: 'umd',
			name: externalName,
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

	// ES
	{
		input,
		output: { file: `es/${externalName}.js`, format: 'es', indent: false },
		plugins: [
			json(),
			nodeResolve( {
				extensions
			} ),
			typescript(),
			babel( {
				extensions,
				plugins: [
					[
						'@babel/plugin-transform-runtime',
						{
							version: babelRuntimeVersion,
							useESModules: true
						}
					],
				],
				babelHelpers: 'runtime'
			} )
		]
	},

	// ES for Browsers
	{
		input,
		output: { file: `es/${externalName}.mjs`, format: 'es', indent: false },
		plugins: [
			json(),
			nodeResolve( {
				extensions
			} ),
			replace( {
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify( 'production' )
			} ),
			typescript(),
			babel( {
				extensions,
				exclude: 'node_modules/**',
				skipPreflightCheck: true,
				babelHelpers: 'bundled'
			} ),
			terser( {
				compress: {
					pure_getters: true,
					unsafe: true,
					unsafe_comps: true
				}
			} )
		]
	}, ] );
