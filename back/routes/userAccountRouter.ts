import express, { Request, Response } from "express";
import { registerUser, authenticateUser, getAllUsers } from "../db_repository/userAccountRepository";
import { refreshToken } from "../jwt/refreshToken";
import logger, {isLoggingEnabled} from "../logger";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    await registerUser(username, email, password);
    const result = await authenticateUser(username, password);
    if (result?.user) {
      if (isLoggingEnabled) {
        logger.info(`User registered successfully. Token: ${result.token}, User: ${JSON.stringify(result.user)}`);
      }
      res.status(201).json({ message: `User registered successfully\nToken: ${result.token}\nUser: ${JSON.stringify(result.user)}`, user: result.user, token: result.token });
    } else {
      if (isLoggingEnabled) {
        logger.error("Registration failed");
      }
      res.status(400).json({ message: "Registration failed" });
    }
  } catch (error) {
    if (isLoggingEnabled) {
      logger.error("Error registering user", error);
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await authenticateUser(username, password);
    if (result?.user) {
      if (isLoggingEnabled) {
        logger.info(`Login successful. Token: ${result.token}, User: ${JSON.stringify(result.user)}`);
      }
      res.status(200).json({ message: `Login successfully\nToken: ${result.token}\nUser: ${JSON.stringify(result.user)}`, user: result.user, token: result.token });
    } else {
      if (isLoggingEnabled) {
        logger.warn("Invalid username or password");
      }
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    if (isLoggingEnabled) {
      logger.error("Error authenticating user", error);
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
