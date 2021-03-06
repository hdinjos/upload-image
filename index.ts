import * as express from 'express';
import * as multer from 'multer';
import * as cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import * as Loki from 'lokijs';

import {loadCollection, imageFilter, cleanFolder} from './utils';


const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const upload = multer({dest: `${UPLOAD_PATH}/`, fileFilter: imageFilter});
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, {persistenceMethod: 'fs'});


const app = express();
app.use(cors());

//single
app.post('/profile', upload.single('avatar'), async (req, res) => {
  try {
    const col = await loadCollection(COLLECTION_NAME, db);
    const data = col.insert(req.file);

    db.saveDatabase();
    res.send({id: data.$loki, filename: data.filename, originalName: data.originalname});
  }catch (err){
    res.sendStatus(404);
  }
});

//multiple
app.post('/photos/upload', upload.array('photos', 12), async (req, res) => {
  try {
    const col = await loadCollection(COLLECTION_NAME, db);  
    let data = [].concat(col.insert(req.files));
    db.saveDatabase();
    res.send(data.map(x => ({id: x.$loki, filename: x.filename, originalName: x.originalname})));
  }catch(err){
    res.send(400);
  }
});

// getAllDataImage
app.get('/images', async (req, res) => {
  try {
    const col = await loadCollection(COLLECTION_NAME, db);
    res.send(col.data);
  }catch(err){
    res.sendStatus(400);
  }
});

//getImageById
app.get('/images/:id', async(req, res) => {
  try{
    const col = await loadCollection(COLLECTION_NAME, db);
    const result = col.get(req.params.id);
    if (!result) {
      res.sendStatus(404);
      return;
    };

    res.setHeader('Content-Type', result.mimetype);
    fs.createReadStream(path.join(UPLOAD_PATH, result.filename)).pipe(res);
  }catch(err){
    res.sendStatus(400);
  }
});

// cleanFolder(UPLOAD_PATH);

app.listen(3000, ()=> {
  console.log('listening on port 3000');
});