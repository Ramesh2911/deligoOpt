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

      const userId = req.params.user_id;

      if (!userId) {
         return res.status(400).json({
            status: false,
            message: 'User ID is required in URL',
         });
      }

      const [rows] = await con.query(
         `SELECT id, type, you_are_here, user_id, is_active, house AS address_name
          FROM hr_addresses
          WHERE user_id = ?`, [userId]
      );

      return res.status(200).json({
         status: true,
         message: `User addresses for user_id ${userId} fetched successfully`,
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

//====updateAddress=====
export const updateAddress = async (req, res) => {
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

      const { user_id, id } = req.params;

      await con.query(
         `UPDATE hr_addresses SET is_active = 0 WHERE user_id = ?`,
         [user_id]
      );

      await con.query(
         `UPDATE hr_addresses SET is_active = 1 WHERE id = ?`,
         [id]
      );

      return res.status(200).json({
         status: true,
         message: 'Address updated successfully',
      });
   } catch (error) {
      console.error('Update Address Error:', error.message);
      return res.status(500).json({
         status: false,
         message: 'Server error or invalid token',
      });
   }
};
