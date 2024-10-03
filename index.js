import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import axios from "axios";
import Parser from "rss-parser";
import session from "express-session";
import { getConnection, db } from "./db.js"; // Importing the connection function
import userRoutes from "./routes/userRoutes.js";
import { fileURLToPath } from "url";
import blogRoutes from "./routes/blogRoutes.js";
import blogController from "./controller/blogController.js";
const apiKey = "d7ff08a7ead34e6896929146fa9ac228";
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
app.use(
  session({
    secret: "your-secret-key", // Replace with your own secret key
    resave: false, // Don't save session if it hasn't been modified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: { maxAge: 60000 }, // Session expiration time (optional, 60 seconds in this example)
  })
);

app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});
// app.get("/", async (req, res) => {
//     res.render("home");
// });
app.get("/about", async (req, res) => {
  res.render("about");
});
app.get('/contact', async (req, res) => {
  res.render('contact');
});
app.get("/", blogController.getEverything);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
    } else {
      res.redirect('api/users/login'); // Redirect to login page after logging out
    }
  });
});

// A route to fetch users from the MySQL database
app.post("/", async (req, res) => {
  try {
    // Fetch news articles
    const articles = await fetchNews();
    // Insert news articles into the database
    insertBatch(articles);

    // Respond with a success message
    res.json({ message: "News articles fetched and inserted successfully!" });
  } catch (error) {
    console.error("Error fetching news or inserting:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch and insert news articles." });
  }
});
async function fetchNews() {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=technology&pageSize=100&apiKey=${apiKey}`
    );
    console.log(response.data.articles);
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
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
    const values = batch.map((article) => [
      article.title,
      article.description,
      1,
      article.urlToImage,
    ]);

    const sql = `INSERT INTO blogs (title, content, categoryId, imageUrl) VALUES ?`;

    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error inserting batch:", err);
      } else {
        console.log(`Batch ${index + 1} inserted successfully!`);
      }
    });
  });
}

// Start the server
app.listen(8800, () => {
  console.log("Server running on port 8800");
});
