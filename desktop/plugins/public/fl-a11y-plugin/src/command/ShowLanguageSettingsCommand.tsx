import {AdbBridge} from './AdbBridge'
import {Command} from './Command'

const COMMAND = `am start -a android.settings.LOCALE_SETTINGS`;

export class ShowLanguageSettingsCommand implements Command {

    private adbBridge: AdbBridge;

    constructor(receiver: AdbBridge) {
        this.adbBridge = receiver;
    }

    public execute(): void {
        console.log(`ShowLanguageSettingsCommand: `);
        this.adbBridge.callAdb(COMMAND);
    }
}