const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileASync = util.promisify(fs.readFile);
const writeFileASync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("./develop/public"));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

app.get("/api/notes", function(req, res){
    readFileASync("./develop/db/db.json", "utf8").then(function(data){
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
})
app.post("/api/notes", function(req, res){
    const note = req.body;
    readFileASync("./develop/db/db.json", "utf8").then(function(data){
        const notes =[].concat(JSON.parse(data));
        note.id = notes.length + 1
        notes.push(note);
        return notes
    }).then(function(notes){
        writeFileASync("./develop/db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});
app.delete("/api/notes/:id", function(req, res){
    const idToDelete = parseInt(req.params.id);
    readFileASync("./develop/db/db.json", "utf8").then(function(data){
        const notes =[].concat(JSON.parse(data));
        const newNotesData = []
        for (let i = 0; i<notes.length; i++){
            if(idToDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
}).then(function(notes){
    writeFileASync("./develop/db/db.json", JSON.stringify(notes))
    res.send('saved success!!!');
})
})
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "./develop/public/notes.html"));
});

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "./develop/public/index.html"));
});

app.listen(PORT, function(){
    console.log("app listenin on port " + PORT);
})