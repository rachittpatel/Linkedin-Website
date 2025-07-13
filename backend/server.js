import express from 'express';
import { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config({ path: '../.env' });

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads'))


app.use(postRoutes);
app.use(userRoutes);

//app.use(express.json());



const start = async () => {


  const connectDB = await mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

  app.listen(9080, () => {
    console.log('Server is running on port 9080');
  })
}

start();