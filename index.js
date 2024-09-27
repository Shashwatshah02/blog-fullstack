import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { getConnection } from "./db.js"; // Importing the connection function
// import userRoutes from "./routes/userRoutes.js"
import { fileURLToPath } from 'url';
import blogRoutes from "./routes/blogRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json()); // Allows parsing JSON in request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Test route to check if the server is running
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

//Serve static files using Express
 // Serve uploaded images

// app.get('/api/users', userRoutes)
app.use("/api/blogs", blogRoutes);

// // A route to fetch users from the MySQL database
// app.get('/users', async (req, res) => {
//     try {
//         const connection = await getConnection(); // Get a connection from the pool
//         const [rows] = await connection.query('SELECT * FROM users'); // Query the database
//         connection.release(); // Release the connection back to the pool
//         res.json(rows); // Send the results back to the client
//     } catch (err) {
//         console.error('Error retrieving users:', err);
//         res.status(500).json({ error: 'Database query failed' });
//     }
// });

// Start the server
app.listen(8800, () => {
  console.log("Server running on port 8800");
});
