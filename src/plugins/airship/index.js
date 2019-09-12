/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import type {
  TableBodyRow,
  TableColumnOrder,
  TableColumnSizes,
  TableColumns
} from 'flipper';
import type {Counter} from './Airship.js';
import type {NameValuePair} from './Airship.js';
import type {DeviceLogEntry} from '../../devices/BaseDevice.js';
import type {Props as PluginProps} from '../../plugin';
import {formatDate, getPageName, trimStartEndChars, pad, getEntryType, getTestDataRow} from './utils.js';

import {
  Text,
  ManagedTable,
  Button,
  colors,
  ContextMenu,
  FlexColumn,
  Glyph,
  DetailSidebar,
  FlipperDevicePlugin,
  SearchableTable,
  styled,
  Device,
  createPaste,
  textContent,
} from 'flipper';

import LogWatcher from './Airship';

const LOG_WATCHER_LOCAL_STORAGE_KEY = 'LOG_WATCHER_LOCAL_STORAGE_KEY';

type Entries = Array<{
  row: TableBodyRow,
  entry: DeviceLogEntry,
}>;

type State = {|
  rows: Array<TableBodyRow>,
  entries: Entries,
  key2entry: {[key: string]: DeviceLogEntry},
  highlightedRows: Set<string>,
  counters: Array<Counter>,
  additionalData: Array<NameValuePair>,
  contextData: Array<NameValuePair>,
  eventsAndProductsData: Array<NameValuePair>,
  hitData: Array<NameValuePair>
|};

type Actions = {||};

type PersistedState = {||};

const Icon = styled(Glyph)({
  marginTop: 5,
});

function getLineCount(str: string): number {
  let count = 1;
  if (!(typeof str === 'string')) {
    return 0;
  }
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\n') {
      count++;
    }
  }
  return count;
}

function keepKeys(obj, keys) {
  const result = {};
  for (const key in obj) {
    if (keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

const COLUMN_SIZE = {
  hitColumn: 315,
  time: 115
};

const COLUMNS = {
  hitColumn: {
    value: 'Hit'
  },
  time: {
    value: 'Time'
  }
};

const INITIAL_COLUMN_ORDER = [
  {
    key: 'hitColumn',
    visible: true,
  },
  {
    key: 'time',
    visible: true,
  }
];

const LOG_TYPES: {
  [level: string]: {
    label: string,
    color: string,
    icon?: React.Node,
    style?: Object,
  },
} = {
  other: {
    label: 'Other',
    icon: <Icon name="info-circle" color={colors.cyan} />,
    color: '#353334',
  },
  action: {
    label: 'Action',
    style: {
      backgroundColor: '#F8E6C9',
      color: '#1F448E',
      fontWeight: 600,
    },
    icon: <Icon name="caution-octagon" color={colors.red} />,
    color: colors.red,
  },
  lifecycle: {
    label: 'Lifecycle',
    style: {
      backgroundColor: '#D2EACF',
      color: '#A51F3C',
      fontWeight: 600,
    },
    icon: <Icon name="stop" color={colors.red} />,
    color: colors.red,
  },
};

const DEFAULT_FILTERS = [
  {
    type: 'enum',
    enum: Object.keys(LOG_TYPES).map(value => ({
      label: LOG_TYPES[value].label,
      value,
    })),
    key: 'type',
    value: [],
    persistent: true,
  },
];

const HiddenScrollText = styled(Text)({
  alignSelf: 'baseline',
  userSelect: 'none',
  lineHeight: '130%',
  marginTop: 5,
  paddingBottom: 3,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const LogCount = styled('div')(({backgroundColor}) => ({
  backgroundColor,
  borderRadius: '999em',
  fontSize: 11,
  marginTop: 4,
  minWidth: 16,
  height: 16,
  color: colors.white,
  textAlign: 'center',
  lineHeight: '16px',
  paddingLeft: 4,
  paddingRight: 4,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}));

export function addEntriesToState(
  items: Entries,
  state: $Shape<State> = {
    rows: [],
    entries: [],
    key2entry: {},
  },
): $Shape<State> {
  const rows = [...state.rows];
  const entries = [...state.entries];
  const key2entry = {...state.key2entry};

  for (let i = 0; i < items.length; i++) {
    const {entry, row} = items[i];
    entries.push({row, entry});
    key2entry[row.key] = entry;

    let previousEntry: ?DeviceLogEntry = null;

    if (i > 0) {
      previousEntry = items[i - 1].entry;
    } else if (state.rows.length > 0 && state.entries.length > 0) {
      previousEntry = state.entries[state.entries.length - 1].entry;
    }

    addRowIfNeeded(rows, row, entry, previousEntry);
  }

  return {
    entries,
    rows,
    key2entry,
  };
}

export function addRowIfNeeded(
  rows: Array<TableBodyRow>,
  row: TableBodyRow,
  entry: DeviceLogEntry,
  previousEntry: ?DeviceLogEntry,
) {
    rows.unshift(row);
}

function getContextData(textString: string): Array<string> {

    try {
        var trimmedString = trimStartEndChars(textString)
        var decodedTrimmedString = decodeURIComponent(trimmedString);
        var params = decodedTrimmedString.split("&");

        let newParams = []

        let inC = false
        let inA = false

        for (const param of params){
            if (param == "c.") {
                inC = true
                continue
            }
            if (param == "a.") {
                inA = true
                continue
            }
            if (param == ".c") {
                inC = false
                continue
            }
            if (param == ".a") {
                inA = false
                continue
            }

            if (inA) {
              let newParam = 'a.' + param
              newParams.push(newParam)
              continue
            }
            if (inC) {
              newParams.push(param)
              continue
            }

        }

        newParams .sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ? 1 : -1)

        return newParams;

    } catch (err) {
        return []
    }
}

function getAdditionalData(textString: string): Array<string> {
  var trimmedString = trimStartEndChars(textString)
  var decodedTrimmedString = decodeURIComponent(trimmedString);
  var params = decodedTrimmedString.split("&");
  let newParams = []

  let inC = false

  for (const param of params){
    if (param == "c.") {
      inC = true
      continue
    }
    if (param == ".c") {
      inC = false
      continue
    }

    if (!inC) {
        newParams.push(param)
        continue
    }
  }
  newParams.sort()
  return newParams;
}

function getHitData(textString: string, row): Array<NameValuePair> {
  console.log("...running getHitData")

  // assign additional data
  let newHitData = []

  const formattedDate = formatDate(row.entry.date)

  newHitData.push({name: 'Time' , value: formattedDate })

  const unformattedTime = String(row.entry.date)
  newHitData.push({name: 'Unformatted Date' , value: unformattedTime })

  const message = String(row.entry.message)
  newHitData.push({name: 'Message' , value: message })

  return newHitData;
}

let testDataRowNumber = 0;
let testDataRowNumberMax = 11

export function processEntry(entry: DeviceLogEntry, key: string): {row: TableBodyRow, entry: DeviceLogEntry} {
    // build the item, it will either be batched or added straight awa

  testDataRowNumber++
  //if (testDataRowNumber <= testDataRowNumberMax) {
  //  console.log("override row with " + testDataRowNumber)
  //  entry.message = getTestDataRow(testDataRowNumber)
  //}

  // calculate hit value
  let hitValue = getPageName(entry.message)

  // override pageName if there is an a.action attribute
  let newContextData = getContextData(entry.message)
  for (const newContextDataElement of newContextData){
    let paramName = String(newContextDataElement)
    let param = paramName.split("=")
    if (param[0] == 'a.action') {
      hitValue = param[1]
    }
  }

  // override pageName if there is an a.internalaction=Lifecycle attribute
  if (entry.message.match('&internalaction=Lifecycle')) {
    hitValue = 'Lifecycle'
  }

  const formattedDate = formatDate(entry.date)

  const entryType = getEntryType(entry.message)
  const {icon, style} = LOG_TYPES[entryType]

  return {
    row: {
      columns: {
        type: {
          value: icon,
          align: 'center',
        },
        time: {
          value: (
            <HiddenScrollText code={true}>{formattedDate}</HiddenScrollText>
          ),
        },
        message: {
          value: (
            <HiddenScrollText code={true}>{entry.message}</HiddenScrollText>
          ),
        },
        hitColumn: {
          value: (
            <HiddenScrollText code={true}>{hitValue}</HiddenScrollText>
          ),
        },
        tag: {
          value: <HiddenScrollText code={true}>{entry.tag}</HiddenScrollText>,
          isFilterable: true,
        },
        pid: {
          value: (
            <HiddenScrollText code={true}>{String(entry.pid)}</HiddenScrollText>
          ),
          isFilterable: true,
        },
        tid: {
          value: (
            <HiddenScrollText code={true}>{String(entry.tid)}</HiddenScrollText>
          ),
          isFilterable: true,
        },
        app: {
          value: <HiddenScrollText code={true}>{entry.app}</HiddenScrollText>,
          isFilterable: true,
        },
      },
      height: getLineCount(entry.message) * 15 + 10, // 15px per line height + 8px padding
      style,
      type: entry.type,
      filterValue: entry.message,
      key,
    },
    entry
  };
}

export default class LogTable extends FlipperDevicePlugin <State, Actions,PersistedState,> {
  static keyboardActions = ['clear', 'goToBottom', 'createPaste'];

  initTimer: ?TimeoutID;
  batchTimer: ?TimeoutID;

  testDataRowNumber = 1;

  static supportsDevice(device: Device) {
    return device.os === 'iOS' || device.os === 'Android';
  }

  onKeyboardAction = (action: string) => {
    if (action === 'clear') {
      this.clearLogs();
    } else if (action === 'goToBottom') {
      this.goToBottom();
    } else if (action === 'createPaste') {
      this.createPaste();
    }
  };

  restoreSavedCounters = (): Array<Counter> => {
    const savedCounters =
      window.localStorage.getItem(LOG_WATCHER_LOCAL_STORAGE_KEY) || '[]';
    return JSON.parse(savedCounters).map((counter: Counter) => ({
      ...counter,
      expression: new RegExp(counter.label, 'gi'),
      count: 0,
    }));
  };

  calculateHighlightedRows = (
    deepLinkPayload: ?string,
    rows: Array<TableBodyRow>,
  ): Set<string> => {
    const highlightedRows = new Set();
    if (!deepLinkPayload) {
      return highlightedRows;
    }

    // Run through array from last to first, because we want to show the last
    // time it the log we are looking for appeared.
    for (let i = rows.length - 1; i >= 0; i--) {
      if (
        rows[i].filterValue &&
        rows[i].filterValue.includes(deepLinkPayload)
      ) {
        highlightedRows.add(rows[i].key);
        break;
      }
    }
    if (highlightedRows.size <= 0) {
      // Check if the individual lines in the deeplinkPayload is matched or not.
      const arr = deepLinkPayload.split('\n');
      for (const msg of arr) {
        for (let i = rows.length - 1; i >= 0; i--) {
          if (rows[i].filterValue && rows[i].filterValue.includes(msg)) {
            highlightedRows.add(rows[i].key);
            break;
          }
        }
      }
    }
    return highlightedRows;
  };

  tableRef: ?ManagedTable;
  columns: TableColumns;
  columnSizes: TableColumnSizes;
  columnOrder: TableColumnOrder;
  logListener: ?Symbol;

  batch: Entries = [];
  queued: boolean = false;
  counter: number = 0;

  constructor(props: PluginProps<PersistedState>) {
    super(props);

    const supportedColumns = this.device.supportedColumns();

    this.columns = keepKeys(COLUMNS, supportedColumns);
    this.columnSizes = keepKeys(COLUMN_SIZE, supportedColumns);
    this.columnOrder = INITIAL_COLUMN_ORDER.filter(obj =>
      supportedColumns.includes(obj.key),
    );

    this.columns = COLUMNS
    this.columnSizes = COLUMN_SIZE
    this.columnOrder = INITIAL_COLUMN_ORDER

    const initialState = addEntriesToState(
      this.device
        .getLogs()
        .filter(log => log.message.match('Analytics - Request Queued'))
        .map(log => processEntry(log, String(this.counter++))),
    );

    this.state = {
      ...initialState,
      highlightedRows: this.calculateHighlightedRows(
        props.deepLinkPayload,
        initialState.rows,
      ),
      counters: this.restoreSavedCounters(),
      contextData: [],
      additionalData: [],
      eventsAndProductsData: [],
      hitData: []
    };

    this.logListener = this.device.addLogListener((entry: DeviceLogEntry) => {
      if (entry.tag.match('ADBMobile') && entry.message.match('Analytics - Request Queued')) {
        const processedEntry = processEntry(entry, String(this.counter++));
        this.incrementCounterIfNeeded(processedEntry.entry);
        this.scheudleEntryForBatch(processedEntry);
      }
    });
  }

  incrementCounterIfNeeded = (entry: DeviceLogEntry) => {
    let counterUpdated = false;
    const counters = this.state.counters.map(counter => {
      if (entry.message.match(counter.expression)) {
        counterUpdated = true;
        if (counter.notify) {
          new window.Notification(`${counter.label}`, {
            body: 'The watched log message appeared',
          });
        }
        return {
          ...counter,
          count: counter.count + 1,
        };
      } else {
        return counter;
      }
    });
    if (counterUpdated) {
      this.setState({counters});
    }
  };

  scheudleEntryForBatch = (item: {
    row: TableBodyRow,
    entry: DeviceLogEntry,
  }) => {
    // batch up logs to be processed every 250ms, if we have lots of log
    // messages coming in, then calling an setState 200+ times is actually
    // pretty expensive
    this.batch.push(item);

    if (!this.queued) {
      this.queued = true;

      this.batchTimer = setTimeout(() => {
        const thisBatch = this.batch;
        this.batch = [];
        this.queued = false;
        this.setState(state => addEntriesToState(thisBatch, state));
      }, 100);
    }
  };

  componentWillUnmount() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    if (this.logListener) {
      this.device.removeLogListener(this.logListener);
    }
  }

  clearLogs = () => {
    this.device.clearLogs().catch(e => {
      console.error('Failed to clear logs: ', e);
    });
    this.setState({
      entries: [],
      rows: [],
      highlightedRows: new Set(),
      key2entry: {},
      counters: this.state.counters.map(counter => ({
        ...counter,
        count: 0,
      })),
    });
  };

  createPaste = () => {
    let paste = '';
    const mapFn = row =>
      Object.keys(COLUMNS)
        .map(key => textContent(row.columns[key].value))
        .join('\t');

    if (this.state.highlightedRows.size > 0) {
      // create paste from selection
      paste = this.state.rows
        .filter(row => this.state.highlightedRows.has(row.key))
        .map(mapFn)
        .join('\n');
    } else {
      // create paste with all rows
      paste = this.state.rows.map(mapFn).join('\n');
    }
    createPaste(paste);
  };

  setTableRef = (ref: React.ElementRef<typeof ManagedTable>) => {
    this.tableRef = ref;
  };

  goToBottom = () => {
    if (this.tableRef != null) {
      this.tableRef.scrollToBottom();
    }
  };

  onRowHighlighted = (highlightedRows: Array<string>) => {
    console.log('...running onRowHighlighted - begin')
    this.setState({
      ...this.state,
      highlightedRows: new Set(highlightedRows),
    });

    const currentRow = this.state.entries[highlightedRows[0]]
    const currentEntry = currentRow.entry
    const time = currentEntry.date.toTimeString().split(' ')[0] + '.' + pad(currentEntry.date.getMilliseconds(), 3)

    const newCounter = {
      label: time,
      expression: new RegExp(this.state.input, 'gi'),
      notify: false,
      count: 0,
    }

    const counters = this.state.counters
    this.state.counters[0] = newCounter
    this.setState({counters});

    // assign context data
    let contextData = this.state.contextData

    while (contextData.length) {
        contextData.pop();
    }

    let message = currentEntry.message

    let newContextData = getContextData(message)
    for (const newContextDataElement of newContextData){
      let paramName = String(newContextDataElement)
      let param = paramName.split("=")
      this.state.contextData.push({name: param[0] , value: param[1] })
    }
    this.setState({contextData});

    // assign additional data
    let additionalData = this.state.additionalData
    let eventsAndProductsData = this.state.eventsAndProductsData

    while (additionalData.length) {
        additionalData.pop();
    }
    while (eventsAndProductsData.length) {
        eventsAndProductsData.pop();
    }

    let newAdditionalData = getAdditionalData(message)
    for (const newAdditionalDataElement of newAdditionalData){
      let paramName = String(newAdditionalDataElement)
      let param = paramName.split("=")
      if (param[0] == 'events') {
        console.log('found events')
        // test
        //param[1] = "ScmE,ScmE2"
        this.state.eventsAndProductsData.push({name: param[0] , value: param[1] })
                try {
                    // parse products
                    let eventNbr = 1
                    const events = param[1].split(',')
                    for (const event of events){
                        this.state.eventsAndProductsData.push({name: '  event ' + eventNbr , value: event })
                        eventNbr++
                    }
                } catch (err) {
                  this.state.eventsAndProductsData.push({name: '' , value: '*** Parsing Error ***' })
                }
      } else if (param[0] == 'products') {
        console.log('found products')
        // test
        //param[1] = ";EG8101;3;180.0,;XEG8102;6;360.0"
        this.state.eventsAndProductsData.push({name: param[0] , value: param[1] })
        try {
            // parse products
            let productNbr = 1
            const products = param[1].split(',')
            for (const product of products){
                this.state.eventsAndProductsData.push({name: '  product ' + productNbr , value: product })
                const productAttrs = product.split(';')
                console.log("productAttrs")
                console.log(productAttrs)
                this.state.eventsAndProductsData.push({name: '    sku' , value: '  ' + productAttrs[1] })
                this.state.eventsAndProductsData.push({name: '    qty' , value: '  ' + productAttrs[2] })
                this.state.eventsAndProductsData.push({name: '    price' , value: '  ' + productAttrs[3] })
                productNbr++
            }
        } catch (err) {
          this.state.eventsAndProductsData.push({name: '' , value: '*** Parsing Error ***' })
        }
      } else {
        this.state.additionalData.push({name: param[0] , value: param[1] })
      }
    }
    this.setState({additionalData});
    this.setState({eventsAndProductsData});

    // assign hit data
    let hitData = getHitData(message, currentRow)
    this.setState({hitData})

    console.log('...running onRowHighlighted - end')
  };

  renderSidebar = () => {
    console.log("...running renderSidebar")
    return (
      <LogWatcher
        counters={this.state.counters}
        additionalData={this.state.additionalData}
        contextData={this.state.contextData}
        hitData={this.state.hitData}
        eventsAndProductsData={this.state.eventsAndProductsData}
        onChange={contextData =>
          this.setState({contextData}, () =>
            window.localStorage.setItem(
              LOG_WATCHER_LOCAL_STORAGE_KEY,
              JSON.stringify(this.state.contextData),
            ),
          )
        }
      />
    );
  };

  static ContextMenu = styled(ContextMenu)({
    flex: 1,
  });

  buildContextMenuItems = () => [
    {
      type: 'separator',
    },
    {
      label: 'Clear all',
      click: this.clearLogs,
    },
  ];

  render() {
    return (
      <LogTable.ContextMenu
        buildItems={this.buildContextMenuItems}
        component={FlexColumn}>
        <SearchableTable
           width={310}
          innerRef={this.setTableRef}
          floating={false}
          multiline={true}
          columnSizes={this.columnSizes}
          columnOrder={this.columnOrder}
          columns={this.columns}
          rows={this.state.rows}
          highlightedRows={this.state.highlightedRows}
          onRowHighlighted={this.onRowHighlighted}
          multiHighlight={false}
          zebra={false}
          actions={<Button onClick={this.clearLogs}>Clear Logs</Button>}
          allowRegexSearch={false}
          // If the logs is opened through deeplink, then don't scroll as the row is highlighted
          stickyBottom={
            !(this.props.deepLinkPayload && this.state.highlightedRows.size > 0)
          }
        />
        <DetailSidebar width={450}>{this.renderSidebar()}</DetailSidebar>
      </LogTable.ContextMenu>
    );
  }
}
