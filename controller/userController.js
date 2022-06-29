import { User } from "../model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { STATUSES } from "../constants/status.js";
import transporter from "../config/emailConfig.js";

//sign up for user
export const signup = async (req, resp) => {
  try {
    const { name, email, username, password, phone } = req.body;
    const user = await User.findOne({ email: email });
    const regPhone = await User.findOne({ phone: phone });

    if (user) {
      resp.send({ message: "email already exist" });
    } else if (regPhone) {
      resp.send({ message: "phone already exist" });
    } else {
      if (name && email && password && username && phone) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: hashedPassword,
            phone: phone,
          });
          await newUser.save();
          //jwt token
          const savedUser = await User.findOne({ email: email });
          const token = jwt.sign(
            { userID: savedUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "4d" }
          );
          resp.status(201).json({
            message: "Registration Success",
            user: req.body,
            token: token,
          });
        } catch (error) {
          console.log("error in sign up", error.message);
          console.log("error while signup user", error.message);
        }
      } else {
        resp.send({ message: "all fields are required" });
      }
    }
  } catch (error) {
    console.log("error while signup user", error.message);
  }
};

//login for user
export const login = async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const getUser = await User.findOne({ email: email });
      if (getUser != null) {
        const isPasswordMatch = await bcrypt.compare(
          password,
          getUser.password
        );
        if (getUser.email === email && isPasswordMatch) {
          //jwt token
          const getUser = await User.findOne({ email: email }).select(
            "-password"
          );
          const token = jwt.sign(
            { userID: getUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "4d" }
          );
          resp
            .status(200)
            .json({ message: "login success", token: token, user: getUser });
        } else {
          resp.status(500).json({ message: "email or password is incorrect" });
        }
      } else {
        resp.status(500).json({ message: "you are not a registred user " });
      }
    } else {
      resp.status(500).json({ message: "all fields are required" });
    }
  } catch (error) {
    console.log("error while login user", error.message);
  }
};

//reset password for user
export const resetPassword = async (req, resp) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword && newPassword) {
    const { password } = await User.findById({ _id: req.user._id }).select(
      "password"
    );
  
    const isPasswordMatch = await bcrypt.compare(oldPassword, password);
    console.log("match", isPasswordMatch);

    if (isPasswordMatch) {
      try {
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashedPassword },
        });
        console.log("password changed successfully");
        resp.status(200).send({ messaage: "password changed successfuly" });
      } catch (error) {
        console.log("error  in changing passsword", error.message);
        resp.status(500).send({ messaage: error.message });
      }
    } else {
      console.log("password doesn't match");
      resp.status(500).send({ messaage: "password doesn't match" });
    }
  } else {
    console.log("all fields are required");
    resp.status(500).send({ messaage: "all fields are required" });
  }
  try {
  } catch (error) {
    console.log("error while reset password", error.message);
  }
};

//sending email for forgot password
export const sendForgotPasswordEmail = async (req, resp) => {
  const { email } = req.body;
  if (email) {
    const user = await User.findOne({ email: email }).select("-password");
    console.log(user);
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "5m",
      });
      const link = `http://127.0.0.1:3000/user/resetforgotpassword/${user._id}/${token}`;
      console.log("link", link, user.email);
      try {
        //sending mail
        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Node App: password reset link",
          html: `<a  href=${link}>click here</a>to reset your password`,
        });
        console.log("info", info);
        resp.send({
          status: STATUSES.SUCCESS,
          message: "password reset email sent check your email",
          info: info,
        });
      } catch (error) {
        console.log("error in sending mail", error.message);
      }
    } else {
      resp.send({ message: "email doesn't exist" });
    }
  } else {
    resp.send({ message: "please enter email or phone" });
  }
};

//reseting forgot password
export const resetForgotPasswordEmail = async (req, resp) => {
  const { password } = req.body;
  const { id, token } = req.params;
  const user = await User.findById({ _id: id });
  const newSecret = user._id + process.env.JWT_SECRET_KEY;
  try {
    jwt.verify(token, newSecret);
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(user._id, {
        $set: {
          password: hashedPassword,
        },
      });
      resp.status(200).send({
        status: STATUSES.SUCCESS,
        message: "password reset successfully ",
      });
    } else {
      resp.status(500).send({ message: "please enter password" });
    }
  } catch (error) {
    console.log("error in reset password", error.message);
    resp.status(500).send({ message: "link expired" });
  }
};

//getting logged user detail

export const loggedUser = async (req, resp) => {
  console.log("logged user", req.user);
  resp.status(200).send({ user: req.user });
};
