import express from 'express';
import {
   getAddress
}
   from '../controllers/addressController.js';

const addressRoutes = express.Router();

addressRoutes.get('/address', getAddress);

export default addressRoutes;