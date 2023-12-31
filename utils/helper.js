const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

const validPassword = async (password, validData) => {
    return await bcrypt.compare(password, validData.password);
};
const generateToken = async (validData) => {
    const userToken = jwt.sign({ _id: validData._id }, process.env.TOKEN_KEY, {
        expiresIn: 60*60,
    });

    return userToken;
};

 const TokenValidator = (token) => {
    try {
      const data = jwt.verify(token, process.env.TOKEN_KEY);
      return data ? true : false;
    } catch (err) {
      return false;
    }
  };
  
const decodeToken = (token) => {
    try {
      return jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {}
  };
  
  const validateToken = async (req, res, next) => {
    try {
      const jwtToken = req.header(process.env.TOKEN_KEY);
      req.token = jwtToken;
      console.log(jwtToken)
      const valid = await TokenValidator(jwtToken)
      console.log("valid", valid);
      if (valid) {
        // res.status(200).json("Sed!");
        next();

      } else {
        res.status(403).json("Sorry your Token is expired!");
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
  };

module.exports = {TokenValidator,decodeToken,validateToken, hashPassword, validPassword,generateToken }