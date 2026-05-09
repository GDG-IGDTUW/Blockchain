/* Middleware for protecting API routes using JWT authentication.
 Verifies that the request contains a valid token before allowing access.   

 This middleware checks whether the incoming request contains a valid JWT in the Authorization header.
 
  Request Flow:
  1. Client sends token in header:  Authorization: Bearer <token>
  2. Server extracts and verifies token
  3. If valid → decoded user data is attached to req.user
  4. Request continues to controller
  5. If invalid → request is rejected with 401
 
 */

import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {

    // Read token from Authorization header
    let authorizationHeader = req.header('Authorization');

    // If no token is present, user is not authenticated
    if (!authorizationHeader) {
      return res.status(401).json({ msg: 'You are not logged in. Please provide an authorization token.' });
    }

    // Remove "Bearer " prefix if present
    if (authorizationHeader.startsWith('Bearer ')) {
      authorizationHeader = authorizationHeader.slice(7, authorizationHeader.length).trimLeft();
    }

    // Verify the token using JWT secret
    const decodedToken = jwt.verify(authorizationHeader, process.env.JWT_SECRET);

    //  Attach decoded user data to request
    req.user = decodedToken;
    next();
  } catch (err) {                 // Token is missing, expired, or invalid
    res.status(401).json({ msg: 'Invalid authentication token. Please log in again.' });
  }
};
