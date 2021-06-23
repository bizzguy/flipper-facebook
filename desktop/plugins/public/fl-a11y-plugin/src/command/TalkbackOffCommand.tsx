import {AdbBridge} from './AdbBridge'
import {Command} from './Command'

const COMMAND = `am force-stop com.google.android.marvin.talkback`;

export class TalkbackOffCommand implements Command {

    private adbBridge: AdbBridge;

    constructor(receiver: AdbBridge) {
        this.adbBridge = receiver;
    }

    public execute(): void {
        console.log(`TalkbackOffCommand: adb invoker should stop TalkBack`);
        this.adbBridge.callAdb(COMMAND);
    }
}