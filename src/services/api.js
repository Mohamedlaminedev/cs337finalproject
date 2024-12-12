const API_URL = 'http://localhost:5001/api';

const api = {

    signup: async (username, initialBalance) => {
        const response = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username, 
                initialBalance: Number(initialBalance) 
            }),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        return data;
    },

    login: async (username) => {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    },
    

    addTransaction: async (userId, transaction) => {
        const response = await fetch(`${API_URL}/transactions/addTransaction`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userId,
                amount: Number(transaction.amount),
                type: transaction.type,
                category: transaction.category,
                description: transaction.description,
                incomeSource: transaction.incomeSource,
                date: transaction.date
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add transaction');
        }
        return data;
    },

    getTransactions: async (userId) => {
        const response = await fetch(`${API_URL}/transactions/${userId}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch transactions');
        }
        return data;
    },

    getLeaderboard: async () => {
        const response = await fetch(`${API_URL}/users/leaderboard`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch leaderboard');
        }
        return data;
    },

    getRecent: async () => {
        const response = await fetch(`${API_URL}/transactions/recent`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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
