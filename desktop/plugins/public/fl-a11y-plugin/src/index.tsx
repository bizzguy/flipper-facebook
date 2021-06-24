// platform internal
import React from 'react';
import adb from 'adbkit';

// Legacy UI
import {
  createDataSource,
  DataTable,
  DataTableColumn, 
  Layout, 
  Panel,
  PluginClient,
  usePlugin,
} from 'flipper-plugin';

// Sandy UI
import {
  Button,
  Col, 
  Divider,
  Row,
} from 'antd'

// plugin
import { 
    AdbBridge, 
    ClearDataCommand, 
    RestartCommand, 
    KillCommand, 
    ClearDataAndRestartCommand, 
    UninstallCommand,
    TalkbackOnCommand,
    TalkbackOffCommand,
 } from './command/AllCommands'
import { NameForm } from './NameForm'

type DataRow = {
  id: number;
  time: string;
  viewId: string;
  eventType: string;
};

type Events = {
  newRow: DataRow;
};

type ShellCallBack = (output: string) => any;

const style = { background: '#ffffff', padding: '8px 8' };
const textStyle = { background: '#ffffff', padding: '12px'};

function createRow(event: DataRow) {
  return {
    ...event,
  };
}

export function plugin(client: PluginClient<Events, {}>) {

  const rows = createDataSource<DataRow>([], {
    limit: 1024 * 10,
    persist: 'events',
  });

  client.onMessage('newRow', (payload) => {
    rows.append(createRow(payload));
  });

  const device = client.device;

  const executeShell = (callback: ShellCallBack, command: string) => {
    return (device.realDevice as any).adb
        .shell(device.serial, command)
        .then(adb.util.readAll)
        .then(function (output: { toString: () => { trim: () => string } }) {
            return callback(output.toString().trim());
        });
};

  const adbBridge = new AdbBridge(executeShell);

  const talkbackOn = () => {
    new TalkbackOnCommand(adbBridge).execute();
  }

  const talkbackOff = () => {
    new TalkbackOffCommand(adbBridge).execute();
  }

  const columns: DataTableColumn<DataRow>[] = [
    {
      key: 'time',
      width: 150,
    },
    {
      key: 'viewId',
      title: 'View ID',
    },
    {
      key: 'eventType',
      title: 'Event Type',
    },
  ];

  return {
    rows,
    columns,
    talkbackOn,
    talkbackOff,
  };
}

export function Component() {
  const instance = usePlugin(plugin);
  return (
    <Layout.Container grow>
      <Panel title='Device Commands'>

      <Layout.Container grow>
        <Row gutter={8}>
          <Col className="gutter-row" span={8}>
            <div style={textStyle}>
            Talk Back
            </div>
          </Col>
          <Col className="gutter-row" span={16}>
            <div style={{marginTop: 8, marginBottom: 8, marginLeft: 8, marginRight: 8}}>
              <Button type="primary" onClick={instance.talkbackOn}>Talkback On</Button>
              <Button type="primary" onClick={instance.talkbackOff} style={{marginLeft: 8}}>Talkback Off</Button>
            </div>
          </Col>
        </Row>
      </Layout.Container>

      <Layout.Container grow>
        <Row gutter={8}>
          <Col className="gutter-row" span={8}>
            <div style={textStyle}>
            Screen Recording
            </div>
          </Col>
          <Col className="gutter-row" span={16}>
            <div style={{marginTop: 8, marginBottom: 8, marginLeft: 8, marginRight: 8}}>
              <Button type="primary" onClick={instance.talkbackOn}>Start Recording</Button>
              <Button type="primary" onClick={instance.talkbackOff} style={{marginLeft: 8}}>Pause</Button>
              <Button type="primary" onClick={instance.talkbackOff} style={{marginLeft: 8}}>Resume</Button>
              <Button type="primary" onClick={instance.talkbackOff} style={{marginLeft: 8}}>Stop Recording</Button>
            </div>
          </Col>
        </Row>
      </Layout.Container>
      </Panel>

      <Divider orientation='left' style={{background: '#f2f2f2', height: '32px'}}></Divider>

      <Layout.Container>
        <Row gutter={8}>
          <Col className="gutter-row" span={8}>
            <div style={textStyle}>
            Screen Recording
            </div>
          </Col>
          <Col className="gutter-row" span={16}>
            <div style={{marginTop: 8, marginBottom: 8, marginLeft: 8, marginRight: 8}}>
              <Button type="primary" onClick={instance.talkbackOn}>Start Recording</Button>
              <Button type="primary" onClick={instance.talkbackOff} style={{marginLeft: 8}}>Pause</Button>
              <Button type="primary" onClick={instance.talkbackOff} style={{marginLeft: 8}}>Resume</Button>
              <Button type="primary" onClick={instance.talkbackOff} style={{marginLeft: 8}}>Stop Recording</Button>
            </div>
          </Col>
        </Row>
      </Layout.Container>

      <Layout.Container grow>
          <DataTable<DataRow>
              dataSource={instance.rows}
              columns={instance.columns}
              enableAutoScroll/>
      </Layout.Container>

    </Layout.Container>
  );
}
