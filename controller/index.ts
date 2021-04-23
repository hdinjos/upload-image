import {loadCollection, imageFilter, cleanFolder} from '../utils';

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Loki from 'lokijs';
import express from 'express';
import db from '../database';

const router = express.Router();


const DB_NAME = 'db.json';  
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const upload = multer({dest: `${UPLOAD_PATH}/`, fileFilter: imageFilter});
// const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, {persistenceMethod: 'fs'});

//single
router.post('/profile', upload.single('avatar'), async (req, res) => {
  try {
    console.log(req.file);
    const queryPost = 'INSERT INTO image_files(filename, filepath, mimetype, size) VALUES($1,$2,$3,$4) RETURNING *';
    const valuePost = [`${req.file.filename}`, `${req.file.path}`, `${req.file.mimetype}`, `${req.file.size}`]
    const result = await db.query(queryPost, valuePost);
    res.status(201).send(
      {
        success: true,
        message: "upload image succesfully",
        data:{
          ...result.rows[0]
        } 
      }
    );
  }catch (err){
    console.log(err);
    res.sendStatus(404);
  }
});

//multiple
router.post('/photos/upload', upload.array('photos', 12), async (req, res) => {
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
router.get('/images', async (req, res) => {
  try {
    const col = await loadCollection(COLLECTION_NAME, db);
    res.send(col.data);
  }catch(err){
    res.sendStatus(400);
  }
});

//getImageById
router.get('/images/:id', async(req, res) => {
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

export default router;