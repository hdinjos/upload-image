import {Pool, Client} from 'pg';

const db = new Pool({
  user: 'hdinjos',
  host: 'localhost',
  database: 'new_upload_images',
  password: '123',
  port: '5432'
});


export default db;