const express=require("express")
const {createProfile,upload,getUser }=require("../controllers/profileController")
const router=express.Router()


router.post("/create-profile",upload.single('profileImage'),createProfile)
router.get("/getUsers",getUser)



module.exports=router

