import express from 'express'
import { createListing } from '../controller/listing.controller.js'
import { verifyUser } from '../utils/verify.user.js'

const router = express.Router()

router.post('/create' , verifyUser,  createListing)

export default router 