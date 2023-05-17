import * as actionType from '../actions/actionTypes';
import { updateObject } from '../utility/utility';

const initialState = {
    QueryName: '',
    RequestId: '',
    TableData: {},
};

const reducer = (state = initialState, action) => {
   
    switch (action.type) {
        case actionType.PUBLISHER_FORM_TABLE_DATA:
            return updateObject(state, action.payload);

        default:
            return state;
    }
};

export default reducer;
