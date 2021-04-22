import express from 'express';

const landing = express.Router();

landing.get('/', (req, res) => {
  return res.send({Halo: 'gais berhasil ke landing page'});
});

export default landing;