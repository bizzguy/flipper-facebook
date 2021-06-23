// platform internal
import React from 'react';
import adb from 'adbkit';

// Legacy UI
import { Heading, FlipperDevicePlugin, FlexColumn, styled, colors, Text, Device, AndroidDevice } from 'flipper';

// Sandy UI
import {Button} from 'antd';

import {
    PluginClient,
    Panel,
    theme,
    DetailSidebar,
    DataTable,
    DataTableColumn,
    Toolbar,
    DevicePluginClient,
    createState,
    Layout,
    usePlugin,
    useValue,
  } from 'flipper-plugin';

// plugin
import { 
    AdbBridge, ClearDataCommand, RestartCommand, KillCommand, ClearDataAndRestartCommand, 
    UninstallCommand,
    TalkbackOnCommand,
    TalkbackOffCommand,
 } from './command/AllCommands'
import { NameForm } from './NameForm'

type ShellCallBack = (output: string) => any;

type State = {
    // applicationId: string;
    inputText: string;
};

const PACKAGE_NAME = 'com.facebook.flipper.sample'//change for your package name

const Container = styled(FlexColumn)({
    alignItems: 'center',
    justifyContent: 'space-around',
    //border: '3px red solid',
    margin: 130,
    boxShadow: '0 6px 10px rgba(0,0,0,.08), 0 0 6px rgba(0,0,0,.05)',
    background: '#fff',
    borderRadius: '4px',
    transition: '.3s transform cubic-bezier(.155,1.105,.295,1.12),.3s box-shadow,.3s -webkit-transform cubic-bezier(.155,1.105,.295,1.12)',
    padding: '14px 80px 18px 36px'
});

const MyView = styled.div({
    fontSize: 22,
    color: colors.green
});

const Status = styled(Text)({
    fontSize: 14,
    fontFamily: 'monospace',
    padding: '10px 5px',
    userSelect: 'auto',
    WebkitUserSelect: 'auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});

export function devicePlugin(client: DevicePluginClient) {

    const device = client.device;

    const executeShell = (callback: ShellCallBack, command: string) => {
        return (device.realDevice as any).adb
            .shell(device.serial, command)
            .then(adb.util.readAll)
            .then(function (output: { toString: () => { trim: () => string } }) {
                return callback(output.toString().trim());
            });
    };

    const executeShell2 = async (command: string) => {
        return new Promise<string>((resolve, reject) => {
          (device.realDevice as any).adb
            .shell(device.serial, command)
            .then(adb.util.readAll)
            .then(function (output: {toString: () => {trim: () => string}}) {
              resolve(output.toString().trim());
            })
            .catch((e: unknown) => reject(e));
        });
      };

    const adbBridge = new AdbBridge(executeShell);

    const restartApp = () => {
        new RestartCommand(adbBridge, PACKAGE_NAME).execute();
    }

    const killApp = () => {
        new KillCommand(adbBridge, PACKAGE_NAME).execute();
    }

    const talkbackOn = () => {
        new TalkbackOnCommand(adbBridge, PACKAGE_NAME).execute();
    }

    const talkbackOff = () => {
        new TalkbackOffCommand(adbBridge, PACKAGE_NAME).execute();
    }

    return {
        restartApp,
        killApp,
        talkbackOn,
        talkbackOff
      };

}

export function Component() {
    const instance = usePlugin(devicePlugin);

    const {
        restartApp,
        killApp,
        talkbackOn,
        talkbackOff,
      } = instance;
  
    return (
        <Layout.Container gap center>
            <Heading level={1}>Foot Locker ADB Flipper Plugin</Heading>
            <Button style={{width: 200}} onClick={restartApp}>Restart app</Button>
            <Button style={{width: 200}} onClick={killApp}>Kill app</Button>
            <Button style={{width: 200}} onClick={talkbackOn}>TalkBack On</Button>
            <Button style={{width: 200}} onClick={talkbackOff}>TalkBack Off</Button>
        </Layout.Container >
    );
  }


export default class Example extends FlipperDevicePlugin<State, any, any> {

    constructor(props: any) {
        super(props)

        this.state = {inputText: ''};
        // this.props.setPersistedState();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    init() {
    }

    static defaultPersistedState = { applicationId: PACKAGE_NAME };

    handleChange(event: any) {
        console.log('hadleChange called ' + event)
        this.setState({ inputText: event.target.value });
    }

    handleSubmit(event: any) {
        console.log('hadleSubmit called ' + event)
        this.props.setPersistedState({applicationId: this.state.inputText})
        event.preventDefault();
    }

    //this will probably go to the AdbBridge in future
    executeShell = (callback: ShellCallBack, command: string) => {
        return (this.device as AndroidDevice).adb
            .shell(this.device.serial, command)
            .then(adb.util.readAll)
            .then(function (output: { toString: () => { trim: () => string } }) {
                return callback(output.toString().trim());
            });
    };

    adbBridge = new AdbBridge(this.executeShell);

    restartApp = () => {
        new RestartCommand(this.adbBridge, this.props.persistedState.applicationId).execute();
    }

    clearData = () => {
        new ClearDataCommand(this.adbBridge, this.props.persistedState.applicationId).execute();
    }

    clearDataAndRestart = () => {
        new ClearDataAndRestartCommand(this.adbBridge, this.props.persistedState.applicationId).execute();
    }

    killApp = () => {
        new KillCommand(this.adbBridge, this.props.persistedState.applicationId).execute();
    }

    uninstallApp = () => {
        new UninstallCommand(this.adbBridge, this.props.persistedState.applicationId).execute();
    }

    talkbackOn = () => {
        new TalkbackOnCommand(this.adbBridge, this.props.persistedState.applicationId).execute();
    }

    talkbackOff = () => {
        new TalkbackOffCommand(this.adbBridge, this.props.persistedState.applicationId).execute();
    }

    revokePermissions = () => {
        console.log('revoke permissions')
    }


    render() {
        return (
            <Container>
                <Heading level={1}>Meet ADB Flipper</Heading>
                <NameForm value={this.state.inputText} handleChange={this.handleChange} handleSubmit={this.handleSubmit}/>
                <MyView>
                    <Text>{`AppId: ${this.props.persistedState.applicationId}`}</Text>
                </MyView>
                <Button style={{width: 200}}  onClick={this.restartApp.bind(this)}>Restart app</Button>
                <Button style={{width: 200}} onClick={this.clearData.bind(this)}>Clear App Data</Button>
                <Button style={{width: 200}}  onClick={this.clearDataAndRestart.bind(this)}>Clear App Data and Restart</Button>
                <Button style={{width: 200}}  onClick={this.uninstallApp.bind(this)}>Uninstall app</Button> 
                <Button style={{width: 200}}  onClick={this.killApp.bind(this)}>Kill app</Button>
                <Button style={{width: 200}}  onClick={this.talkbackOn.bind(this)}>TalkBack On</Button>
                <Button style={{width: 200}}  onClick={this.talkbackOff.bind(this)}>TalkBack Off</Button>
                {/* <Button style={{width: 200}} onClick={this.revokePermissions.bind(this)}>Revoke permissions</Button> */}
                <Status>This plugin is open source. All contributions are welcome. <a href='https://github.com/maxim-pandra/adb-flipper-plugin' target="_blank">https://github.com/maxim-pandra/adb-flipper-plugin</a></Status>
            </Container >
        );
    }    
}
