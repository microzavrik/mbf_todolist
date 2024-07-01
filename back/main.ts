import express from 'express';
import authRouter from './routes/userAccountRouter';


const app = express();
app.use(express.json());

app.use('/api/account', authRouter);


app.listen(3000, () => {
    console.log('☃️  - [server]: Server is running on port 3000');
});