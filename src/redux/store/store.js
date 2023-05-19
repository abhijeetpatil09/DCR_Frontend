//redux
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';

// Redux Persist
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import thunk from 'redux-thunk';

import userReducer from '../reducers/userReducer';
import ConsumerFormReducer from '../reducers/ConsumerFormReducer';
import PublisherFormReducer from '../reducers/PublisherFormReducer';

const AppRootReducer = combineReducers({
    user: userReducer,
    ConsumerForm: ConsumerFormReducer,
    PublisherForm: PublisherFormReducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT_USER') {
        storage.removeItem('persist:root');
        state = undefined;
    } else if (action.type === 'LOGIN_REQUEST') {
        state.ConsumerForm = {};
        state.PublisherForm = {};
    }
    return AppRootReducer(state, action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));
