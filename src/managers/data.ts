/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Responsible for manging data commands.
 */
import Http from '../clients/http';
import Commands from "./commands";

import { HTTPMethodEnum } from "../enums/http";
import { CommandArgsInterface } from '../interfaces/commands';
import { CommandData } from '../command-bases/';

export class Data extends Commands {
    private static client: Http;

    public currentHttpMethod: HTTPMethodEnum;

    static getName() {
        return 'Flow/Core/Managers/Data';
    }

    constructor() {
        super();

        // @ts-ignore
        Data.client = new Http( $flowConfig.baseURL );
    }

    public getClient() {
        return Data.client;
    }

    public get( command: string, args: CommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = HTTPMethodEnum.GET;

        return super.run( command, args, options );
    }

    public update( command: string, args: CommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = HTTPMethodEnum.PATCH;

        return super.run( command, args, options );
    }

    public delete( command: string, args: CommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = HTTPMethodEnum.DELETE;

        return super.run( command, args, options );
    }

    public create( command: string, args: CommandArgsInterface = {}, options: {} = {} ) {
        this.currentHttpMethod = HTTPMethodEnum.POST;

        return super.run( command, args, options );
    }

    protected async runInstance( command: CommandData, args: CommandArgsInterface = {}, options: {} = {} ) {
        if ( ! this.currentHttpMethod ) {
            throw new Error( 'Cannot run directly' );
        }

        // New args.
        const newArgs = {
            type: this.currentHttpMethod,
            args: {
                query: {},
                data: {},
            },
        };

        if ( HTTPMethodEnum.GET === this.currentHttpMethod ) {
            newArgs.args.query = args;
        } else {
            newArgs.args.data = args;
        }

        args.result = await super.runInstance( command, newArgs, options )

        // Clear method type.
        this.currentHttpMethod = HTTPMethodEnum.__EMPTY__;

        return args.result;
    }
}

export default Data;
