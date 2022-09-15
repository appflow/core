/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Providing a simple wrapper for fetch API.
 */
import ObjectBase from "../object-base";
import { Logger } from '../modules/logger';
import { HTTPMethodEnum } from "../enums/http";

export class Http extends ObjectBase {
    private readonly logger: Logger;

    private readonly apiBaseUrl: string;

    static getName() {
        return 'Flow/Core/Clients/Http';
    }

    /**
     * Function constructor() : Create the http.
     */
    constructor( apiBaseUrl = 'http://localhost' ) {
        super();

        this.logger = new Logger( Http.getName(), true );

        this.logger.startWith( { apiBaseUrl } );

        this.apiBaseUrl = apiBaseUrl + '/';
    }

    getLogger() {
        return this.logger;
    }

    /**
     * Function fetch() : Fetch api.
     */
    async fetch( path: string, method: HTTPMethodEnum, body: {} | null = null ) {
        this.logger.startWith( { path, method, body } );

        const params: RequestInit = { 'credentials': 'include' }, // Support cookies.
            headers = {};

        if ( [
            HTTPMethodEnum.POST,
            HTTPMethodEnum.PUT,
            HTTPMethodEnum.PATCH,
        ].includes( method ) ) {
            Object.assign( headers, { 'Content-Type': 'application/json' } );
            Object.assign( params, {
                method,
                headers: headers,
                body: JSON.stringify( body )
            } );

        } else {
            Object.assign( params, { headers } );
        }

        const response = await globalThis.fetch( this.apiBaseUrl + path, params );

        let data = undefined;

        try {
            data = await response.json();
        } catch ( e ) {
            console.error( e );

            return false;
        }

        // TODO: This is part should be modular and not hard coded.
        if ( data.error && data.global && data.message ) {
            throw new Error( data.message );
        }

        this.logger.drop( { path }, data );

        return data;
    }
}

export default Http;
