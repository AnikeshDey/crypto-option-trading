function errorHandler(err, req, res, next) {

    console.log(err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: err.message || "Internal Server Error",
        error: {
            details: err.details || ""
        },
        timestamp: new Date().toISOString()
    });
}

module.exports = errorHandler;