import createStoreFromServer from "./serverStore";
import createStoreFromClient from "./clientStore";

const _initialState = {};

export default (initialState = _initialState, props) => {
  if(props.isServer) {
    return createStoreFromServer(initialState, props)
  } else {
    return createStoreFromClient(initialState, props);
  }
}
