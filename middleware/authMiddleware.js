import { User } from "../model/userSchema.js";
import jwt from "jsonwebtoken";

export const checkUserAuth = async (req, resp, next) => {
    let token
  const { authorization } = req.headers;
  console.log('auth',authorization);
  if (authorization && authorization.startsWith("Bearer")) {
    try {
     token = authorization.split(" ")[1];
     console.log('tokenn',token)
      //verifying token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log('userid',userID)

      //getting token from user
      req.user = await User.findById(userID).select('-password');
      console.log('userid',req.user)
      next();
    } catch (error) {
      console.log("error", error.message);
      resp.status(401).send({ message: "Unauthorized user" });
    }
  }
  if(!token){
    resp.status(401).send({ message: "Unauthorized,no token received" });

  }
};
