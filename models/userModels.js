import { db } from "../db.js";

const checkAuth = async (username) => {
  const [result] = await db.execute(`SELECT * FROM users WHERE username = ?`, [username]);
  // console.log(result)
  return result;
};

const userModel = { checkAuth };

export default userModel;
