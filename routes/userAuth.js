const jwt = require("jsonwebtoken");

function AuthenticateToken(req, res, next) {
  const token = req.cookies?.accessToken;
  
  if (!token) {
    return res.status(401).json({ 
      message: "Unauthorized - No token provided",
      code: "NO_TOKEN"
    });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      // Handle different JWT errors
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ 
          message: "Token expired - Please login again",
          code: "TOKEN_EXPIRED"
        });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ 
          message: "Invalid token",
          code: "INVALID_TOKEN"
        });
      }
      return res.status(403).json({ 
        message: "Token verification failed",
        code: "TOKEN_ERROR"
      });
    }
    
    req.user = user; // attach payload
    next();
  });
}

module.exports = { AuthenticateToken };
