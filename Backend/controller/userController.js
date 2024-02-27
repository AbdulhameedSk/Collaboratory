const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Fill All Details",
      });
    }

    const present = await userModel.findOne({ email });
    if (present) {
      return res.status(400).json({
        success: false,
        msg: "User Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ username, email, password: hashedPassword });
    await user.save();
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in registerController:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to register user" });
  }
};

const getAllUsers = async (req, res) => {
  const getting = await userModel.find({});
  res.status(200).send({
    success: true,
    userCount: getting.length,
    JSON: getting,
  });
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        msg: "Fill all Credientials",
      });
    }
    const user = await userModel.findOne({ email });
    if (!email) {
      return res.status(400).send({
        msg: "Invalid Email",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        msg: "Invalid Password",
      });
    }
    return res.status(200).json({
      success:true,
      user
    });
  } catch (error) {
    res.status(500).send({
      msg: "error in login",
    });
  }
};

module.exports = {
  getAllUsers,
  registerController,
  loginController,
};