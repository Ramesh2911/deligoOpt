import express from 'express';
import {
   getAddress,
   updateAddress
}
   from '../controllers/addressController.js';

const addressRoutes = express.Router();
addressRoutes.get('/address/:user_id', getAddress);
addressRoutes.put('/address/:user_id/:id', updateAddress);

export default addressRoutes;