const config = require('./agent-conf.json');
const express = require('express');
const agent = require('./controllers/agent');
const app = express();
app.use(express.json());

app.post('/build', (req, res) => {
  agent.build(req.body)
    .then(data => agent.sendResultBuild(data));
  res.status(202).send('add to build');
  console.log('aadsda')
});

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
  agent.registry();
  console.log('listen port', port);

});

module.exports = app;