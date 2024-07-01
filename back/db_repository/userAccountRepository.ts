import { QueryResult } from "pg";
import { hashPassword } from "../utils/hash";
import { generateRandomString } from "../utils/generateRandomString";
import { client } from "../database/db";
import { config } from "../config";
import { UserAccount } from "../models/userAccount";
import jwt from "jsonwebtoken"

export async function registerUser(username: string, email: string, password: string) : Promise<UserAccount | null> {
    try {
        let newUser = await createUser(username, email);
        newUser = await passwordUserHash(newUser, password);
        await addUser(newUser);
        return newUser;
    }
    catch(error) {
        console.error("Error registering user: ", error);
        return null;
    }
};

export async function addUser(user: UserAccount) : Promise<void> {
    try {
        const query = `
        INSERT INTO users (username, email, password_hash, password_salt)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
        const values = [user.username, user.email, user.password_hash, user.password_salt];
        const result: QueryResult<UserAccount> = await client.query(query, values);

        if (result.rowCount === 1) {
            console.log('User added successfully');
        } 
        else {
            console.error('Failed to add user');
        }
    } 
    catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export async function authenticateUser(username: string, password: string): Promise<{ user: UserAccount; token: string } | null> {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result: QueryResult<UserAccount> = await client.query(query, [username]);

    if (result.rowCount === 1) {
      const user = result.rows[0];
      const hashedPassword = await hashPassword(user.password_salt + password);

      if (hashedPassword.hash === user.password_hash) {
        const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });
        return { user, token };
      }
       else {
        console.error('Invalid password');
        return null;
      }
    } 
    else {
      console.error('User not found');
      return null;
    }
  } 
  catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

export async function createUser(username: string, email: string) : Promise<UserAccount> {
    try {
        const passwordSalt = await generateRandomString(5, 10);

        return {
            username,
            email,
            password_hash: '',
            password_salt: passwordSalt
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export async function passwordUserHash(user: UserAccount, password_for_hash: string) : Promise<UserAccount> {
    try {
        const result = await hashPassword(user.password_salt + password_for_hash);
        user.password_hash = result.hash;
        return user;
    } 
    catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};
  
export async function getUserById(id: number): Promise<UserAccount | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result: QueryResult<UserAccount> = await client.query(query, [id]);
  
    if (result.rowCount === 1) {
      return result.rows[0];
    } 
    else {
      return null;
    }
};
  
export async function getAllUsers(): Promise<UserAccount[]> {
    const query = 'SELECT * FROM users';
    const result: QueryResult<UserAccount> = await client.query(query);
    return result.rows;
};
  

export async function updateUser(id: number, updates: Partial<UserAccount>): Promise<UserAccount | null> {
    const query = `
      UPDATE users
      SET username = COALESCE($1, username),
          email = COALESCE($2, email),
          password_hash = COALESCE($3, password_hash),
          password_salt = COALESCE($4, password_salt)
      WHERE id = $5
      RETURNING *
    `;
    const values = [updates.username, updates.email, updates.password_hash, updates.password_salt, id];
  
    const result: QueryResult<UserAccount> = await client.query(query, values);
  
    if (result.rowCount === 1) {
      return result.rows[0];
    } 
    else {
      return null;
    }
};
  

export async function deleteUser(id: number): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    await client.query(query, [id]);
};