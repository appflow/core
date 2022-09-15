/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Base for all commands, that can be managed by any commands' manager.
 */
import ObjectBase from "../object-base";
import ForceMethod from "../errors/force-method";
import Logger from "../modules/logger";
import { CommandArgsInterface } from "../interfaces/commands";

export abstract class CommandBase extends ObjectBase {
    static logger: Logger;
    protected args: CommandArgsInterface = {};
    protected options = {};
    private logger: Logger;

    constructor( args: CommandArgsInterface = {}, options = {} ) {
        super();

        if ( ! CommandBase.logger ) {
            CommandBase.logger = new Logger(
                ( this.constructor as typeof CommandBase ).getName(), true, {
                    sameColor: true,
                } );
        }

        this.logger = CommandBase.logger;
        this.logger.startWith( { args, options } );

        this.initialize( args, options );
    }

    initialize( args: CommandArgsInterface, options = {} ) {
        this.args = args;
        this.options = options;
    }

    apply( args = this.args, options = this.options ): any {// eslint-disable-line @typescript-eslint/no-unused-vars
        throw new ForceMethod( this, "apply" );
    }

    run() {
        return this.apply( this.args, this.options );
    }

    getArgs() {
        return this.args;
    }

    getOptions() {
        return this.options;
    }
}

export default CommandBase;
