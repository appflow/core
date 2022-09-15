/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: CommandInternal, is used when part of the logic needed to be command but not represent a User command.
 */
import CommandPublic from "./command-public";

export class CommandInternal extends CommandPublic {
    static getName() {
        return "Flow/Core/CommandBases/CommandInternal";
    }
}

export default CommandInternal;
