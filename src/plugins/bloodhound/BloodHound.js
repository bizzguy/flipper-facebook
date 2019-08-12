/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import type {TableBodyRow} from 'flipper';

import {
  PureComponent,
  FlexColumn,
  Panel,
  Input,
  Toolbar,
  Text,
  ManagedTable,
  Button,
  colors,
  styled,
} from 'flipper';

export type Counter = {
  expression: RegExp,
  count: number,
  notify: boolean,
  label: string,
};

export type NameValuePair = {
   name: string,
   value: string
}

type Props = {|
  onChange: (counters: Array<Counter>) => void,
  counters: Array<Counter>,
  additionalData: Array<NameValuePair>,
  contextData: Array<NameValuePair>,
  hitData: Array<NameValuePair>,
  eventsAndProductsData: Array<NameValuePair>,
|};

type State = {
  input: string,
  highlightedRow: ?string
};

const WrappingText = styled(Text)({
  wordWrap: 'break-word',
  width: '100%',
  lineHeight: '125%',
  padding: '3px 0',
});

const ColumnSizes = {
  keyColumn: '35%',
  valueColumn: '65%',
};

const Columns = {
  keyColumn: {
    value: 'Key',
    resizable: true,
  },
  valueColumn: {
    value: 'Value',
    resizable: true,
  },
};

const Count = styled(Text)({
  alignSelf: 'center',
  background: colors.macOSHighlightActive,
  color: colors.white,
  fontSize: 12,
  fontWeight: 500,
  textAlign: 'center',
  borderRadius: '999em',
  padding: '4px 9px 3px',
  lineHeight: '100%',
  marginLeft: 'auto',
});

const Checkbox = styled(Input)({
  lineHeight: '100%',
  padding: 0,
  margin: 0,
  height: 'auto',
  alignSelf: 'center',
});

const ExpressionInput = styled(Input)({
  flexGrow: 1,
});

const WatcherPanel = styled(Panel)({
  minHeight: 40,
});

export default class LogWatcher extends PureComponent<Props, State> {
  state = {
    input: '',
    highlightedRow: null
  };

  _inputRef: ?HTMLInputElement;

  onAdd = () => {
    if (
      this.props.counters.findIndex(({label}) => label === this.state.input) >
        -1 ||
      this.state.input.length === 0
    ) {
      // prevent duplicates
      return;
    }
    this.props.onChange([
      ...this.props.counters,
      {
        label: this.state.input,
        expression: new RegExp(this.state.input, 'gi'),
        notify: false,
        count: 0,
      },
    ]);
    this.setState({input: ''});
  };

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    console.log("...running BloodHound.onChange")
    this.setState({
      input: e.target.value,
    });
  };

  resetCount = (index: number) => {
    const newCounters = [...this.props.counters];
    newCounters[index] = {
      ...newCounters[index],
      count: 0,
    };
    this.props.onChange(newCounters);
  };

  buildRows = (): Array<TableBodyRow> => {
    console.log("...running buildRows")
    return this.props.counters.map(({label, count, notify}, i) => ({
      columns: {
        expression: {
          value: <Text code={true}>{label}</Text>,
        },
        count: {
          value: <Count onClick={() => this.resetCount(i)}>{count}</Count>,
        },
        notify: {
          value: (
            <Checkbox
              type="checkbox"
              checked={notify}
              onChange={() => this.setNotification(i, !notify)}
            />
          ),
        },
      },
      key: label,
    }));
  };

  buildRowsAdditionalData = (): Array<TableBodyRow> => {
    const rows = this.props.additionalData.map(({name, value}, i) => ({
      columns: {
        keyColumn: {
          value: <Text code={true}>   {name}</Text>,
        },
        valueColumn: {
          value: <Text code={true}>{value}</Text>,
        },
      },
      key: name,
    }));
    return rows
  };

  buildRowsContextData = (): Array<TableBodyRow> => {
    const rows = this.props.contextData.map(({name, value}, i) => ({
      columns: {
        keyColumn: {
          value: <Text code={true}>   {name}</Text>,
        },
        valueColumn: {
          value: <Text code={true}>{value}</Text>,
        },
      },
      key: name,
    }));
    return rows
  };

  buildRowsHitData = (): Array<TableBodyRow> => {
    const rows = this.props.hitData.map(({name, value}, i) => ({
      columns: {
        keyColumn: {
          value: <WrappingText >   {name}</WrappingText>
        },
        valueColumn: {
          value: <WrappingText>{value}</WrappingText>
        },
      },
      key: name,
    }));
    return rows
  };

  buildRowsEventsAndProductsData = (): Array<TableBodyRow> => {
    const rows = this.props.eventsAndProductsData.map(({name, value}, i) => ({
      columns: {
        keyColumn: {
          value: <Text code={true}>   {name}</Text>,
        },
        valueColumn: {
          value: <Text code={true}>{value}</Text>
        },
      },
      key: name,
    }));
    return rows
  };

  setNotification = (index: number, notify: boolean) => {
    const newCounters: Array<Counter> = [...this.props.counters];
    newCounters[index] = {
      ...newCounters[index],
      notify,
    };
    this.props.onChange(newCounters);
  };

  onRowHighlighted = (rows: Array<string>) => {
    //this.setState({
    //  highlightedRow: rows.length === 1 ? rows[0] : null,
    //});
  };

  onKeyDown = (e: SyntheticKeyboardEvent<>) => {
    if (
      (e.key === 'Delete' || e.key === 'Backspace') &&
      this.state.highlightedRow != null
    ) {
      this.props.onChange(
        this.props.counters.filter(
          ({label}) => label !== this.state.highlightedRow,
        ),
      );
    }
  };

  onSubmit = (e: SyntheticKeyboardEvent<>) => {
    if (e.key === 'Enter') {
      this.onAdd();
    }
  };

  render() {
    return (
      <FlexColumn grow={true} tabIndex={-1} onKeyDown={this.onKeyDown}>
        <WatcherPanel
          heading="Additional Data"
          floating={false}
          padded={false}>
          <ManagedTable
            columnSizes={ColumnSizes}
            columns={Columns}
            rows={this.buildRowsAdditionalData()}
            autoHeight={true}
            floating={false}
            zebra={true}
            highlightableRows={false}
            multiHighlight={false}
            multiline={true}
            enableKeyboardNavigation={false}
          />
        </WatcherPanel>
        <WatcherPanel
          heading="Context Data"
          floating={false}
          padded={false}>
          <ManagedTable
            columnSizes={ColumnSizes}
            columns={Columns}
            rows={this.buildRowsContextData()}
            autoHeight={true}
            floating={false}
            zebra={true}
            highlightableRows={false}
            multiHighlight={false}
            multiline={true}
            enableKeyboardNavigation={false}
          />
        </WatcherPanel>
        <WatcherPanel
          heading="Events and Products"
          floating={false}
          padded={false}>
          <ManagedTable
            columnSizes={ColumnSizes}
            columns={Columns}
            rows={this.buildRowsEventsAndProductsData()}
            autoHeight={true}
            floating={false}
            zebra={true}
            highlightableRows={false}
            multiHighlight={false}
            multiline={true}
            enableKeyboardNavigation={false}
          />
        </WatcherPanel>
        <WatcherPanel
          collapsed={true}
          heading="Hit Details and Diagnostic Data"
          floating={false}
          padded={false}>
          <ManagedTable
            columnSizes={ColumnSizes}
            columns={Columns}
            rows={this.buildRowsHitData()}
            autoHeight={true}
            floating={false}
            zebra={true}
            highlightableRows={false}
            multiHighlight={false}
            multiline={true}
            enableKeyboardNavigation={false}
          />
        </WatcherPanel>
      </FlexColumn>
    );
  }
}
