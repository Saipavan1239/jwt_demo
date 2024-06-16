import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);

    res.sendStatus(204);
});

let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ username: user.username });
        res.json({ accessToken: accessToken });
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { username: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); // Access token valid for 1 hour
}

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
