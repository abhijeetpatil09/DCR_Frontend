import * as actionType from './actionTypes';

export const PublisherForm = payload => {
    return {
        type: actionType.PUBLISHER_FORM_TABLE_DATA,
        payload: payload,
    };
};
