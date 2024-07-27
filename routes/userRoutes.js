const express=require('express');
const formidable=require("express-formidable");
const {getLoggedInUser,createUser,loginUser,logoutCurrentUser,getAllUsers}=require('../controllers/userController');
const {authenticate,authorizeAdmin}=require('../middlewares/authMiddleware');
const router=express.Router();


router.
    route('/')
    .post(createUser)
    .get( getAllUsers);



router.route('/profile').get(getLoggedInUser)

router.post("/auth",loginUser);

router.post("/logout",logoutCurrentUser);



module.exports=router;