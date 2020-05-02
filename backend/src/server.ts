import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import express from 'express';
import path from 'path';

import { router } from './routers/router';
import { Request, Response } from 'express-serve-static-core';
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', router);

app.use((req: Request, res: Response) => {
  res.status(404);

  if (req.accepts("html")) {
    res.send("<h1>404 Not found</h1>");
    return;
  }
  if (req.accepts("application/json")) {
    res.json({ error: "Not found" });
    return;
  }
  res.type("txt").send("Not found");
}
);


app.listen(process.env.PORT, () => {
  console.log('listen port', process.env.PORT);
});
export { app };