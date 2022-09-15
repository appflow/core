/** @type {import('jest').Config} */
const config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRegex: '(/test/.*\\.spec\\.ts)$',
	coverageProvider: 'v8',
	globals: {
		'ts-jest': {
			tsconfig: './test/tsconfig.json'
		},
		'$flowConfig': true,
	},
	transform: {
		'^.+\\.(ts|tsx)?$': 'ts-jest',
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	setupFilesAfterEnv: ["<rootDir>/test/setup.ts"]
}

module.exports = config;

