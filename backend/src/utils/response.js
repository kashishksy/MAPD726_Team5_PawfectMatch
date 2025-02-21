exports.successResponse = (message, data = {}) => ({
    status: 200,
    message,
    data,
    error: false
});

exports.errorResponse = (message, status = 400, data = []) => ({
    status,
    message,
    data,
    error: true
});
