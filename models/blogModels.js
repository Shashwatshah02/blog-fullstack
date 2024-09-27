import { db } from "../db.js";

const getAllBlogs = async () => {
  const [result] = await db.execute(`
  SELECT blogs.blogId, blogs.title, blogs.content, categories.categoryName
  FROM blogs
  JOIN categories ON blogs.categoryId = categories.categoryId
`);
  return result;
};

const createBlog = async (title, content, categoryId)=>{
  const [result] = await db.execute("INSERT INTO blogs (title, content, categoryId) VALUES (?, ?, ?)", [title, content, categoryId])
  return result;
 }

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

const deleteBlogById = async(blogId) =>{
  try {
    // Execute the DELETE query
    const [result] = await db.query('DELETE FROM blogs WHERE blogId = ?', [blogId]);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
        throw new Error('Blog post not found.'); // If no rows were affected, the blog ID does not exist
    }

    return result; // Return the result for any additional handling if needed
} catch (error) {
    // Handle any errors
    throw new Error('Error deleting the blog post: ' + error.message);
}
}
const updateBlog = async (blogId, updatedBlog) => {
  const {title, content, categoryId} = updatedBlog
  const [result] = await db.execute('UPDATE blogs SET title = ?, content = ?, categoryId = ? WHERE blogId = ?', [title, content, categoryId, blogId]);
  return result;
}

// Exporting the function inside an object as the default export
const blogModel = { getAllBlogs, createBlog, getAllCategories, getBlogById, deleteBlogById, updateBlog };

export default blogModel;
