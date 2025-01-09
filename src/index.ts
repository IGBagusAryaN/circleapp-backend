import express, { Request, Response } from 'express';
import router from './routes/v2/index.route';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use('/api', router);

app.get('/', (req, res) => {
  res.json({
    message: 'Hello worldddddddd',
  });
});

app.listen(port, () => {
  console.log(`Typescript Express app listening on port ${port}`);
});
