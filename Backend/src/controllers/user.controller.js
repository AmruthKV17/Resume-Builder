import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim() == "")) {
      // throw new ApiError(402,"All fields are mandatory!")
      return res
        .status(402)
        .json({ success: false, message: "All fields are mandatory!" });
    }
    // Check user alreaady exists
    const userExists = await User.findOne({
      $or: [{ email }, { name }],
    });
    if (userExists) {
      return res.status(409).json({ message: "User Already exists!" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be atleast 8 characters long.",
        });
    }

    // Hashing the password
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
    });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while registering the User!",
      });
    }
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error,
    });
  }
};

const loginUser = async (req, res) => {
  /* 1. Check for name and email field provided
       2. Check for user already exist , if not send him to register 
       3. Validate the password
       4. Generate access token and set it in the cookie 
       5. Return user details along with sucess msg
    */
  try {    
    const { name, email, password } = req.body;
    if ([name, email, password].some((field) => field?.trim() == "")) {
      // throw new ApiError(402,"All fields are mandatory!")
      return res
        .status(402)
        .json({ success: false, message: "All fields are mandatory!" });
    }
    const user = await User.findOne({
      $or: [{ name }, { email }],
    });
        
    if (!user) {
      return res.status(400).json({
        message: "User doesn't exists. Register before login",
      });
    }
    const isPassValid = await user.isPasswordCorrect(password);

    

    if (!isPassValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid user credentials.",
      });
    }
    const token = generateToken(user._id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error,
    });
  }
};

export { registerUser, loginUser, getUserProfile };
