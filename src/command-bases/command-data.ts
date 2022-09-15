/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Each data command should represent a final REST endpoint.
 */
import { ForceMethod } from '../errors/force-method';
import { CommandPublic } from './command-public';

import * as managers from '../managers/';

export abstract class CommandData extends CommandPublic {

    static getName() {
        return 'Flow/Core/CommandBases/CommandData';
    }

    /**
     * @description: Override this method is required to determine endpoint and magic query params.
     * eg:
     * args = { query: { id: 1 }  };
     * getEndpoint() = '/api/v1/users/{id}';
     * result = '/api/v1/users/1';
     */
    getEndpoint(): string {
        throw new ForceMethod( this, 'getEndpoint' );
    }

    apply( args = this.args, options = this.options ) {// eslint-disable-line @typescript-eslint/no-unused-vars
        const endpoint = this.applyEndpointFormat( this.getEndpoint(), args );

        return managers.data.getClient().fetch( endpoint, managers.data.currentHttpMethod, args || null );
    }

    private applyEndpointFormat( endpoint: string, data: any = {} ): string {
        // Replace query with `magic` placeholders.
        if ( endpoint.includes( '{' ) ) {
            endpoint = endpoint.split( '/' ).map( ( endpointPart ) => {
                const match = endpointPart.match( '\\{(.*?)\\}' );

                if ( match?.length ) {
                    if ( undefined !== typeof data[ match[ 1 ] ] ) {
                        return data[ match[ 1 ] ];
                    }
                }
                return endpointPart;
            } ).join( '/' );
        }

        return endpoint;
    }
}

export default CommandData;
