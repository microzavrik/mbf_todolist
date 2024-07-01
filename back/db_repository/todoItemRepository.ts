import { QueryResult } from 'pg';
import { client } from '../database/db';
import { UserToDoTask } from '../models/userToDoTask';  

export async function createTask(task: UserToDoTask): Promise<UserToDoTask> {
  const query = `
    INSERT INTO user_todo_tasks (username, task_name, task_start_day, task_end_day, task_status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [task.username, task.task_name, task.task_start_day, task.task_end_day, task.task_status];

  const result: QueryResult<UserToDoTask> = await client.query(query, values);
  return result.rows[0];
};


export async function getTaskById(id: number): Promise<UserToDoTask | null> {
  const query = 'SELECT * FROM user_todo_tasks WHERE id = $1';
  const result: QueryResult<UserToDoTask> = await client.query(query, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  } else {
    return null;
  }
};

export async function getAllTasksByUsername(username: string): Promise<UserToDoTask[]> {
  const query = 'SELECT * FROM user_todo_tasks WHERE username = $1';
  const result: QueryResult<UserToDoTask> = await client.query(query, [username]);
  return result.rows;
};


export async function updateTask(id: number, updates: Partial<UserToDoTask>): Promise<UserToDoTask | null> {
  const query = `
    UPDATE user_todo_tasks
    SET username = COALESCE($1, username),
        task_name = COALESCE($2, task_name),
        task_start_day = COALESCE($3, task_start_day),
        task_end_day = COALESCE($4, task_end_day),
        task_status = COALESCE($5, task_status)
    WHERE id = $6
    RETURNING *
  `;
  const values = [updates.username, updates.task_name, updates.task_start_day, updates.task_end_day, updates.task_status, id];

  const result: QueryResult<UserToDoTask> = await client.query(query, values);

  if (result.rowCount === 1) {
    return result.rows[0];
  } 
  else {
    return null;
  }
};


export async function deleteTask(id: number): Promise<void> {
  const query = 'DELETE FROM user_todo_tasks WHERE id = $1';
  await client.query(query, [id]);
};

export async function markTaskAsAccomplished(username: string, taskName: string): Promise<UserToDoTask | null> {
    const query = `
      UPDATE user_todo_tasks
      SET task_status = 'accomplished'
      WHERE username = $1 AND task_name = $2
      RETURNING *
    `;
    const values = [username, taskName];
  
    const result: QueryResult<UserToDoTask> = await client.query(query, values);
  
    if (result.rowCount === 1) {
      return result.rows[0];
    } 
    else {
      return null;
    }
};
  

export async function markTaskAsUnfulfilled(username: string, taskName: string): Promise<UserToDoTask | null> {
    const query = `
      UPDATE user_todo_tasks
      SET task_status = 'unfulfilled'
      WHERE username = $1 AND task_name = $2
      RETURNING *
    `;
    const values = [username, taskName];
  
    const result: QueryResult<UserToDoTask> = await client.query(query, values);
  
    if (result.rowCount === 1) {
      return result.rows[0];
    } 
    else {
      return null;
    }
};