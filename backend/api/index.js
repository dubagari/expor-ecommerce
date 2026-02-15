import express from 'express'

const app = express()

app.get('/api', (req, res) => {
    res.status(200).json({message: 'success'})
})

app.listen(5000, () => {
    console.log("port running at 5000!");
})