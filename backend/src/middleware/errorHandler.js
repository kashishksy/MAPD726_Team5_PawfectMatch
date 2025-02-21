const { errorResponse } = require('../utils/response');

module.exports = (err, req, res, next) => {
    console.error("Error:", err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json(errorResponse(message, statusCode));
};
