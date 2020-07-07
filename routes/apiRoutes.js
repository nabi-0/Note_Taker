// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

var fs = require("fs");
var path = require("path");
//var notes = require("./db/db.json");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "../db/db.json"));
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function (req, res) {
    let newNotes = req.body;
    fs.readFile("db/db.json", function (err, data) {

      // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
      // It will do this by sending out the value "true" have a table
      // req.body is available since we're using the body parsing middleware    
      if (err) throw err;
      let notes = JSON.parse(data);

      if (notes.length === 0) { 
        newNotes.id = 1
      }

      else {
        newNotes.id = notes[notes.length - 1].id + 1; //x += 1 is x = x+1 not in this case
      }
      notes.push(newNotes);

      fs.writeFile("db/db.json", JSON.stringify(notes, null, 10), (err) => { //null, 2 will give space to the objects in the array
        if (err) throw err;
        console.log("written successfully...maybe, I'm not sure");
        return res.json(newNotes);
      });
    });
  });
  // ---------------------------------------------------------------------------
  // Deleting the Note
  // Don"t worry about it!

  app.delete("/api/notes/:id", function (req, res) {
    // Empty out the arrays of data
    let deleteId = req.params.id;
    fs.readFile("db/db.json", function (err, data) {
      if (err) throw err;
      let notes = JSON.parse(data);
      let newNoteId = notes.filter(function (note) {
        return note.id != deleteId
      }); //filter = array fuction
      fs.writeFile("db/db.json", JSON.stringify(newNoteId, null, 10), (err) => {
        if (err) throw err;
        res.json(true);
        console.log("Note was successfully deleted.")
      });
    });
  });
};
