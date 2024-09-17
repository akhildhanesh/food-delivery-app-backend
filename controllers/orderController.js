import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
    const { userId, items, amount, address } = req.body
    try {
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address
        })

        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        const line_items = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
        })

        return res.json({
            statusCode: 200,
            success: true,
            message: 'OK',
            session_url: session.url,
            timeStamp: new Date().toISOString()
        })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'ERROR',
            timeStamp: new Date().toISOString()
        })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, session_id } = req.body

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (session.payment_status === 'paid') {
            await orderModel.findByIdAndUpdate(orderId, {
                payment: true
            })
            return res.json({
                statusCode: 200,
                success: true,
                message: 'Paid',
                timeStamp: new Date().toISOString()
            })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            return res.status(402).json({
                statusCode: 402,
                success: false,
                message: 'Not Paid',
                timeStamp: new Date().toISOString()
            })
        }
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'ERROR',
            timeStamp: new Date().toISOString()
        })
    }
}

export {
    placeOrder,
    verifyOrder
}