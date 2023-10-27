const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;
const db_data = require('./db/db.json')
const generateUniqueId = require('generate-unique-id');

app.use(express.static('public'));
app.use(express.json());
app.get('/notes', (req, res) =>

    res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirnam, "public/index.html"))
);

app.get('/api/notes', (req, res) => res.json(db_data));

app.post('/api/notes', (req, res) => {
    let temp = {
        'title': req.body.title,
        'text': req.body.text,
        'id': generateUniqueId()
    };

    db_data.push(temp);
    fs.writeFile("./db/db.json", JSON.stringify(db_data), err => {
        if (err) {
            console.error("Error writing to file:", err);
            return res.status(500).json({ error: 'Failed to save note' });
        }
        res.status(200).json(temp);
    });
});
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
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
