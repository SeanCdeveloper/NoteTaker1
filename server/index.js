const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs').promises;
const shortid = require('shortid');
const dbFilePath = path.resolve(__dirname, '..', 'db', 'db.json' );

//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    //res.send("Hello World");
   const filePath = path.resolve(__dirname, '..', 'public', 'index.html');
   res.sendFile(filePath);
});

app.get("/notes", (req, res) => {  
   const filePath = path.resolve(__dirname, '..', 'public', 'notes.html');
   res.sendFile(filePath);
});

app.get('/api/notes', async (req, res) => {
    const fileData = await fs.readFile(dbFilePath, 'utf-8');
    const data = JSON.parse(fileData);
    res.json(data);
});

// id, title, text is needed to save note!  

app.post('/api/notes', async (req, res) => {
    const {title, text} = req.body;
    const fileData = await fs.readFile(dbFilePath, 'utf-8');
    const data = JSON.parse(fileData);
    data.push({
        id: shortid.generate(),
        title, 
        text 
    });

    await fs.writeFile(dbFilePath, JSON.stringify(data));

   res.json({
       success: true
   });
});

app.delete('/api/notes/:id', async (req, res) => {
    const noteId = req.params.id;
    console.log(noteId);

    const fileData = await fs.readFile(dbFilePath, 'utf-8');
    const data = JSON.parse(fileData);

    const newData = data.filter(note => note.id !== noteId);
    await fs.writeFile(dbFilePath, JSON.stringify(newData));
 
    res.json({
        success: true
    });
});

app.use("*", (req, res) => {
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


