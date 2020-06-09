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
import { batch } from 'react-redux';

type Id = number;

type Image = {
  id: Id;
  caching: string;
  url: string;
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
};

export default class GlideImagePlugin extends FlipperPlugin<State, any, PersistedState> {

  static batchTimer: NodeJS.Timeout | undefined;

  static batchImages: Image[] = [];
  queued: boolean = false;
  counter: number = 0;

  //static defaultPersistedState = {};
  static defaultPersistedState = {
    images: {}
  };

  static persistedStateReducer(persistedState: PersistedState, method: string, payload: Image) {
    if (method === 'newImage') {
      console.log('Recieved image id:' + payload.id + " for url: " + payload.url)
      GlideImagePlugin.batchImages.push(payload);
      return Object.assign({}, persistedState, {
        images: { ...persistedState.images, [payload.id]: payload as Image },
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

  componentDidMount() {
    // need to make the initial call to getData() to populate
    // data right away
    //this.getData();

    // Now we need to make it run at a specified interval
    setInterval(this.getData, 20000); // runs every 200 milliseconds
  }

  componentWillUnmount() {
    if (GlideImagePlugin.batchTimer) {
      clearTimeout(GlideImagePlugin.batchTimer);
    }
  }

  getData() {
    console.log('running getData for: ' + GlideImagePlugin.batchImages.length);

    //for (let i of GlideImagePlugin.batchImages) {
    //  console.log(i.id);
    //  console.log(i.url);
    //}

    //const { persistedState } = this.props;

    //Object.entries(persistedState).map(([id, image]) => (
    //  console.log(id)
    //))
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
        <Card.Image style={{ backgroundImage: `url(${this.props.url || ''})` }} />
        <Card.Title>{this.props.caching}</Card.Title>
      </Card.Container>
    );
  }
}
