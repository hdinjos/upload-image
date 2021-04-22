import express from 'express';
import cors from 'cors';
import controller from './controller';
import landing from './controller/landing';

const app = express();
app.use(cors());
app.use('/api/v2', controller);
app.use('/api/v2', landing);

app.listen(3000, ()=> {
  console.log('listening on port 3000');
});