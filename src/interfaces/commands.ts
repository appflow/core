export type CommandCallbackType = ( args: Object, options: Object ) => any;

export interface CommandArgsInterface {
    [ key: string ]: any;
}

export interface OnHookAffectInterface {
    [ key: string ]: Array<String>;
}

export interface OnHookInterface {
    [ key: string ]: Array<CommandCallbackType>;
}
