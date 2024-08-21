import userModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from "validator"
import 'dotenv/config'

const createToken = id => {
    const payload = {
        id
    }
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const user = await userModel.findOne({ email })
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = createToken(user._id)
                return res.json({
                    statusCode: 200,
                    success: true,
                    message: 'User Logged In',
                    token,
                    timeStamp: new Date().toISOString()
                })
            } else {
                throw new Error("Wrong Password")
            }
        } else {
            throw new Error("user does not exists -> wrong email")
        }
    } catch (error) {
        console.error(error.message)
        return res.status(401).json({
            statusCode: 401,
            success: false,
            message: 'Invalid email or Passowrd',
            timeStamp: new Date().toISOString()
        })
    }
}

// Register User
const registerUser = async (req, res) => {
    const { name, password, email } = req.body

    try {
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.status(500).json({
                statusCode: 500,
                success: false,
                message: 'User already exists',
                timeStamp: new Date().toISOString()
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'please enter a valid email address',
                timeStamp: new Date().toISOString()
            })
        }

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};:'",.<>?\\|`~]{1,}$/

        if ((password.length < 8) || (!regex.test(password))) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'please enter a strong password',
                timeStamp: new Date().toISOString()
            })
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await new userModel({
            name,
            email,
            password: hashedPassword
        }).save()

        const token = createToken(user._id)

        return res.json({
            statusCode: 200,
            success: true,
            message: 'User Created',
            token,
            timeStamp: new Date().toISOString()
        })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Failed to create the user',
            timeStamp: new Date().toISOString()
        })
    }
}

export {
    loginUser,
    registerUser
}