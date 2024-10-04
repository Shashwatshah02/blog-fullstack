import Blog from "../models/blogModels.js";
import multer from "multer";
import path from "path";
import axios from "axios";
import { getConnection, db } from "../db.js"; // Importing the connection function
const apiKey = "d7ff08a7ead34e6896929146fa9ac228";

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Accepted file types
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
}).single("image");

const blogController = {
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await Blog.getAllBlogs();
      res.render("posts", { posts: blogs, layout: false });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getBlogById: async (req, res) => {
    try {
      const blogId = req.params.id;
      const blog = await Blog.getBlogById(blogId); // Fetch blog by its ID

      if (!blog) {
        return res.status(404).send("Blog post not found");
      }
      // console.log(blog[0])
      res.render("blogDetail", { blog: blog[0], layout: false });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getCreateBlogPage: async (req, res) => {
    try {
      const categories = await Blog.getAllCategories();
      res.render("newPost", { categories: categories, layout: false });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createBlog: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      console.log(req.file);
      const { title, content, categoryId } = req.body;
      const imageUrl = req.file ? req.file.path : null;
      console.log(imageUrl);
      try {
        if (title === undefined || content === undefined) {
          return res.status(400).json({ error: "All fields are required" });
        }
        if (!imageUrl) {
          return res.status(400).json({ error: "Image upload is required!" });
        }
        await Blog.createBlog(title, content, categoryId, imageUrl);
        // res.status(201).json({ id: result.insertId, title, content, categoryId });
        res.redirect("/api/blogs/all");
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  },
  deleteBlogbyId: async (req, res) => {
    const blogId = req.params.id;
    try {
      await Blog.deleteBlogById(blogId); // Assuming you have this method in your Blog model
      res.redirect("/api/blogs/all");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getEditBlog: async (req, res) => {
    const blogId = req.params.id;
    try {
      const blog = await Blog.getBlogById(blogId);
      const categories = await Blog.getAllCategories();
      if ((blog, categories)) {
        // console.log(blog[0])
        console.log(categories);
        res.render("editBlog", { blog: blog[0], categories: categories, layout: false });
      } else {
        res.status(404).json({ message: "Blog post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateBlog: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      const blogId = req.params.id;
      console.log(req.file);
      const { title, content, categoryId } = req.body;
      const imageUrl = req.file ? req.file.path : null;
      console.log(imageUrl);
      try {
        await Blog.updateBlog(blogId, { title, content, categoryId, imageUrl });
        res.redirect("/api/blogs/all"); // Redirect to all blogs after successful update
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  },
  getAllCategories: async (req, res) => {
    try {
      const categories = await Blog.getAllCategories();
      console.log(categories);
      res.render("categories", { categories: categories, layout: false });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  addCategories: async (req, res) => {
    const { categoryName } = req.body;
    console.log(categoryName);
    try {
      if (categoryName === undefined) {
        return res.status(400).json({ error: "No category added" });
      }
      await Blog.addCategories(categoryName);
      // res.status(201).json({ id: result.insertId, title, content, categoryId });
      res.redirect("/api/blogs/categories");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteCategorybyId: async (req, res) => {
    const categoryId = req.params.id;
    try {
      await Blog.deleteCategoryById(categoryId); // Assuming you have this method in your Blog model
      res.redirect("/api/blogs/categories");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getEverything: async (req, res) => {
    const blogs = await Blog.getAllBlogs();
    const categories = await Blog.getAllCategories();
    // console.log(blogs)
    res.render("home", { title: 'Home', blogs: blogs, categories: categories });
  },
  getAbout: async (req, res) => {
    const blogs = await Blog.getAllBlogs();
    const categories = await Blog.getAllCategories();
    // console.log(blogs)
    res.render("about", { title: 'About', blogs: blogs, categories: categories });
  },
  getContact: async (req, res) => {
    const blogs = await Blog.getAllBlogs();
    const categories = await Blog.getAllCategories();
    // console.log(blogs)
    res.render("contact", { title: 'Contact', blogs: blogs, categories: categories });
  },
  getSelectedCategory: async (req, res) => {
    const category = req.params.name;
    const categories = await Blog.getAllCategories();
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${category}&pageSize=10&apiKey=${apiKey}`
    );
    console.log(response.data.articles);
    const articles = response.data.articles;
    const batchSize = 10; // Number of records per batch
    const batches = [];

    // Break the articles array into batches
    for (let i = 0; i < articles.length; i += batchSize) {
      batches.push(articles.slice(i, i + batchSize));
    }
    const categoryId = categories.find(cat => cat.categoryName.toLowerCase() === category.toLowerCase())?.categoryId;
    console.log(categories);
    console.log(category); // Check what this logs

    if (!categoryId) {
      console.error("Category ID not found for category:", category);
      return res.status(404).send("Category not found");
    }
    // Insert each batch into the database
    batches.forEach((batch, index) => {
      const values = batch
        .filter((article) => article.title !== '[Removed]') // Filter out articles with title "[Removed]"
        .map((article) => [
          article.title,
          article.description,
          categoryId,
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
    // console.log(blogs)
    res.render("category", { title: category, blogs: response.data.articles, categories: categories });
  }
};
// You can add more controller functions here as needed
export default blogController;
