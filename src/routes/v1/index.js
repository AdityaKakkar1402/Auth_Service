const express = require("express");

const UserController = require("../../controllers/user-controller");
const {
  AuthRequstValidators,
  validateIsAdminRequest,
} = require("../../middlewares/index");

const router = express.Router();

router.post(
  "/signup",
  AuthRequstValidators.validateUserAuth,
  UserController.create
);
router.post(
  "/signin",
  AuthRequstValidators.validateUserAuth,
  UserController.signIn
);
router.get("/isAuthenticated", UserController.isAuthenticated);

router.get(
  "/isAdmin",
  AuthRequstValidators.validateIsAdminRequest,
  UserController.isAdmin
);
module.exports = router;
