const config = require('./ server-conf.json');
const express = require('express');
const router = require('./routers/router');

const app = express();
app.use(express.json());
app.use(router);


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

app.listen(config.port, err => {
  if (err) {
    console.log(err);
  }
  console.log('listen port', config.port);
});
