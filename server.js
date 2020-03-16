require('dotenv').config();
const express = require('express');
const path = require('path');

const router = require('./routers/router');
const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', router);

app.use((req, res) => {
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


app.listen(process.env.PORT, err => {
  if (err) {
    console.log(err);
  }
  console.log('listen port', process.env.PORT);
});
