const express = require("express");

const { PORT } = require("./config/serverConfig");

const app = express();

const prepareAndStartServer = () => {
  app.listen(PORT, () => {
    console.log(`Auth Server started at ${PORT}`);
  });
};

prepareAndStartServer();
