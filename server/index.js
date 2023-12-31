import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('connected to mongodb');
}).catch((err) => {
  console.log(err)
})


const app = express();
app.use(express.json())

const port = 3000

app.listen(port, () => {
  console.log(`listening on port ${port} !!`);
});

app.use(cookieParser())
app.use('/api' , userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)


// global error handling

app.use((err, req, res, next) => {

  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error';

  res.status(statusCode).json({
    success: false,
    message
  })
} )