import bcrypt from 'bcrypt';
import con from '../db/db.js';
import { adminCookie } from '../utils/cookies.js';

// =====login======
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: 'Email and password are required',
      });
    }

    const [rows] = await con.query(
      `SELECT hr_users.*, hr_addresses.id AS address_id, hr_addresses.you_are_here, hr_addresses.house as address_name
       FROM hr_users
       LEFT JOIN hr_addresses ON hr_users.id = hr_addresses.user_id
       WHERE hr_users.role_id = '3'
       AND hr_users.is_active = 'Y'
       AND hr_addresses.is_active = '1'
       AND hr_users.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Invalid credentials',
      });
    }

    const user = rows[0];

    // Optional password check (uncomment if using hashed passwords)
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({
    //     status: false,
    //     message: 'Invalid credentials',
    //   });
    // }

    const fullname = `${user.first_name} ${user.last_name}`;

    const responseData = {
      status: 'success',
      role: user.role_id,
      userid: user.id,
      profileimage: user.profile_picture,
      prefix: user.prefix,
      fmname: user.first_name,
      lmname: user.last_name,
      fullname: fullname,
      you_are_here: user.you_are_here,
      email: user.email,
      mobile: user.mobile,
      address_name: user.address_name,
      setcurrentcategory: '0'
    };

    adminCookie(process.env.JWT_SECRET, user, res, `${fullname} logged in`);

  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Server error',
    });
  }
};

//======logout======
export const logout = async (req, res) => {
  try {
    res.clearCookie('admin_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });

    return res.status(200).json({
      status: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({
      status: false,
      message: 'Server error during logout',
    });
  }
};

//======country list ======
export const getCountries = async (req, res) => {
  try {
    const [rows] = await con.query(
      SELECT * FROM hr_countries WHERE phonecode>0 and is_active='1' ORDER BY hr_countries.name ASC
    );

    return res.status(200).json({
      status: true,
      message: 'Active countries fetched successfully',
      data: rows,
    });
  } catch (error) {
    console.error('Get Active Countries Error:', error.message);
    return res.status(500).json({
      status: false,
      message: 'Server error while fetching active countries',
    });
  }
};
