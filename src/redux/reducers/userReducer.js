import * as actionType from '../actions/actionTypes';
import { updateObject } from '../utility/utility';

const initialState = {
    name: '',
    role: [],
};

const reducer = (state = initialState, action) => {
   
    switch (action.type) {
        case actionType.LOGIN_REQUEST:
            return updateObject(state, action.payload);

        default:
            return state;
    }
};

export default reducer;
