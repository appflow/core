/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Responsible for manging controllers, each controller is global singleton instance.
 */
import { ControllerAlreadyRegistered } from "../errors/controller-already-registered";

import ObjectBase from "../object-base";
import Controller from "../controller";

export class Controllers extends ObjectBase {
    controllers: { [ key: string ]: Controller } = {};

    static getName() {
        return "Flow/Core/Managers/Controllers";
    }

    get( name: string ) {
        return this.controllers[ name ];
    }

    register( controller: Controller ) {
        if ( this.controllers[ controller.getName() ] ) {
            throw new ControllerAlreadyRegistered( controller );
        }

        // Register.
        this.controllers[ controller.getName() ] = controller;

        return controller;
    }
}

export default Controllers;
