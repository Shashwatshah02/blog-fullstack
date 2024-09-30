import { db } from "../db.js";

const getAllBlogs = async () => {
  const [result] = await db.execute(`
  SELECT blogs.blogId, blogs.title, blogs.content, blogs.imageUrl, categories.categoryName, categories.categoryId
  FROM blogs
  JOIN categories ON blogs.categoryId = categories.categoryId
`);
  return result;
};

const createBlog = async (title, content, categoryId, imageUrl) => {
  const [result] = await db.execute(
    "INSERT INTO blogs (title, content, categoryId, imageUrl) VALUES (?, ?, ?, ?)",
    [title, content, categoryId, imageUrl]
  );
  return result;
};

const addCategories = async (categoryName) => {
  const [result] = await db.execute(
    "INSERT INTO categories (categoryName) VALUES (?)",
    [categoryName]
  );
  return result;
};

const getAllCategories = async () => {
  const [result] = await db.execute("SELECT * FROM categories");
  return result;
};
const getBlogById = async (blogId) => {
  const query = `SELECT blogs.*, categories.categoryName 
                 FROM blogs 
                 INNER JOIN categories ON blogs.categoryId = categories.categoryId 
                 WHERE blogs.blogId = ?`;

  return db.query(query, [blogId]);
};

const deleteBlogById = async (blogId) => {
  try {
    // Execute the DELETE query
    const [result] = await db.query("DELETE FROM blogs WHERE blogId = ?", [
      blogId,
    ]);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      throw new Error("Blog post not found."); // If no rows were affected, the blog ID does not exist
    }

    return result; // Return the result for any additional handling if needed
  } catch (error) {
    // Handle any errors
    throw new Error("Error deleting the blog post: " + error.message);
  }
};
const updateBlog = async (blogId, updatedBlog) => {
  const { title, content, categoryId, imageUrl } = updatedBlog;
  const [result] = await db.execute(
    "UPDATE blogs SET title = ?, content = ?, categoryId = ?, imageUrl = ? WHERE blogId = ?",
    [title, content, categoryId, imageUrl, blogId]
  );
  return result;
};
const deleteCategoryById = async (categoryId) => {
  try {
    // Execute the DELETE query
    const [result] = await db.query(
      "DELETE FROM categories WHERE categoryId = ?",
      [categoryId]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      throw new Error("Blog post not found."); // If no rows were affected, the blog ID does not exist
    }

    return result; // Return the result for any additional handling if needed
  } catch (error) {
    // Handle any errors
    throw new Error("Error deleting the blog post: " + error.message);
  }
};
// Exporting the function inside an object as the default export
const blogModel = {
  getAllBlogs,
  createBlog,
  getAllCategories,
  getBlogById,
  deleteBlogById,
  updateBlog,
  addCategories,
  deleteCategoryById,
};

export default blogModel;
