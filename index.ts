import * as express from 'express';
import * as multer from 'multer';
import * as cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import * as Loki from 'lokijs';

import {loadCollection} from './utils';


const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const upload = multer({dest: `${UPLOAD_PATH}/`});
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, {persistenceMethod: 'fs'});


const app = express();

app.post('/profile', upload.single('avatar'), async (req, res) => {
  try {
    const col = await loadCollection(COLLECTION_NAME, db);
    const data = col.insert(req.file);

    db.saveDatabase();
    res.send({id: data.$loki, filename: data.filename, originalName: data.originalname});
  }catch (err){
    res.sendStatus(404);
  }
})

app.use(cors());
app.listen(3000, ()=> {
  console.log('listening on port 3000');
})