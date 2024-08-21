import express from 'express'
import { addFood, listFood, removeFood } from '../controllers/foodController.js'
import multer from 'multer'
import { randomUUID as uuid } from 'node:crypto'

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
foodRoute.get('/list', listFood)
foodRoute.post('/remove', removeFood)

export default foodRoute