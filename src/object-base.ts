/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: is base class/object for all instances, responsible for: 'getName', implementation.
 */
import { ForceMethodBase } from "./errors/force-method";
import { ObjectBaseInterface } from "./interfaces/object-base";

let IdCounter = 0;

/**
 * Base class 4*
 */
export abstract class ObjectBase implements ObjectBaseInterface {
    public virtualId: number = 0;

    static getName(): string {
        throw new ForceMethodBase( "Flow/Core", "getName" );
    }

    constructor() {
        this.virtualId = IdCounter;

        APIIncreaseIdCounter();
    }

    getName(): string {
        return ( this.constructor as typeof ObjectBase ).getName();
    }
}

export function APIResetIdCounter() {
    IdCounter = 0;

    return 0;
}

export function APIIncreaseIdCounter(): number {
    return IdCounter++;
}

export function APIGetIdCounter(): number {
    return IdCounter;
}

export default ObjectBase;
