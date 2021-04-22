import * as del from 'del';
import * as Loki from 'lokijs';

const loadCollection = (colName, db: Loki): any => {
  return new Promise(resolve => {
    db.loadDatabase({}, () => {
      const _collection = db.getCollection(colName) || db.addCollection(colName);
      resolve(_collection);
    })
  });
} 

const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image file are allowed!'), false);
  }
  cb(null, true);
}

const cleanFolder = (folderPath) => {
  del.sync([`${folderPath}/**`, `!${folderPath}`]);
};

export {loadCollection, imageFilter, cleanFolder};
