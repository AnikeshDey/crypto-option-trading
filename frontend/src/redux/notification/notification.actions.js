import ActionTypes from './notification.types';

export const putNotifications = (notifications) => ({
    type:ActionTypes.PUT_NOTIFICATION,
    notifications: notifications
});

export const updateNotification = (notification) => ({
    type:ActionTypes.UPDATE_NOTIFICATION,
    notification: notification
});