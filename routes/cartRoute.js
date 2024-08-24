import express from "express"
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js"
import authMiddlewware from "../middleware/auth.js"

const cartRouter = express.Router()

cartRouter.use(authMiddlewware)

cartRouter.get('/', getCart)
cartRouter.post('/add', addToCart)
cartRouter.post('/remove', removeFromCart)

export default cartRouter