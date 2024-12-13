const validateTransaction = (req, res, next) => {
    const { amount, type, category } = req.body;

    // Check if amount exists and is a number
    if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: 'Amount is required and must be a number' });
    }

    // Check if type is valid
    if (!['credit', 'debit', 'transfer'].includes(type)) {
        return res.status(400).json({ message: 'Invalid transaction type' });
    }

    // Check if category exists
    if (!category) {
        return res.status(400).json({ message: 'Category is required' });
    }

    next();
};

const validateUser = (req, res, next) => {
    const { username, initialBalance } = req.body;

    // Check username
    if (!username || username.trim() === '') {
        return res.status(400).json({ message: 'Username is required' });
    }

    // Check initial balance if provided
    if (initialBalance && isNaN(initialBalance)) {
        return res.status(400).json({ message: 'Initial balance must be a number' });
    }

    next();
};

module.exports = {
    validateTransaction,
    validateUser
};