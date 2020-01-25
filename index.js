const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const PORT = 5000
const secretKey = 'secretKey'

app.get('/', (req, res) => {
    res.send('Welcome to the initial route API')

})
app.get('/login/:nameSpace', (req, res) => {
    //Authenticate as you like.
    const nameSpace = req.params.nameSpace
    //validate is that nameSpace exists in db or not.

    jwt.sign({ nameSpace }, secretKey, (err, token) => {
        res.send({ token })
    })
})

//protected route
app.post('/posts', verifyJwtToken, (req, res, next) => {
    console.log('------------- actual route called ----------------')
    res.json({
        message: 'post route called'
    })
})

//Verify JWT Token
function verifyJwtToken(req, res, next) {
    //console.log('------------- middle ware called -------------')
    const auth = req.headers['authorization']
    //console.log(auth)
    if (auth) {
        req.token = auth
        jwt.verify(req.token, secretKey, (err, authData) => {
            if (err) {
                //console.log('------- token auth failed ---------------')
                res.send('Invalid Auth Token.')
            } else {
                //console.log(authData)
                next()
            }
        })
    } else {
        res.send('Seems you don\'t have authorization')
    }
}

app.listen(PORT, () => console.log('Server starts and listening on ' + PORT + ' port'))