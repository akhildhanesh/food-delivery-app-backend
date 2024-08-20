import express from 'express'
import { addFood } from '../controllers/foodController.js'
import multer from 'multer'
import { v4 as uuid } from 'uuid'

const foodRoute = express.Router()

// Image Storage Engine

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${uuid()}_${file.originalname}`)
    }
})

const upload = multer({
    storage
})

foodRoute.post('/add', upload.single('image'), addFood)

export default foodRoute