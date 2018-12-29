// let's go!
const cookieParser = require('cookie-parser');
require('dotenv').config({path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');
const server = createServer();
const jwt = require('jsonwebtoken');

// Use express middleware to handle cookies
server.express.use(cookieParser());

// decode jwt token to get user ID
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if(token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET);

        //put userid onto request for future access
        req.userId = userId;
    }
    next();
});

// Use express middleware to populate current user
server.express.use( async (req, res, next) => {
    if (!req.userId) return next();

    const user = await db.query.user(
        { where: { id: req.userId } },
        '{id, permissions, email, name }'
    );
    req.user = user;
    next();
});

server.start(
    {
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL
        },
    }, deets => {
        console.log(`Server is running on port http://localhost:${deets.port}`)
    } 
);