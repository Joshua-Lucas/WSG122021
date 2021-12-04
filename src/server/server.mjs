import path from "path";
import fs from "fs";

import React from "react";
import express from "express";
import createError from "http-errors";
import ReactDOMServer from "react-dom/server";

import App from "../client/src/components/App.jsx";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  // Renders React code to static html
  const app = ReactDOMServer.renderToString(<App />);

  //Creates a build file if one does not exist. and adds the static html to the div.
  const indexFile = path.resolve("./src/client/public/index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

app.use(express.static("./dist"));

export const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};

app.use((req, res, next) => {
  next(createError(404));
});
