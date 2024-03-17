import { applyMiddleware,createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';

import { rootReducer } from './rootReducer';

const middlewares = [logger];

const persistConfig = {
    key: 'root',
    storage,
    blacklist:['post', 'notification', 'cryptoslip', 'contestResult', 'cryptoGame']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    applyMiddleware(...middlewares)
);

const persistor = persistStore(store);

export {store, persistor};