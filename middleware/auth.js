import jwt from 'jsonwebtoken'

const authMiddlewware = async (req, res, next) => {
    try {
        const { authorization: token } = req.headers
        if (!token) {
            throw new Error("Missing Authorization Header")
        }
        const jwt_token = token.split(' ')[1]
        const token_decode = jwt.verify(jwt_token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (err) {
        console.error(err.message)
        return res.status(401).json({
            statusCode: 401,
            success: false,
            message: 'Unauthorized',
            timeStamp: new Date().toISOString()
        })
    }
}

export default authMiddlewware