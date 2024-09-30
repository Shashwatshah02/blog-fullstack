import User from "../models/userModels.js";
import { generateToken } from "../jwt.js";

const userController = {
  checkAuth: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.checkAuth(username);
      // console.log(password);
      // console.log(username);
      // console.log(user);
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      if (!user[0]) {
        // Username not found
        return res
          .status(400)
          .render("login", { error: "Username does not exist" });
      }

      // Check if the password matches
      if (user[0].password === password) {
        return res.redirect("/api/blogs/all");
        // const token = generateToken(user);
        // res.json({ token });
      } else {
        // Password is incorrect
        return res.status(401).render("login", { error: "Incorrect password" });
      }
    } catch (error) {
      // Handle any server-side errors
      // console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default userController;
