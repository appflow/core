/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 */
import Controller from "../controller";

export class ControllerAlreadyRegistered extends Error {
    constructor( controller: Controller ) {
        super( `Controller: '${ controller.getName() }' is already registered` );
    }
}

export default ControllerAlreadyRegistered;
