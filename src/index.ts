import express, { Request, Response } from 'express';
import router from './routes/v2/index.route';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: ['http://localhost:3000', 'https://circle-app-socialmedia.vercel.app'],
  credentials: true,
}));
app.use(express.json());
// app.use(cors({ origin: "https://circle-app-socialmedia.vercel.app" }));

app.use('/api', router);

app.get('/', (req, res) => {
  res.json({
    message: 'bagus aryaaaaaaaaaa',
  });
});

app.listen(port, () => {
  console.log(`Typescript Express app listening on port ${port}`);
});
