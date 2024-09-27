import Blog from "../models/blogModels.js";

const blogController = {
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await Blog.getAllBlogs();
      res.render("posts", { posts: blogs });
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
      res.render("blogDetail", { blog: blog[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getCreateBlogPage: async (req, res) => {
    try {
      const categories = await Blog.getAllCategories();
      res.render("newPost", { categories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createBlog: async (req, res) => {
    try {
      const { title, content, categoryId } = req.body;

      if (title === undefined || content === undefined) {
        return res.status(400).json({ error: "All fields are required" });
      }

      await Blog.createBlog(title, content, categoryId);
      // res.status(201).json({ id: result.insertId, title, content, categoryId });
      res.redirect("/api/blogs/all");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
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
      if (blog, categories) {
        // console.log(blog[0])
        console.log(categories)
        res.render("editBlog", { blog: blog[0], categories: categories});
      } else {
        res.status(404).json({ message: "Blog post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateBlog: async (req, res) => {
    const blogId = req.params.id;
    const { title, content, categoryId } = req.body;
    try {
      await Blog.updateBlog(blogId, { title, content, categoryId });
      res.redirect("/api/blogs/all"); // Redirect to all blogs after successful update
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // You can add more controller functions here as needed
};

export default blogController;
