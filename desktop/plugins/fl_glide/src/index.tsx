import React from 'react';
import { FlipperPlugin, FlexColumn, KeyboardActions } from 'flipper';

type State = {};

type Data = {};

type PersistedState = {
  data: Array<Data>;
};

export default class extends FlipperPlugin<State, any, PersistedState> {

  static title = 'FL Glide Plugin'
  static id = 'fl-glide'
  //static icon = 'app'

  componentDidMount() {
    this.client.subscribe('message', message => {
      this.setState({ message })
      console.log(this.state.message)
    }
    )
  }


  static keyboardActions: KeyboardActions = ['clear'];

  static defaultPersistedState: PersistedState = {
    data: [],
  };

  static persistedStateReducer = (
    persistedState: PersistedState,
    method: string,
    data: Data,
  ): PersistedState => {
    return {
      ...persistedState,
      data: persistedState.data.concat([data]),
    };
  };

  state = {};

  onKeyboardAction = (action: string) => {
    if (action === 'clear') {
      this.props.setPersistedState({ data: [] });
    }
  };

  render() {
    return (
      <FlexColumn>
        <div>Hello World</div>
      </FlexColumn>
    );
  }

}
