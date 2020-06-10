import {
  Text,
  Panel,
  ManagedDataInspector,
  FlipperPlugin,
  DetailSidebar,
  FlexRow,
  FlexColumn,
  styled,
  colors,
} from 'flipper';
import React from 'react';

type Id = number;

type Image = {
  id: Id;
  caching: string;
  url: string;
  view_id: string;
};

type Notification = {
  id: Id;
  message: string;
  url: string;
  view_id: string;
};

function renderSidebar(image: Image) {
  return (
    <Panel floating={false} heading={'Extras'}>
      <ManagedDataInspector data={image} expandRoot={true} />
    </Panel>
  );
}

type State = {
  selectedID: string | null;
};

type Entries = Array<{ image: Image }>;

type PersistedState = {
  images: { [id: string]: Image };
  currentNotifications: { [id: string]: Notification };
};

export default class GlideImagePlugin extends FlipperPlugin<State, any, PersistedState> {

  static batchTimer: NodeJS.Timeout | undefined;

  static batchImages: Image[] = [];
  queued: boolean = false;
  counter: number = 0;

  //static defaultPersistedState = {};
  static defaultPersistedState = {
    images: {},
    currentNotifications: {}
  };

  static persistedStateReducer(persistedState: PersistedState, method: string, payload: Image | Notification) {
    if (method === 'newImage') {
      console.log('Recieved image id:' + payload.id + " for url: " + payload.url)
      GlideImagePlugin.batchImages.push(payload as Image);
      return Object.assign({}, persistedState, {
        images: { ...persistedState.images, [payload.id]: payload as Image },
      });
    }
    if (method === 'newError') {
      console.log('Recieved new error id:' + payload.id)
      return Object.assign({}, persistedState, {
        currentNotifications: { ...persistedState.currentNotifications, [payload.id]: payload as Notification },
      });
    }
    return persistedState;
  }

  static Container = styled(FlexRow)({
    backgroundColor: colors.macOSTitleBarBackgroundBlur,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexGrow: 1,
    overflow: 'scroll',
  });

  state = {
    selectedID: null as string | null,
  };

  /*
   * Callback to provide the currently active notifications.
   */
  static getActiveNotifications(persistedState: PersistedState) {
    return Object.entries(persistedState.currentNotifications).map(([id, notification]) => {
      const viewMessage = "View id: " + notification.view_id;
      const urlMessage = "(Url: " + notification.url + ')';
      return {
        id: 'error-notification:' + id,
        message: viewMessage,
        severity: 'error' as 'error',
        title: 'GlideException: ' + notification.message + ' ' + urlMessage,
        action: ''
      };
    });
  }

  render() {
    const { selectedID } = this.state;
    const { persistedState } = this.props;

    return (
      < GlideImagePlugin.Container >
        {
          Object.entries(GlideImagePlugin.batchImages).reverse().map(([id, image]) => (
            <Card
              {...image}
              onSelect={() => this.setState({ selectedID: id })}
              selected={id === selectedID}
              key={id}
            />
          ))
        }
        < DetailSidebar >
          {selectedID && renderSidebar(GlideImagePlugin.batchImages[selectedID])}
        </DetailSidebar>
      </GlideImagePlugin.Container >
    );
  }
}

class Card extends React.Component<
  {
    onSelect: () => void;
    selected: boolean;
  } & Image
  > {
  static Container = styled(FlexColumn)<{ selected?: boolean }>((props) => ({
    margin: 10,
    borderRadius: 5,
    border: '2px solid black',
    backgroundColor: colors.white,
    borderColor: props.selected
      ? colors.macOSTitleBarIconSelected
      : colors.white,
    padding: 0,
    overflow: 'hidden',
    boxShadow: '1px 1px 4px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  }));

  static Image = styled.div({
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    paddingTop: '100%',
    minWidth: '250px',
  });

  static Title = styled(Text)({
    fontSize: 14,
    fontWeight: 'bold',
    padding: '10px 5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

  render() {
    return (
      <Card.Container
        onClick={this.props.onSelect}
        selected={this.props.selected}>
        <Card.Image style={{ backgroundImage: `url(${encodeURI(this.props.url) || ''})` }} />
        <Card.Title>{this.props.caching}</Card.Title>
      </Card.Container>
    );
  }
}
