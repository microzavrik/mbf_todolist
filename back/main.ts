import express from 'express';
import authRouter from './routes/userAccountRouter';
import todoItemRouter from "./routes/userToDoRouter";


const app = express();
app.use(express.json());

app.use('/api/account', authRouter);
app.use('/api/items', todoItemRouter);


app.listen(3000, () => {
    console.log('☃️  - [server]: Server is running on port 3000');
});