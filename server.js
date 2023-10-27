//Import Express.js, unuiqe ID, json file, fs, path.
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;
const db_data = require('./db/db.json')
const generateUniqueId = require('generate-unique-id');
//Middleware, set the request to return as json and settng the public folder
app.use(express.static('public'));
app.use(express.json());
//Express.js route to notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, "public/notes.html"))
);
//Express.js route to the index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirnam, "public/index.html"))
);
//API to return the json file
app.get('/api/notes', (req, res) => res.json(db_data));
//Creates the note, updates the json file and generate the unigue id.
app.post('/api/notes', (req, res) => {
    let temp = {
        'title': req.body.title,
        'text': req.body.text,
        'id': generateUniqueId()
    };
//Push the temp data to db_data
    db_data.push(temp);
    //Writes to the db.json file and returns a status of pass or fail.
    fs.writeFile("./db/db.json", JSON.stringify(db_data), err => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).json({ error: 'Failed to save note' });
        }
        res.status(200).json(temp);
    });
});
//Deletes the saved notes based on id
app.delete('/api/notes/:id',(req, res)=>{
for (let i = 0; i < db_data.length; i++) {
      if (db_data[i].id===req.params.id) {
        db_data.splice(i,1)
        fs.writeFile("./db/db.json", JSON.stringify(db_data), err => {
            if (err) {
                console.error("Error writing to file:", err);
                return res.status(500).json({ error: 'Failed to save note' });
            }
            res.status(200).json(db_data);
        });
      }
}
})
//port listener 
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
