import {AdbBridge} from './AdbBridge'
import {Command} from './Command'

const COMMAND = `settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService`;

export class TalkbackOnCommand implements Command {

    private adbBridge: AdbBridge;

    constructor(receiver: AdbBridge) {
        this.adbBridge = receiver;
    }

    public execute(): void {
        console.log(`TalkbackOnCommand: adb invoker should start TalkBack`);
        this.adbBridge.callAdb(COMMAND);
    }
}