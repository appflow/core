/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Module for logging instances.
 * @TODO: Remove `@ts-ignore`
 */
import { CommandArgsInterface } from "../interfaces/commands";
import { hexColorDelta, getCircularReplacer } from "../utils";

// TODO: Should by dynamic/configure-able.
const MAX_WRAPPING_RECURSIVE_DEPTH = 4;

export class Logger {
    static wrappers = {};
    static wrapperDepth = 0;
    static sharedData: { [ key: string ]: string } = {};
    static colorsInUse: string[] = [];

    public defaultStyle: string[];

    private color: string;

    private outputHandler: Function;

    private args: CommandArgsInterface = {};

    private readonly name: string;

    private readonly state: boolean = false;

    static getName() {
        return "Modules/Logger";
    }

    /**
     * Function reset() : Reset logger globals.
     */
    public static reset() {
        Logger.wrappers = {};
        Logger.wrapperDepth = 0;
        Logger.colorsInUse = [];
        Logger.sharedData = {};
    }

    /**
     * Function createCustomWrapper() : Creates custom wrapper for log entities.
     */
    public static createCustomWrapper( classType: any, callback: Function ) {
        // @ts-ignore
        if ( ! Logger.wrappers[ classType ] ) {
            // @ts-ignore
            Logger.wrappers[ classType.name ] = [];
        }
        // @ts-ignore
        Logger.wrappers[ classType.name ].push( { classType, callback } );

    }

    /**
     * Function getCallerName() : Return caller name.
     */
    private static getCallerName() {
        const error = new Error(),
            caller = error.stack ? error.stack.split( "\n" )[ 3 ].trim() : '_UNKNOWN_CALLER_NAME_'

        if ( caller.startsWith( "at new" ) ) {
            return "constructor";
        }

        return caller.split( "." )[ 1 ].split( " " )[ 0 ];
    }

    /**
     * Function functionView() : Return function preview.
     */
    private static getFunctionView( fn: string | Function ): ( string | Function ) {
        let fReturn = "anonymous function()";

        // TODO: Check if works.
        if ( typeof fn !== "string" && fn.name.length !== 0 ) {
            fReturn = fn.name.split( " " )[ 1 ] + "()";
        }

        return fReturn;
    }

    /**
     * Function constructor() : Create logger class.
     */
    constructor( owner: any, isActive = false, args = {} ) {
        if ( 'off' === globalThis.process?.env[ 'flow_modules_logger' ] ) {
            return;
        }

        this.state = isActive;
        this.args = args;
        this.name = "";

        if ( typeof owner == "string" ) {
            this.name = owner;
        } else {
            this.name = owner.constructor.name;
        }

        if ( isActive ) {
            this.initialize();
        }
    }

    /**
     * Function initialize() : Initialize logger class.
     */
    initialize() {
        if ( this.args.sameColor ) {
            if ( ! Logger.sharedData[ this.name ] ) {
                Logger.sharedData[ this.name ] = this.getRandomColor();
            }

            this.color = Logger.sharedData[ this.name ];
        } else {
            this.color = this.getRandomColor();

            Logger.colorsInUse.push( this.color );
        }

        this.outputHandler = console.log

        this.defaultStyle = [
            "color: grey;font-size:7px",
            "display: block",
            `color: ${ this.color }`,
            "color: black",
            "font-weight: bold",
            "color: black",
            "font-size: 16px;color: red;font-weight:800",
        ];
    }

    /**
     * Function setOutputHandler() : Set custom output handler.
     */
    setOutputHandler( outputHandler: Function ) {
        this.outputHandler = outputHandler;
    }

    /**
     * Function useWrapper() : Search for customized log view, each instance,
     * that typeof the instance was registered wrapper will have unique output
     * according to the registered callback.
     */
    useWrapper( obj: any, shouldHandleChildren = true ) {
        if ( ! obj || 'object' !== typeof obj || Array.isArray( obj ) ) {
            return obj;
        }

        Logger.wrapperDepth++;

        // Result will lose classType (instanceOf will not work), now based on obj.
        let result = { ... obj };

        // @ts-ignore
        Object.values( Logger.wrappers ).forEach( ( [ wrapper ] ) => {
            if ( obj instanceof wrapper.classType ) {
                result = wrapper.callback( obj ) || result;
            }
        } );

        if ( Logger.wrapperDepth >= MAX_WRAPPING_RECURSIVE_DEPTH ) {
            Logger.wrapperDepth--;
            return result;
        }

        if ( shouldHandleChildren && result ) {
            Object.entries( result ).forEach( ( [ key, value ] ) => {
                result[ key ] = this.useWrapper( value, true )
            } );
        }

        Logger.wrapperDepth--;

        return result;
    }

    /**
     * Function startEmpty() : Notify function start without args.
     *
     * @param {string} output
     */
    startEmpty( output = "" ) {
        if ( ! this.state ) return;

        this.printFunctionNotify( "se", Logger.getCallerName(), output );
    }

    /**
     * Function startWith() : Notify function start with args.
     *
     * TODO: Rename to startsWith
     */
    startWith( params: any ) {
        if ( ! this.state ) return;

        params = Object.assign( {}, params );

        const type = "se";
        const source = Logger.getCallerName();

        if ( typeof params == "string" ) {
            this.printInLineString( type, source, params );
        } else if ( Object.keys( params ).length === 1 ) {
            const key = Object.keys( params )[ 0 ];
            let value = Object.values( params )[ 0 ];

            // TODO: Check is repeated logic, handle it.
            if ( typeof value === "object" ) {
                this.printNextLineObject( type, source, key, value || {} );
            } else if ( typeof value == "function" ) {
                this.printInLineFunction( type, source, key, value );
            } else {
                this.printInLineElement( type, source, key, value );
            }
        } else {
            this.printMultiLineObject( type, source, params );
        }
    }

    /**
     * Function object() : Prints object.
     **/
    object( params: { [ key: string ]: Object } = {}, notice = "" ) {
        if ( ! this.state ) return;

        const source = Logger.getCallerName();

        params = Object.create( params );

        for ( let key in params ) {
            if ( typeof params[ key ] === "object" ) {
                params[ key ] = JSON.stringify( this.useWrapper( params[ key ] ), getCircularReplacer() );
            }

            this.out.apply(
                this,
                [
                    `%c(ob)-> %c%c${ this.name }%c::%c${ source }%c() [${ notice }] ->> ${ key }: '${ params[ key ] }'%c`,
                ].concat( this.defaultStyle )
            );
        }
    }

    /**
     * Function debug() : Notify debug.
     */
    debug( output: string ) {
        if ( ! this.state ) return;

        this.printFunctionNotify( "db", Logger.getCallerName(), output );
    }

    /**
     * Function drop : Preview as continue of log which drop ite.
     */
    drop( according: any, data: any ) {
        if ( ! this.state ) return;

        const source = Logger.getCallerName();

        for ( let key in according ) {
            this.out.apply( this, [ `%c(dr)-> %c%c${ this.name }%c::%c${ source }%c() ->> corresponding ${ key }: '${ according[ key ] }' RESULT: %c↓` ].concat( this.defaultStyle ) );
        }

        this.out( data );
    }

    /**
     * Function throw() : Throws logged error.
     */
    throw( output: string, name: string = 'null', params = {} ) {
        this.printFunctionNotify( "tw", Logger.getCallerName(), output );

        if ( params )
            this.printNextLineObject( "tw", Logger.getCallerName(), name, params );

        throw new Error().stack;
    }

    /**
     * Function clone() : Create clone instance.
     */
    clone() {
        return Object.assign( Object.create( Object.getPrototypeOf( this ) ), this );
    }

    /**
     * Function printFunctionNotify() : Print simple log for notify source (function).
     *
     */
    private printFunctionNotify( type: string, source: string, output: any ) {
        this.out.apply(
            this,
            [ `%c(${ type })-> %c%c${ this.name }%c::%c${ source }%c() ${ output }%c` ].concat(
                this.defaultStyle
            )
        );
    }

    /**
     * Function printInLineElement() : Print in line element.
     */
    private printInLineElement( type: string, source: string, key: string, value: any ) {
        this.out.apply(
            this,
            [
                `%c(${ type })-> %c%c${ this.name }%c::%c${ source }%c() ->> ${ key }: '${ value }'%c`,
            ].concat( this.defaultStyle )
        );
    }

    /**
     * Function printInLineFunction() : Print in line function.
     */
    private printInLineFunction( type: string, source: string, key: string, fn: string | Function ) {
        fn = Logger.getFunctionView( fn );

        this.printInLineElement( type, source, key, fn );
    }

    /**
     * Function printInLineString() : Print in line string.
     */
    private printInLineString( type: string, source: string, string: string ) {
        this.printInLineElement( type, source, "(string)", string );
    }

    /**
     * Function printNextLineObject() : Print object in next line.
     */
    private printNextLineObject( type: string, source: string, key: string, obj: Object ) {
        obj = this.useWrapper( obj );

        this.out.apply(
            this,
            [
                `%c(${ type })-> %c%c${ this.name }%c::%c${ source }%c() ->> ${ key } %c↓`,
            ].concat( this.defaultStyle )
        );
        // print in next line
        this.out( obj );
    }

    /**
     * Function printMultiLineObject() : Print object in multiline format.
     */
    private printMultiLineObject( type: string, source: string, obj: { [ key: string ]: string | Function } ) {
        this.out.apply(
            this,
            [
                `%c(${ type })-> %c%c${ this.name }%c::%c${ source }%c(${ Object.keys(
                    obj
                ).join( ", " ) }) %c↓`,
            ].concat( this.defaultStyle )
        );

        for ( let key in obj ) {
            let value = obj[ key ];

            if ( typeof value === "object" ) {
                value = JSON.stringify( this.useWrapper( value ), getCircularReplacer() );
            } else if ( typeof obj[ key ] == "function" ) {
                value = Logger.getFunctionView( value );
            }

            this.out.apply( this, [
                "%c" + key + ": `" + this.useWrapper( value ) + "`",
                "color: #a3a3a3",
            ] );
        }
    }

    /**
     * Function getRandomColor() : Return random color.
     */
    private getRandomColor(): string {
        const letters = "0123456789ABCDEF";
        let color = "#";

        for ( let i = 0; i < 6; i++ ) {
            color += letters[ Math.floor( Math.random() * 16 ) ];
        }

        let similar = Logger.colorsInUse.some( ( value ) => {
            // it returns the ratio of difference... closer to 1.0 is less difference.
            return hexColorDelta( color, value ) >= 0.8;
        } );

        // if the color is similar, try again.
        if ( similar ) {
            return this.getRandomColor();
        }

        return color;
    }

    /**
     * Function out() : Print console log with style
     */
    private out( ... args: any ) {
        this.outputHandler.apply( this, args );
    }
}

export default Logger;
