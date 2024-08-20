import foodModel from '../models/foodModel.js'
import { writeFile } from 'node:fs/promises'

// add food item

const addFood = (req, res) => {
    const { name, description, price, category } = req.body
    let image_fileName = `${req.file.filename}`

    new foodModel({
        name,
        description,
        price,
        category,
        image: image_fileName
    }).save()
        .then(() => {
            return res.status(201).json({
                statusCode: 201,
                success: true,
                message: 'Food Added',
                timeStamp: new Date().toISOString()
            })
        })
        .catch(err => {
            console.error(err.message)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'ERROR',
                timeStamp: new Date().toISOString()
            })
        })
}

// list food

const listFood = (req, res) => {
    foodModel.find()
        .then(data => {
            res.json({
                statusCode: 200,
                success: true,
                data,
                timeStamp: new Date().toISOString()
            })
        })
        .catch(err => {
            console.error(err.message)
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'ERROR',
                timeStamp: new Date().toISOString()
            })
        })
}

export {
    addFood,
    listFood
}