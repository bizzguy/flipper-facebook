import React from 'react';

import {
  createState,
  createDataSource,
  DataTable,
  DataTableColumn, 
  Layout, 
  PluginClient,
  usePlugin,
} from 'flipper-plugin';

import {
  Button,
  Col, 
  Row
} from 'antd'

type DataRow = {
  id: number;
  time: string;
  viewId: string;
  eventType: string;
};

type Events = {
  newRow: DataRow;
};

const style = { background: '#ffffff', padding: '6px 0' };
const textStyle = { background: '#ffffff', padding: '6px 0' };

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

  const talkbackOn = () => {
    //new TalkbackOnCommand(adbBridge).execute();
  }

  const talkbackOff = () => {
    //new TalkbackOffCommand(adbBridge).execute();
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
      <Layout.Container gap>
        <Row gutter={8}>
          <Col className="gutter-row" span={4}>
            <div style={textStyle}>
            Talk Back
            </div>
          </Col>
          <Col className="gutter-row" span={16}>
            <div style={style}>
              <Button type="primary" onClick={instance.talkbackOn}>Talkback On</Button>
              <Button type="primary" onClick={instance.talkbackOff}>Talkback Off</Button>
            </div>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col className="gutter-row" span={4}>
            <div style={textStyle}>
            Talk Back
            </div>
          </Col>
          <Col className="gutter-row" span={16}>
            <div style={style}>
              <Button type="primary" onClick={instance.talkbackOn}>Talkback On</Button>
              <Button type="primary" onClick={instance.talkbackOff}>Talkback Off</Button>
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
