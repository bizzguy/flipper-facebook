/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import type {TableBodyRow} from 'flipper';

import {
  Component,
  FlexRow,
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

import {Request} from './types';
import {decodeBody, getHeaderValue} from './utils';

const ToolbarItem = styled(FlexRow)({
  alignItems: 'center',
  marginLeft: '8px',
});

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
  airshipData: Array<NameValuePair>,
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
    highlightedRow: null,
    airshipPanelIsShown: false
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
    console.log("...running Airship.onChange")
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

  buildRowsAirshipData = (): Array<TableBodyRow> => {
    const rows = this.props.airshipData.map(({name, value}, i) => ({
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

    const formattedText = "ABC";
    const data = JSON.parse('{"helloworld": "hello world 3"}');

    if (this.props.airshipData.length > 0) {
      this.state.airshipPanelIsShown = true
    } else {
      this.state.airshipPanelIsShown = false
    }

    return (
      <FlexColumn grow={true} tabIndex={-1} onKeyDown={this.onKeyDown}>
        {this.state.airshipPanelIsShown &&
        <WatcherPanel
          heading="Airship Data"
          floating={false}
          padded={false}>
          <ManagedTable
            columnSizes={ColumnSizes}
            columns={Columns}
            rows={this.buildRowsAirshipData()}
            autoHeight={true}
            floating={false}
            zebra={true}
            highlightableRows={false}
            multiHighlight={false}
            multiline={true}
            enableKeyboardNavigation={false}
          />
        </WatcherPanel>
        }
        <Panel
          heading={'JSON Data'}
          floating={false}
          padded={!formattedText}>
          <JSONText>{data}</JSONText>
        </Panel>
        <WatcherPanel
          collapsed={true}
          heading="Message Data"
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

class JSONTextFormatter {
  formatRequest = (request: Request) => {
    return this.format(
      decodeBody(request),
      getHeaderValue(request.headers, 'content-type'),
    );
  };

  formatResponse = (request: Request, response: Response) => {
    return this.format(
      decodeBody(response),
      getHeaderValue(response.headers, 'content-type'),
    );
  };

  format = (body: string, contentType: string) => {
    if (
      contentType.startsWith('application/json') ||
      contentType.startsWith('application/hal+json') ||
      contentType.startsWith('text/javascript') ||
      contentType.startsWith('application/x-fb-flatbuffer')
    ) {
      try {
        const data = JSON.parse(body);
        return <JSONText>{data}</JSONText>;
      } catch (SyntaxError) {
        // Multiple top level JSON roots, map them one by one
        return body
          .split('\n')
          .map(json => JSON.parse(json))
          .map(data => <JSONText>{data}</JSONText>);
      }
    }
  };
}

const TextBodyFormatters: Array<BodyFormatter> = [new JSONTextFormatter()];

const BodyContainer = styled('div')({
  paddingTop: 10,
  paddingBottom: 20,
});

class RequestBodyInspector extends Component<{
  request: Request;
  formattedText: boolean;
}> {
  render() {
    const {request, formattedText} = this.props;
    const bodyFormatters = formattedText ? TextBodyFormatters : BodyFormatters;
    let component;
    for (const formatter of bodyFormatters) {
      if (formatter.formatRequest) {
        try {
          component = formatter.formatRequest(request);
          if (component) {
            break;
          }
        } catch (e) {
          console.warn(
            'BodyFormatter exception from ' + formatter.constructor.name,
            e.message,
          );
        }
      }
    }

    component = component || <Text>ABC</Text>;

    return <BodyContainer>{component}</BodyContainer>;
  }
}

class JSONText extends Component<{children: any}> {
  static NoScrollbarText = styled(Text)({
    overflowY: 'hidden',
  });

  render() {
    const jsonObject = this.props.children;
    return (
      <JSONText.NoScrollbarText code whiteSpace="pre" selectable>
        {JSON.stringify(jsonObject, null, 2)}
        {'\n'}
      </JSONText.NoScrollbarText>
    );
  }
}
