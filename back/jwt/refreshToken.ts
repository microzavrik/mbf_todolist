import { Request, Response } from "express";
import jwt, { JwtPayload, JsonWebTokenError } from "jsonwebtoken";
import { config } from "../config";
import { getUserById } from "../db_repository/userAccountRepository";

export async function refreshToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        console.log("UserId: ", decoded);
        const userId = decoded.id;
  
        const user = await getUserById(userId);
        if (user) {
          const newToken = jwt.sign({ userId: user.id }, config.jwtSecret, {
            expiresIn: "1h",
          });
          return res.json({ token: newToken });
        }
  
        return res.status(401).json({ message: "Invalid token" });
      } catch (err) {
        if (err instanceof JsonWebTokenError) {
          return res.status(401).json({ message: "Invalid token" });
        } 
        else {
          console.error("Error refreshing token:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
      }
    } 
    catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};