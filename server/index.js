import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('connected to mongodb');
}).catch((err) => {
  console.log(err)
})


const app = express();

const port = 3000

app.listen(port, () => {
  console.log(`listening on port ${port} !!`);
});