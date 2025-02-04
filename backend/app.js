import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan'


const app = express();

app.use(morgan('dev'))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
// app.use(cors());
app.use(express.json({ limit: "20kb" }))             //  to handle request from form in json

app.use(express.urlencoded({ limit: "20kb" }))      //to handle the encoded url for space etc

app.use(express.static("public"))                   //to handle files and store it on local

app.use(cookieParser())                             //cookie-parser to do crud opr on client cookie

import userRouter from './routes/user.route.js'
import projectRouter from './routes/project.route.js'
import aiRouter from './routes/ai.route.js'

app.use("/api/v1/users",userRouter)
app.use("/api/v1/projects",projectRouter)
app.use("/api/v1/ai",aiRouter)



export default app;