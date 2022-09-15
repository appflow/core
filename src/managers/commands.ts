/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Responsible for manging/running/hooking commands.
 */
import { Logger } from "../modules/";

import Controller from "../controller";
import ObjectBase from "../object-base";

import { CommandAlreadyRegistered, CommandNotFound } from "../errors/";
import { CommandArgsInterface, CommandCallbackType, OnHookAffectInterface, OnHookInterface, } from "../interfaces/commands";

import { CommandBase } from "../command-bases";

export class Commands extends ObjectBase {
    public static trace:string[] = [];

    current: { [ key: string ]: CommandBase } = {};
    currentArgs: { [ key: string ]: any } = {};

    trace:string[] = []

    commands: { [ key: string ]: typeof CommandBase } = {};

    onBeforeHooks: OnHookInterface = {};
    onBeforeUIHooks: OnHookInterface = {};

    onAfterHooks: OnHookInterface = {};
    onAfterOnceHooks: OnHookInterface = {};
    onAfterUIHooks: OnHookInterface = {};
    onAfterAffectHooks: OnHookAffectInterface = {};

    private readonly logger: Logger;

    static getName() {
        return "Flow/Core/Managers/Commands";
    }

    private static async runCallbacks( callbacks: Array<Function>, args: CommandArgsInterface = {}, options: any = {} ) {
        const callbacksLength = callbacks?.length || 0;

        for ( let i = 0; i < callbacksLength; ++i ) {
            const callback = options.pop === true ? callbacks.pop() : callbacks[ i ];

            if ( ! callback ) {
                throw new Error( "Callback is not defined." );
            }

            await callback( args, options );
        }
    }

    private static hookCommand( stack: any, hookCommand: string, context: CommandCallbackType | string ) {
        if ( ! stack[ hookCommand ] ) {
            stack[ hookCommand ] = [];
        }

        stack[ hookCommand ].push( context );
    }

    constructor() {
        super();

        this.logger = new Logger( this.getName(), true );

        this.logger.startEmpty();
    }

    public async run( command: string | CommandBase, args: CommandArgsInterface = {}, options: any = {} ) {
        if ( typeof command === "string" ) {
            command = this.getCommandInstance( command, args, options );
        }

        this.attachCurrent( command, args );

        const result = await this.runInstance( command, args, options );

        this.detachCurrent( command );

        return result;
    }

    public register( commands: Array<typeof CommandBase>, controller: Controller ) {// eslint-disable-line @typescript-eslint/no-unused-vars
        const result: typeof CommandBase[] = [];

        Object.values( commands ).forEach( ( command ) => {
            const commandName = command.getName();

            if ( this.commands[ commandName ] ) {
                throw new CommandAlreadyRegistered( command );
            }

            this.commands[ commandName ] = command;

            result.push( command );
        } );

        return result;
    }

    public getAll() {
        return this.commands;
    }

    public getByName( name: string ) {
        return this.commands[ name ];
    }

    public getLogger() {
        return this.logger;
    }

    public getCommandInstance( name: string, args: CommandArgsInterface = {}, options = {} ): CommandBase {
        const CommandClass = this.commands[ name ];

        if ( ! CommandClass ) {
            throw new CommandNotFound( name );
        }

        // @ts-ignore
        return new CommandClass( args, options );
    }

    /**
     * Used to set hooks that effects only data and not UI.
     */
    public onBefore( hookCommand: string, callback: CommandCallbackType ) {
        Commands.hookCommand( this.onBeforeHooks, hookCommand, callback );
    }

    /**
     * Used to set hooks that effects only UI.
     */
    public onBeforeUI( hookCommand: string, callback: CommandCallbackType ) {
        Commands.hookCommand( this.onBeforeUIHooks, hookCommand, callback );
    }

    /**
     * Used to set hooks that effects only data and not UI.
     */
    public onAfter( hookCommand: string, callback: CommandCallbackType ) {
        Commands.hookCommand( this.onAfterHooks, hookCommand, callback );
    }

    /**
     * Used to set hooks that effects only UI.
     */
    public onAfterUI( command: string, callback: CommandCallbackType ) {
        Commands.hookCommand( this.onAfterUIHooks, command, callback );
    }

    /**
     * Used to set hooks that effects only data and not UI.
     */
    public onAfterOnce( command: string, callback: CommandCallbackType ) {
        Commands.hookCommand( this.onAfterOnceHooks, command, callback );
    }

    /**
     * Used to register a trigger that runs command after `hookCommand` run's.
     */
    public onAfterAffect( hookCommand: string, affectCommand: string ) {
        Commands.hookCommand( this.onAfterAffectHooks, hookCommand, affectCommand );
    }

    protected onBeforeRun( command: CommandBase, args: CommandArgsInterface = {}, options = {} ) {
        if ( this.onBeforeHooks[ command.getName() ] ) {
            const callbacks = this.onBeforeHooks[ command.getName() ];
            callbacks.forEach( ( callback ) => callback( args, options ) );
        }

        if ( this.onBeforeUIHooks[ command.getName() ] ) {
            const callbacks = this.onBeforeUIHooks[ command.getName() ];
            callbacks.forEach( ( callback ) => callback( args, options ) );
        }
    }

    protected async runInstance( command: CommandBase, args: CommandArgsInterface = {}, options = {} ) {
        let result: any = null;

        // TODO: Maybe a logger method to handle such cases.
        if ( Object.keys( args ).length ) {
            this.logger.startWith( {
                command: command.getName(),
                options,
                CommandArgs: "->",
            } );

            this.logger.debug( "CommandArgs:" );
            this.logger.object( args );
        } else {
            this.logger.startWith( {
                command: command.getName(),
                options,
                args,
            } );

        }

        this.onBeforeRun( command, args, options );

        result = await command.run();

        await this.onAfterRun( command, args, options, result );

        return result;
    }

    protected async onAfterRun( command: CommandBase, args: CommandArgsInterface, options: {}, result: any ) {
        options = Object.assign( {}, options );
        if ( this.onAfterAffectHooks[ command.getName() ] ) {
            this.onAfterAffectHooks[ command.getName() ].forEach( ( command ) => {
                args.result = result;

                result = this.run( command.toString(), args, options );
            } );

            result = await result;
        }

        if ( this.onAfterHooks ) {
            args.result = result;

            await Commands.runCallbacks(
                Object.assign( [], this.onAfterHooks[ command.getName() ] ),
                args,
                options
            );
        }

        if ( this.onAfterOnceHooks ) {
            await Commands.runCallbacks(
                this.onAfterOnceHooks[ command.getName() ],
                args,
                {
                    ... options,
                    pop: true, // Delete after run.
                }
            );
        }

        if ( this.onAfterUIHooks ) {
            Commands.runCallbacks(
                Object.assign( [], this.onAfterUIHooks[ command.getName() ] ),
                args,
                options
            )
        }

        return result;
    }

    protected attachCurrent( command: CommandBase, args:any = {} ) {
        this.current[ command.getName() ] = command;
        this.currentArgs[ command.getName() ] = args;

        this.trace.push( command.getName() );
        Commands.trace.push( command.getName() );
    }

    protected detachCurrent( command: CommandBase ) {
        delete this.current[ command.getName() ];
        delete this.currentArgs[ command.getName() ];

        Commands.trace.pop();
        this.trace.pop();
    }
}

export default Commands;
