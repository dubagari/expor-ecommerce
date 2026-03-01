import express from 'express'
import config from '../config/env.js'  
import path from 'path'
import connectDB from '../config/db.js'
import cookieParser from 'cookie-parser'
import userRoutes from '../routes/user.routes.js'
import adminRoutes from '../routes/admin.routes.js'
import orderRoutes from '../routes/order.routes.js'
const app = express()
const __dirname = path.resolve()

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get('/api', (req, res) => {
    res.status(200).json({ message: 'success' })
})

app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/order', orderRoutes)

if (config.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")))
    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    })
}

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

const startServer = async () => {
    await connectDB();
    app.listen(config.PORT, () => {
        console.log(`server is running at port ${config.PORT}`);
    });
};

startServer();