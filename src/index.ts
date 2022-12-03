import * as commandBases from "./command-bases/";
import * as errors from "./errors/";
import * as managers from "./managers/";
import * as modules from "./modules/";
import * as utils from "./utils/";

import pkg from "../package.json";

import { ObjectBase } from './object-base';
import { Controller } from "./controller";

// @ts-ignore
if ( globalThis?.$flow ) {
    throw new Error( '$flow is already defined' );
}

// API Config.
const config = {
    // @ts-ignore
    ... globalThis?.$flowConfig, // Injecting config to the API.

    version: pkg.version,
}

const API = {
    config,

    commandBases: () => commandBases,
    errors: () => errors,
    managers: () => managers,
    modules: () => modules,
    utils: () => utils,

    ObjectBase,
    Controller,
}

// @ts-ignore
if ( ! globalThis?.$flow ) globalThis.$flow = API;

declare global {
    const $flow: typeof API;
}

export default API;
