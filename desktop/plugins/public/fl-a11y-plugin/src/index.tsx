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

type DataRow = {
  id: number;
  time: string;
  viewId: string;
  eventType: string;
};

type Events = {
  newRow: DataRow;
};

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
  };
}

export function Component() {
  const instance = usePlugin(plugin);
  return (
    <Layout.Container grow>
      <Layout.Container>

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
