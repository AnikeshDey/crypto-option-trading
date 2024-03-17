const jwt = require('jsonwebtoken');


module.exports = {

 requireLogin: (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'secret');
    req.user = decodedToken.data;
	
	  //req.user._id = req.user.u_id;

    req.user._id = "1680259800439246";

    console.log("req.user:", req.user._id);
	
    next();
  } catch (err) {
    const error = new Error('Authentication failed!');
    return next(error);
  }
}

};
