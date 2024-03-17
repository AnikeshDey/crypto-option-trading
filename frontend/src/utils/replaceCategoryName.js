import { store } from "../redux/store"

const replaceCategoryName = (value) => {
    var riskData = store.getState().risk.risk;
    var replacebleCategoryNames = riskData.replaceCategoryName;

    var keys = Object.keys(replacebleCategoryNames);

    for(var i = 0; i < keys.length; i++){
        if(value.toLowerCase().includes(keys[i].toString())){
            var newValue = value.toLowerCase().replace(keys[i], replacebleCategoryNames[keys[i]]);
            return newValue;
        } else{
            if(i == keys.length -1){
                return value;
            } 
        }
    }
}

export default replaceCategoryName;