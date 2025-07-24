import express from 'express';
import {
   getAddress
}
   from '../controllers/addressController.js';

const addressRoutes = express.Router();

addressRoutes.get('/address/:user_id', getAddress);

export default addressRoutes;