import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    let authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
      return res.status(401).json({ msg: 'Authorization is required.' });
    }

    if (authorizationHeader.startsWith('Bearer ')) {
      authorizationHeader = authorizationHeader.slice(7, authorizationHeader.length).trimLeft();
    }

    const decodedToken = jwt.verify(authorizationHeader, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid or expired authorization token.' });
  }
};
