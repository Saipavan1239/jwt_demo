import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const users = [
    {
        username : 'Ram',
        title : 'User 1'
    },
    {
        username : 'Shyam',
        title : 'User 2'
    }
]

app.get('/posts', checkAuthenticateToken,(req, res) => {
    res.json(users.filter(user => user.username === req.user.username));

});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = {username : username};

    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET )
    res.json({accessToken : accessToken});
});

function checkAuthenticateToken(req, res, next) {
    //we get data as Bearer TOKEN

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //checks if authHeader is present or not if present then split it and get the token
    if(token == null) return res.sendStatus(401); //if token is not present then send 401 status
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403);
        }  //if token is not valid then send 403 status
        req.user = user; //if token is valid then set user in request
        next(); //call next middleware
    });

}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});