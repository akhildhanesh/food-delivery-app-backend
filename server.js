import express from 'express'
import cors from 'cors'
import { connect } from './config/db.js'
import foodRoute from './routes/foodRoute.js'

const app = express()
const PORT = process.env.PORT || 4000

connect()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

// FOOD Route
app.use('/api/food', foodRoute)
app.use('/images', express.static('uploads'))

app.all('*', (req, res) => {
    return res.status(404).json({
        statusCode: 404,
        message: 'Not Found',
        timeStamp: new Date().toISOString()
    })
})

app.listen(PORT, () => console.log(`App running on PORT: ${PORT}`))