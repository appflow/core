/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 */
import ObjectBase from "../object-base";

export class ForceMethodBase extends Error {
    constructor( className: string, methodName: string ) {
        super(
            `ForeMethod implementation: at '${ className }' method: '${ methodName }'`
        );
    }
}

export class ForceMethod extends Error {
    constructor( context: ObjectBase | typeof ObjectBase, methodName: string ) {
        super(
            `ForeMethod implementation: at '${ context.getName() }' method: '${ methodName }'`
        );
    }
}

export default ForceMethod;
