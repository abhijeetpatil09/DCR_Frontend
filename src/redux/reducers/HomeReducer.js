import * as actionType from '../actions/actionTypes';
import { updateObject } from '../utility/utility';

const initialState = {
    latestPartners: [],
    countProviderConsumer: []
};

const reducer = (state = initialState, action) => {
   
    switch (action.type) {
        case actionType.HOME:
            return updateObject(state, action.payload);

        default:
            return state;
    }
};

export default reducer;
