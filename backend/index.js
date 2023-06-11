const connectToMongo = require('./db')

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

// available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`)
})

connectToMongo();