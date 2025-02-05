import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})

import http from 'http'
import app from './app.js'
import connectDB from './db/db.js'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { mongoose } from 'mongoose'
import { Project } from './models/project.model.js'
import { generateContent } from './services/ai.service.js'

const server = http.createServer(app);

//socket io setup
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});


io.use(async (socket, next) => {

    try {

        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }
        socket.project = await Project.findById(projectId).lean();

        if (!token) {
            return next(new Error('Authentication error'))
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            return next(new Error('Authentication error'))
        }
        socket.user = decoded;

        next();

    } catch (error) {
        next(error)
    }

})
io.on('connection', socket => {

    socket.roomId = socket.project._id.toString();
    console.log("User connected:");

    socket.join(socket.roomId);

    socket.on('project-message', async data => {

        const message = data.message;

        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message', data)

        if (aiIsPresentInMessage) {


            const prompt = message.replace('@ai', '');

            const result = await generateContent(prompt);


            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: 'AI'
                }
            })


            return
        }


    })
    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.leave(socket.roomId);
    });
});


connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);

        })
    })
    // then is a method that handles the resolved promise. It is executed if the promise returned by connectDB() resolves successfully
    .catch((err) => {
        console.error("MongoDB connect failure:", err.message);
    });