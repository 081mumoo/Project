// File: frontend/database.js

class Database {
    constructor() {
        // Ensure this matches your backend port (server.js says 3000)
        this.API_URL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('token');
    }

    // --- Helper for API Requests ---
    async apiCall(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Attach token if user is logged in
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${this.API_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'API Request Failed');
            }

            return data;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    // --- Authentication ---
    async register(userData) {
        // userData = { name, email, password }
        const result = await this.apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        // Save session
        this.token = result.token;
        localStorage.setItem('token', result.token);
        return result.user;
    }

    async login(email, password) {
        const result = await this.apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        // Save session
        this.token = result.token;
        localStorage.setItem('token', result.token);
        return result.user;
    }

    async logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    }

    // --- Pets (Example of other methods) ---
    async getPets() {
        return this.apiCall('/pets');
    }

    async addPet(petData) {
        return this.apiCall('/pets', {
            method: 'POST',
            body: JSON.stringify(petData)
        });
    }
}

// Make it globally available
window.database = new Database();