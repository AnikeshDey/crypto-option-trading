import { SlipData } from "../interfaces/SlipData";

const getRankData = (array:SlipData[], lockPrice:number): SlipData[] => {
    var ranked:SlipData[] = [];

    array.sort((a:any, b:any) => {
        return (b.po - a.po)
    }).sort((a:any, b:any) => {
        return Math.abs(lockPrice - a.po) - Math.abs(lockPrice - b.po);
    }).forEach((item:SlipData, i:number) => {
        if (i > 0) {
            //Get our previous list item
            var prevItem = array[i - 1];
            if (prevItem.po == item.po) {
                //Same score = same rank
                item.rk = prevItem.rk;
                // console.log(`Making rank of ${i}`);
            } else {
                //Not the same score, give em the current iterated index + 1
                item.rk = i + 1;
                // console.log(`Making rank of ${i}`);
            }
        } else {
            //First item takes the rank 1 spot
            item.rk = 1;
            // console.log(`Making rank of ${i}`);
        }
        // item.st = i;
        ranked.push(item);
    });

    return ranked;
}

export { getRankData };