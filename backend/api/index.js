import express from 'express'
import config from '../config/env.js'  
import { clerkMiddleware } from '@clerk/express'
import path from 'path'
import connectDB from '../config/db.js'
const app = express()

const __dirname = path.resolve()

app.use(clerkMiddleware())

app.get('/api', (req, res) => {
    res.status(200).json({message: 'success'})
})

//make app ready for deployment

if (config.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")))
    
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    })
}

const startServer = async () => {
   await connectDB();
    app.listen(config.PORT, () => {
        console.log(`server is running at port ${config.PORT}`);
    });
};

startServer();