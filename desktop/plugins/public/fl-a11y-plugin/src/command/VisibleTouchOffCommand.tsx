import {AdbBridge} from './AdbBridge'
import {Command} from './Command'

const COMMAND = `content insert --uri content://settings/system --bind name:s:show_touches --bind value:i:0`;

export class VisibleTouchOffCommand implements Command {

    private adbBridge: AdbBridge;

    constructor(receiver: AdbBridge) {
        this.adbBridge = receiver;
    }

    public execute(): void {
        console.log(`VisibleTouchOnCommand`);
        this.adbBridge.callAdb(COMMAND);
    }
}