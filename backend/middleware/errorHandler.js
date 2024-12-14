const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate value not allowed',
            error: 'A record with this value already exists'
        });
    }

    // MongoDB casting error
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid data format',
            error: 'Please check your input data'
        });
    }

    // Default error
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message
    });
};

module.exports = errorHandler;