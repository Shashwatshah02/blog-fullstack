import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import axios from 'axios';
import Parser from 'rss-parser';
import { getConnection, db } from "./db.js"; // Importing the connection function
import userRoutes from "./routes/userRoutes.js";
import { fileURLToPath } from "url";
import blogRoutes from "./routes/blogRoutes.js";
const apiKey = 'd7ff08a7ead34e6896929146fa9ac228';
const parser = new Parser();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json()); // Allows parsing JSON in request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Test route to check if the server is running

//Serve static files using Express
// Serve uploaded images

app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});
// app.get("/", async (req, res) => {
//     res.render("home");
// });
app.get("/about", async (req, res) => {
  res.render("about");
});
app.use("/", blogRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
// A route to fetch users from the MySQL database
app.get('/users', async (req, res) => {
    try {
        const connection = await getConnection(); // Get a connection from the pool
        const [rows] = await connection.query('SELECT * FROM users'); // Query the database
        connection.release(); // Release the connection back to the pool
        res.json(rows); // Send the results back to the client
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

async function fetchNews() {
  try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=technology&pageSize=100&apiKey=${apiKey}`);
      console.log(response.data.articles)
      return response.data.articles;
  } catch (error) {
      console.error('Error fetching news:', error);
  }
}
// Function to insert data in batches
function insertBatch(articles) {
  const batchSize = 10; // Number of records per batch
  const batches = [];

  // Break the articles array into batches
  for (let i = 0; i < articles.length; i += batchSize) {
      batches.push(articles.slice(i, i + batchSize));
  }

  // Insert each batch into the database
  batches.forEach((batch, index) => {
      const values = batch.map(article => [
          article.title,
          article.description,
          1,
          article.url,
      ]);

      const sql = `INSERT INTO blogs (title, content, categoryId, imageUrl) VALUES ?`;

      db.query(sql, [values], (err, result) => {
          if (err) {
              console.error('Error inserting batch:', err);
          } else {
              console.log(`Batch ${index + 1} inserted successfully!`);
          }
      });
  });
}

// Fetch and insert news articles
// fetchNews().then(articles => {
//   insertBatch(articles);
// });



// Start the server
app.listen(8800, () => {
  console.log("Server running on port 8800");
});
