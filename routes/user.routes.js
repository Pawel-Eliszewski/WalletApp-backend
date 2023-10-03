const express = require('express')
const Joi = require('joi');
const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET
const auth = require("../middlewares/auth");
const {
    findUserByEmail,
    registerUser,
    authenticateUser,
    setToken,
    findUserById
} = require("../controllers/user.controller")
const {
    getUsersTransactions,
    getUserStatisticsByDate,
} = require("../controllers/transaction.controller")

const userJoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
        .min(4)
        .required(),
});

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 4
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad Request, validation error or email in use
 */

router.post('/register', async (req, res, next) => {
    try {
        const {error, value} = userJoiSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                status: 'Conflict',
                code: 400,
                message: "Validation error",
                details: error.details,
            });
            return;
        }
        const {email, password} = value;
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({
                status: 'Conflict',
                code: 400,
                message: "Email in use",
            });
        } else {
            const user = await registerUser(email, password);
            res.status(201).json({
                status: 'Success',
                code: 201,
                data: user,
            });

        }
    } catch (err) {
        next(err);
    }
})

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 4
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '400':
 *         description: Bad Request, validation error or authentication failed
 */

router.post('/login', async (req, res, next) => {
    try {
        const {error, value} = userJoiSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'Bad Request',
                code: 400,
                message: "Validation error",
                details: error.details,
            })
        }
        const {email, password} = value;
        const user = await findUserByEmail(email);
        const userAuth = await authenticateUser(email, password);
        if (userAuth) {
            const payload = {
                id: user.id,
                username: user.username,
            }
            const token = jwt.sign(payload, secret, {expiresIn: '1h'})
            await setToken(user.email, token);
            return res.json({
                status: 'success',
                code: 200,
                data: {
                    'ID': user._id,
                    'email': user.email,
                    'balance': user.balance,
                    'token': token,
                },
            })
        } else {
            return res.json({
                status: 'failure',
                code: 400,
                message: error
            })
        }

    } catch (error) {
        next(error);
    }
})

/**
 * @swagger
 * /user/current:
 *   get:
 *     summary: Current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User authenticated, showing email and balance
 */

router.get('/current', auth, async (req, res, next) => {
    try {
        const user = req.user;
        res.json({
            status: 'Success',
            code: 200,
            data: user
        })
    } catch (err) {
        next(err);
    }
})

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Logout the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User logged out successfully
 */

router.get('/logout', auth, async (req, res, next) => {
    const {email} = req.user;
    await setToken(email, null);
    res.json({
        status: 'success',
        code: 200,
        data: {
            message: `Successfully logged out user: ${email}`,
        },
    })
})

/**
 * @swagger
 * /user/{userId}/transactions:
 *   get:
 *     summary: Get transactions for a user by user ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Transactions retrieved successfully
 *       '400':
 *         description: Bad Request, user has no transactions
 *       '404':
 *         description: User not found
 */

router.get('/:userId/transactions', auth, async (req, res, next) => {
    try {
        const {userId} = req.query;
        const user = await findUserById(userId);
        if (!user) {
            res.json({
                status: 'Failure',
                code: 404,
                message: 'User not found'
            })
        } else {
            const transactions = await getUsersTransactions(userId);
            if (!transactions) {
                res.json({
                    status: 'Failure',
                    code: 400,
                    message: 'User has no transactions in his history'
                })
            } else {
                res.json({
                    status: 'Success',
                    code: 200,
                    data: transactions
                })
            }
        }
    } catch (err) {
        next(err);
    }
})

/**
 * @swagger
 * /user/{userId}/statistics:
 *   get:
 *     summary: Get user statistics by user ID and date
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: query
 *         name: transactionsDate
 *         schema:
 *           type: string
 *         required: true
 *         description: Date for which to retrieve statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User statistics retrieved successfully
 *       '404':
 *         description: User not found
 */

router.get('/:userId/statistics', auth, async (req, res, next) => {
    try {
        const {userId} = req.query;
        const {transactionsDate} = req.body;
        const user = await findUserById(userId);
        if (!user) {
            res.json({
                status: 'Not Found',
                code: 404,
                message: 'User not found'
            })
        } else {
            const transactions = await getUserStatisticsByDate(userId, transactionsDate);
            res.json({
                status: 'OK',
                code: 200,
                data: transactions
            })
        }
    } catch (err) {
        next(err);
    }
})

module.exports = router;