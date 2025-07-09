import express from 'express';
import cors from 'cors'
import '@dotenvx/dotenvx/config';
import {connectDB} from './config/db.js'
import userRouter from './routes/user.routes.js';

const app = express()
const port = process.env.PORT || 3001

// CONNECT DB
connectDB()

// MIDDLEWARES
app.use(cors({
    origin : process.env.CORS_ORIGIN
}))
app.use(express.json())

app.use("/api/auth",userRouter)


// ROUTES
app.get("/",(req,res) => {
    res.send("Hello World");
})

app.listen(port, () => {
    console.log(`Listening at : http://localhost:${port}`);
    
})