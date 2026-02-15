import express from 'express'
import config from '../config/env.js'  
import path from 'path'
const app = express()

const __dirname = path.resolve()

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
app.listen(config.PORT, () => {
    console.log(`port running at ${config.PORT}`);
})