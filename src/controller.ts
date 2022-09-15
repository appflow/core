/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Controller is part of MVC concept, responsible for actions.
 */

import { CommandData, CommandInternal, CommandPublic } from "./command-bases";
import ObjectBase from "./object-base";

import * as managers from "./managers";

export class Controller extends ObjectBase {
    commands: {} = {};
    data: {} = {};
    internal: {} = {};

    static getName() {
        return "Flow/Core/Controller";
    }

    constructor() {
        super();

        this.initialize();
    }

    initialize() {
        this.register();
        this.setupHooks();
    }

    setupHooks() {
    }

    register() {
        const commands = Object.values( this.getCommands() ),
            data = Object.values( this.getData() ),
            internal = Object.values( this.getInternal() );

        this.commands = managers.commands.register( commands, this );
        this.data = managers.data.register( data, this );
        this.internal = managers.internal.register( internal, this );
    }

    getCommands(): { [ key: string ]: typeof CommandPublic|any } {
        return {};
    }

    getData(): { [ key: string ]: typeof CommandData|any } {
        return {};
    }

    getInternal(): { [ key: string ]: typeof CommandInternal|any } {
        return {};
    }
}

export default Controller;
