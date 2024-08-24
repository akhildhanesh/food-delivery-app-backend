import userModel from "../models/userModel.js"

const addToCart = async (req, res) => {
    const { userId, itemId } = req.body
    try {
        if (!itemId) throw new Error("Item ID is not provided")
        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData
        if (!cartData[itemId]) {
            cartData[itemId] = 1
        } else {
            cartData[itemId] += 1
        }
        await userModel.findByIdAndUpdate(userId, { cartData })
        return res.json({
            statusCode: 200,
            success: true,
            message: 'Added to Cart',
            timeStamp: new Date().toISOString()
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Failed to add item',
            timeStamp: new Date().toISOString()
        })
    }
}

const removeFromCart = async (req, res) => {
    const { userId, itemId } = req.body
    try {
        if (!itemId) throw new Error("Item ID is not provided")
        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData
        if (cartData[itemId] > 1) {
            cartData[itemId] -= 1
        } else {
            delete cartData[itemId]
        }
        await userModel.findByIdAndUpdate(userId, { cartData })
        return res.json({
            statusCode: 200,
            success: true,
            message: 'Removed from Cart',
            timeStamp: new Date().toISOString()
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Failed to remove item',
            timeStamp: new Date().toISOString()
        })
    }
}

const getCart = async (req, res) => {
   const { userId } = req.body
    try {
        const userData = await userModel.findById(userId)
        const cartData = await userData.cartData
        return res.json({
            statusCode: 200,
            success: true,
            data: cartData,
            timeStamp: new Date().toISOString()
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Failed to fetch the data',
            timeStamp: new Date().toISOString()
        })
    }
}

export {
    addToCart,
    removeFromCart,
    getCart
}