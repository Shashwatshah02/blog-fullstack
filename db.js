import mysql from 'mysql2/promise';

// Create a MySQL connection pool
export const db = mysql.createPool({
    host: 'localhost',    // Replace with your host (e.g., '127.0.0.1' or 'localhost')
    user: 'root',         // Replace with your MySQL username
    password: '',     // Replace with your MySQL password
    database: 'blog',     // Replace with your database name
    connectionLimit: 10   // Limit for concurrent connections
});

// Function to get a connection
export const getConnection = async () => {
    try {
        const connection = await db.getConnection();
        return connection;
    } catch (err) {
        console.error('Error getting database connection:', err);
        throw err;
    }
};
