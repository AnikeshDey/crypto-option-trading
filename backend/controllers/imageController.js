const fs = require('fs');

//Coin Image
async function coinImageLarge(req, res, next) {
    try {
        var readStream = fs.createReadStream(`./coins/images/large/${req.params.id}.png`);
	

        readStream.on('error', function(err) {
                console.log(err);
                //res.end(err);
                //res.sendStatus(400);
                var defaultStream = fs.createReadStream("./coins/images/large/default.png");

            defaultStream.on("error", function(err){
                console.log(err);
                res.sendStatus(400);
            })

                defaultStream.on("open", function (){
                        defaultStream.pipe(res);
                })

        });



        readStream.on('open', function () {
            // This just pipes the read stream to the response object (which goes to the client)
            readStream.pipe(res);
        });
        //next();
    } catch (error) {
        next(error);
    }
}

//Coin Image
async function coinImageSmall(req, res, next) {
    try {
        var readStream = fs.createReadStream(`./coins/images/large/${req.params.id}.png`);
	

        readStream.on('error', function(err) {
                console.log(err);
                //res.end(err);
                //res.sendStatus(400);
                var defaultStream = fs.createReadStream("./coins/images/large/default.png");

            defaultStream.on("error", function(err){
                console.log(err);
                res.sendStatus(400);
            })

                defaultStream.on("open", function (){
                        defaultStream.pipe(res);
                })

        });



        readStream.on('open', function () {
            // This just pipes the read stream to the response object (which goes to the client)
            readStream.pipe(res);
        });
        //next();
    } catch (error) {
        next(error);
    }
}



//exports 
module.exports = {
    coinImageLarge,
    coinImageSmall
}