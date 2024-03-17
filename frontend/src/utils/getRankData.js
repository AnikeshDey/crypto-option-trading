
const getRankData = (array, lockPrice) => {
    var ranked = []

    array.sort((a, b) => {
        return (b.po - a.po)
    }).sort((a, b) => {
        return Math.abs(lockPrice - a.po) - Math.abs(lockPrice - b.po);
    }).forEach((item, i) => {
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

export default getRankData;
