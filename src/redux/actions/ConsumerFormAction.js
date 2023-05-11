import * as actionType from './actionTypes';

export const ConsumerQueryForm = payload => {
    return {
        type: actionType.CONSUMER_FORM_TABLE_DATA,
        payload: payload,
    };
};
