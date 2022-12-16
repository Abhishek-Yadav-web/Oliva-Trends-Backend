const express = require('express');
const { registerUser, loginUser, logoutUser, forgetPassword, resetPassword, getUserDetails, updateUserPassword, updateUserEmail, updateUserProfile, getAllUserADMIN, getSingleUserADMIN, giveRoleADMIN, deleteUserADMIN, getAllDashboardDataADMIN} = require('../controller/userContoller');
const { userProtected, roleProtected } = require('../middleware/authorized');
const router = express.Router();

router.post("/user/register",registerUser);
router.post("/user/login",loginUser);
router.get("/user/logout",logoutUser);
router.post("/user/password/forgot",forgetPassword);
router.put("/user/password/reset/:token",resetPassword);
router.get("/user/profile",userProtected,getUserDetails);
router.put("/user/update/password",userProtected,updateUserPassword);
router.put("/user/update/email",userProtected,updateUserEmail);
router.put("/user/update/profile",userProtected,updateUserProfile);
router.get("/admin/users",userProtected,roleProtected("admin"),getAllUserADMIN);
router.get("/admin/user/:id",userProtected,roleProtected("admin"),getSingleUserADMIN);
router.put("/admin/update/role/:id",userProtected,roleProtected("admin"),giveRoleADMIN);
router.delete("/admin/delete/user/:id",userProtected,roleProtected("admin"),deleteUserADMIN);
router.get("/admin/dashboard/data",userProtected,roleProtected("admin"),getAllDashboardDataADMIN);


module.exports = router