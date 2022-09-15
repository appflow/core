/**
 * Importing auto generated types declarations.
 */
export = $flow;
export as namespace $flow;

declare namespace $flow {
    const commandBases: () => typeof import("../dist/src/command-bases");
    const errors: () => typeof import("../dist/src/errors");
    const managers: () => typeof import("../dist/src/managers");
    const modules: () => typeof import("../dist/src/modules");
    const utils: () => typeof import("../dist/src/utils");

    const ObjectBase: typeof import("../dist/src/object-base").ObjectBase;
    const Controller: typeof import("../dist/src/controller").Controller;
}
