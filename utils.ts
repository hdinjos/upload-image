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

export {loadCollection};