// set module.exports to an object.
module.exports = {
    // Create a method called usersOnly with the parameters req, res, and next.
    usersOnly: (req, res, next) => {
        // The usersOnly function should check if there is a user object on req.session.
        if (!req.session.user) {
            // If there is not, send a response with status 401 and the string 'Please log in'.
            return res.status(401).send('Please log in.');
        }
        // Otherwise invoke next.
        next();
    },
    adminsOnly: (req, res, next) => {
        if (!req.session.user.isAdmin) {
          return res.status(403).send("You are not an admin");
        }
        next();
      }
    };