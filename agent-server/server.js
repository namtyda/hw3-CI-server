const config = require('./agent-conf.json');
const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('ok');
})
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

const port = process.argv[2] || config.port;

app.listen(port, err => {
  if (err) {
    console.log(err)
  }
  console.log('listen port', port);
});
