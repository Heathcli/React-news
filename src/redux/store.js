import { createStore,combineReducers } from "redux";
import triggerReducer from "./reducers/trigger";
import loadingReducer from "./reducers/loading";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const allReducers = combineReducers({
    isLoading:loadingReducer,
    isCollapsed:triggerReducer
})

const persistConfig = {
    key: 'root',
    storage,
    blacklist:['isLoading']
  }

const persistedReducer = persistReducer(persistConfig, allReducers)

let store = createStore(persistedReducer)
  let persistor = persistStore(store)

export { store, persistor }
  

