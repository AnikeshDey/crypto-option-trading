// middlewares/responseHandler.js

function responseHandler(req, res, next) {
    //console.log("2",res.locals.data)
    if (res.locals.data) {
        /*res.status(200).json({
            status: "success",
            code: 200,
            message: "Success",
            data: res.locals.data,
            timestamp: new Date().toISOString()
        });*/

        //console.log("3", res.locals.data);

        res.status(200).json(res.locals.data);
    } else {
        next();
    }
}
  
module.exports = responseHandler;  