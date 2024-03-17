import ActionTypes from './page.types';

export const setPageType = (pageType) => ({
    type:ActionTypes.SET_PAGE_TYPE,
    pageType: pageType
});
