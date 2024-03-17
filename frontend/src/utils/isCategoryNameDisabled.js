import { store } from "../redux/store"

const isCategoryNameDisabled = (value) => {
    var riskData = store.getState().risk.risk;
    var replacebleCategoryNames = riskData.disabledCategoryName;

    if(replacebleCategoryNames.includes(value.toLowerCase())){
        return true;
    } else{
        return false;
    }
}

export default isCategoryNameDisabled;