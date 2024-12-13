const API_URL = 'http://localhost:5001/api';

const api = {
    // User Signup
    signup: async (username, initialBalance) => {
        const response = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username, 
                initialBalance: Number(initialBalance),
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        return data;
    },

    // User Login
    login: async (username) => {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    },

    // Add Transaction
    addTransaction: async (userId, transaction) => {
        // Build the transaction payload based on the type
        const payload = {
            userId,
            amount: Number(transaction.amount),
            type: transaction.type,
            category: transaction.category || null,
        };

        // Add recipientUsername only for transfer transactions
        if (transaction.type === 'transfer') {
            if (!transaction.recipientUsername) {
                throw new Error('Recipient username is required for transfer transactions.');
            }
            payload.recipientUsername = transaction.recipientUsername;
        }

        const response = await fetch(`${API_URL}/transactions/addTransaction`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add transaction');
        }
        return data;
    },

    // Fetch Transactions
    getTransactions: async (userId) => {
        const response = await fetch(`${API_URL}/transactions/${userId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch transactions');
        }
        return data;
    },

    // Fetch Leaderboard
    getLeaderboard: async () => {
        const response = await fetch(`${API_URL}/users/leaderboard`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch leaderboard');
        }
        return data;
    },

    // Fetch Recent Transactions
    getRecent: async () => {
        const response = await fetch(`${API_URL}/transactions/recent`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch recent transactions');
        }
        return data;
    }
};

export default api;
