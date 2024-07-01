import express, { Request, Response } from 'express';
import { 
  createTask, 
  getTaskById, 
  getAllTasksByUsername,
  updateTask,
  deleteTask,
  markTaskAsAccomplished,
  markTaskAsUnfulfilled
} from '../db_repository/todoItemRepository';
import { UserToDoTask } from '../models/userToDoTask';

const router = express.Router();

router.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const task: UserToDoTask = req.body;
    const newTask = await createTask(task);
    res.status(201).json(newTask);
  } 
  catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);
    const task = await getTaskById(taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } 
  catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string;
    const tasks = await getAllTasksByUsername(username);
    res.json(tasks);
  } 
  catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);
    const updates: Partial<UserToDoTask> = req.body;
    const updatedTask = await updateTask(taskId, updates);
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } 
  catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);
    await deleteTask(taskId);
    res.status(204).end();
  } 
  catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/api/tasks/accomplished', async (req: Request, res: Response) => {
  try {
    const { username, taskName } = req.body;
    const updatedTask = await markTaskAsAccomplished(username, taskName);
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } 
  catch (error) {
    console.error('Error marking task as accomplished:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/api/tasks/unfulfilled', async (req: Request, res: Response) => {
  try {
    const { username, taskName } = req.body;
    const updatedTask = await markTaskAsUnfulfilled(username, taskName);
    if (updatedTask) {
      res.json(updatedTask);
    } 
    else {
      res.status(404).json({ message: 'Task not found' });
    }
  } 
  catch (error) {
    console.error('Error marking task as unfulfilled:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
