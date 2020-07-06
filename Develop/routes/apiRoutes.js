// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var fs =require("fs");
var path = require("path");
//var notes = require("./db/db.json");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db.json"));
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function(req, res) {
    let newNotes = req.body;
    fs.readFile("db.json", function(err, data) {

  // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
  // It will do this by sending out the value "true" have a table
  // req.body is available since we're using the body parsing middleware    
      if (err) throw err;
      let notes = JSON.parse(data);
      notes.push(newNotes);
      res.json(true);

    fs.writeFile("db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      console.log("written successfully...maybe, I'm not sure");
      return res.json(newNotes);
    });
  });
});
  // ---------------------------------------------------------------------------
  // Deleting the Note
  // Don"t worry about it!

  app.delete("/api/notes/:id", function(req, res) {
    // Empty out the arrays of data
    let deleteNote = req.params.id;
    fs.readFile("db.json", function(err, data) {
      if (err) throw err;
      let notes = JSON.params(data);
      let newNotes = notes.filter((note) => note.id != deleteNote);
      fs.writeFile("db.json", JSON.stringify(newNotes), (err) => {
        if (err) throw err;
        res.json(true);
        console.log("Note was successfully deleted.")
      });
    });
  });
};

