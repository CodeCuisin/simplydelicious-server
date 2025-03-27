const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }
  return null;
}

const isOwner = (req, res, next) => {
  const userIdFromToken = req.payload.id; // Number
  const userIdFromParams = parseInt(req.params.userId, 10); // Convert to Number

  if (isNaN(userIdFromParams)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({ message: "You are not authorized to perform this action" });
  }

  next();
};

const logPayload = (req, res, next) => {
  console.log(req.payload); // This should contain the decoded JWT payload if authentication is successful
  next();
};

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
  isOwner, logPayload
};
