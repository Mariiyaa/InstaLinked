const express=require("express")
const {createProfile,upload,displayProfile }=require("../controllers/profileController")
const router=express.Router()


router.post("/create-profile",upload.single('profileImage'),createProfile)
router.get("/display-profile",displayProfile)



module.exports=router

