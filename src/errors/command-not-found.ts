/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 */
export class CommandNotFound extends Error {
    constructor( command: string ) {
        super( `Command: '${ command }' is not found` );
    }
}

export default CommandNotFound;
