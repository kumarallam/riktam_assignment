const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const { verifySignUp } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/users", controller.allAccess);

  app.post(
    "/api/user",
    [
      authJwt.verifyToken, authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

};