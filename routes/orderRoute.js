import express from "express"
import { placeOrder, verifyOrder } from "../controllers/orderController.js"
import authMiddlewware from "../middleware/auth.js"

const orderRouter = express.Router()

orderRouter.use(authMiddlewware)

orderRouter.post('/place', placeOrder)

orderRouter.post('/verify', verifyOrder)

export default orderRouter