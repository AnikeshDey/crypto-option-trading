import ActionTypes from './notification.types';
import { store } from '../store';

const INITIAL_STATE = {
    notifications:[]
}

export const notificationReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.PUT_NOTIFICATION:
            var user = store.getState().user;
            return {notifications: action.notifications.filter(n => n.userFrom._id != user._id)}
            break;
        case ActionTypes.UPDATE_NOTIFICATION:
            var notificationsCopy = state.notifications;
            const index = notificationsCopy.findIndex(n => n._id === action.notification._id);
            notificationsCopy[index] = action.notification;    
            return {notifications: notificationsCopy};
          break;
        default:
            return state;
      }
}