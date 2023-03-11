"use strict";
const couchDB = "http://memluk:12CouchDB89!@127.0.0.1:5984";

// WEBSERVER
const formidable = require("formidable");
const express = require("express");
const server = express();

// Middleware
server.use(
  express.static("public", {
    extensions: ["html"],
  })
);

server.use(express.json())

// ROUTES
// Write & update a record
server.post("/save_Item", (request, response) => {

  const form = formidable({
    uploadDir: "./uploads",
    keepExtensions: true,
  });

  form.parse(request, (err, fields, uploads) => {
    if (err) console.warn(err);
    else {
      let myDB = db.use(dbName);  // Connect to the DB

      fields.url = uploads.url.newFilename;

      if(fields._id == "") {
        delete fields._id;
        delete fields._rev;
      }
      console.log(fields);

      myDB    // Enter data record in DB
        .insert(fields)
        .then((res) => response.json(res))
        .catch(console.warn);
    }
  });
});

// Load all products data
server.get("/load_all_items", (request, response) => {
  let myDB = db.use(dbName);    // Connect to the DB

  myDB
    .list({ include_docs: true })
    .then((res) => res.rows.map((row) => row.doc))
    .then((res) => response.json(res))
    .catch(console.warn);
});

// Delete a record
server.delete('/del_item', (request, response) => {
  let myDB = db.use(dbName);  // Connect to the DB

  myDB
    .destroy(request.body.id, request.body.rev) // Delete the record
    .then(res => response.json(res))
    .catch(console.warn);
})

// DATABASE
const dbName = "items";
const db = require("nano")(couchDB).db;

// FUNCTIONS
// Initialize DB
const dbInit = () => {

  // Check whether the database exists
  return db.list().then((res) => {
    if (!res.includes(dbName)) return db.create(dbName);
  });
};

const init = () => {
  dbInit()
    .then(
      () => server.listen(3000, (err) => console.log(err || "Server runs")) // Start web server
    )
    .catch(console.warn);
};

init();
