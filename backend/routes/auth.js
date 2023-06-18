const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { query, body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');


const JWT_SECRET = 'niggaman$22'

// ROUTE: 1 == > Create a user using: POST "/api/auth/createuser" - Doesn't require login
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('username', 'Enter a valid username').isLength({ min: 4 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'passowrd is too small(min 5 characters)').isLength({ min: 5 }),

], async (req, res) => {
    // if there are errors, return bad requests and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    try {
        //Check whether the user exixts already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exixts" })
        }

        // using bcrypt to hash the passowrd and 
        // adding salt to improve pass security
        // whenever someone logs in we provide that user a token,
        // tha can be either Session token, JWT(json web token)(more on https://jwt.io )
        // JWT is a way of verifying a user, user wont be sending the user id and pass again and again
        // once user is authneticated, he weill be provided with a token
        // whenever a user has to accces a protected route, he has to provide the troken as well
        // wheneever a  JWT is dispatched , it will be signed with a secrete
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.username, salt)

        // creating user
        user = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: secPassword,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        // console.log({ authtoken });

        // send repsonse
        // res.json(user)
        res.json(authtoken)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE: 2 ==> Authenticate a user using: POST "/api/auth/login" - Doesn't require login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'passowrd can not be blank').exists(),

], async (req, res) => {
    // if there are errors, return bad requests and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: "Username or Password incorrect, try again" })
        }

        const passowrdCompare = await bcrypt.compare(password, user.password);
        if (!passowrdCompare) {
            return res.status(400).json({ errors: "Username or Password incorrect, try again" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE: 3 ==> Get logged in user details using: POST "/api/auth/getuser" - require login
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router