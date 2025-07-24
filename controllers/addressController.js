import con from '../db/db.js';
import jwt from 'jsonwebtoken';

//=====getAddress=======
export const getAddress = async (req, res) => {
   try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({
            status: false,
            message: 'Authorization token missing or invalid',
         });
      }

      const token = authHeader.split(' ')[1];
      jwt.verify(token, 'deligo@JWT!9dKz');

      const [rows] = await con.query(
         `SELECT id, type, you_are_here, user_id, is_active, house AS address_name
       FROM hr_addresses
       WHERE user_id = 49`
      );

      return res.status(200).json({
         status: true,
         message: 'User addresses fetched successfully',
         data: rows,
      });

   } catch (error) {
      console.error('Get Address Error:', error.message);
      return res.status(500).json({
         status: false,
         message: 'Server error or invalid token',
      });
   }
};
