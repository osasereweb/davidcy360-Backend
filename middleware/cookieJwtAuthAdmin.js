const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(express.json());

const cookieJwtAuthAdmin = (req, res, next) => {
    const token = req.cookies.HeadToken;

    try {
        const admin = jwt.verify(token, process.env.SECRET_KEY_ADMIN);
        // console.log(admin);
        req.admin = admin;
        next();
    } catch (error) {
        res.clearCookie("HeadToken").status(400).send({ status: 'failed', authenticated: false });
    }
}




module.exports = { cookieJwtAuthAdmin };