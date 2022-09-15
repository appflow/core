/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: CommandPublic, is used everytime the act should represent a user action.
 * */
import CommandBase from "./command-base";

export class CommandPublic extends CommandBase {
    static getName() {
        return "Flow/Core/CommandBases/CommandPublic";
    }
}

export default CommandPublic;
