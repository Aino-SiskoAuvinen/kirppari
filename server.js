const express = require('express')
const app = express()
const port = (process.env.PORT ||80)
//const port = 3000
const bodyParser = require('body-parser')
//const users = require('./routes/users')
const items = require('./routes/items')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const secretKey = (process.env.jwtKey || 80)
//const secretKey = "salainenavain"
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs')
const Ajv = require('ajv')
const ajv = new Ajv()
const userInfoSchema = require('./schemas/userInfo.schema.json')
const userInfoModifySchema = require('./schemas/userInfoModify.schema.json')
const userInfoArraySchema = require('./schemas/usersArray.schema.json')
const arrayUsers = [
  {
    "userId": "142",
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice.smith@gmail.com",
    "phoneNumber": "040-1231234",
    "location": "Linnanmaki",
    "username": "alice",
    "password": "jotainkauheaasotkua"
  }
]

app.use(bodyParser.json())

const userInfoValidator = ajv.compile(userInfoSchema)
const userInfoModifyValidator = ajv.compile(userInfoModifySchema)
const userInfoArrayValidator = ajv.compile(userInfoArraySchema)



passport.use(new BasicStrategy(
  function (username, password, done){
    console.log(username + ' ' + password);
    let user = arrayUsers.find(user => (user.username === username) && (bcrypt.compareSync(password, user.password)));
    if(user != undefined) {
      done(null, user)
    }
    else {
      done(null, false)
    }    
  }
))

app.get('/users', (req, res) => {
  const validationResult = userInfoArrayValidator(arrayUsers)

  if (validationResult) {
    res.json(arrayUsers)
    res.sendStatus(200)
  }
  else {
    res.sendStatus(418)
  }
  
})

app.get('/users/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  let foundIndex = arrayUsers.findIndex(t => t.userId == req.params.id)

  if(foundIndex==-1){
      res.sendStatus(404)
  }
  else {
    if (arrayUsers[foundIndex].username == req.user.username){
      const validationResult = userInfoArrayValidator(arrayUsers[foundIndex])
      if (validationResult){
        res.json(arrayUsers[foundIndex])
      }
      else {
        res.sendStatus(418)
      }
    }
    else {
      res.sendStatus(401)
    }
  }
})

app.delete('/users/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  let foundIndex = arrayUsers.findIndex(t => t.userId == req.params.id)

  if(foundIndex==-1){
      res.sendStatus(404)
  }
  else {
    if(arrayUsers[foundIndex].username == req.user.username){
      arrayUsers.splice(foundIndex, 1)
      res.sendStatus(202)
  }
  else{
    res.sendStatus(401)
  }}
})

app.post('/users', (req, res) => {
  console.log(req.body)


  const salt = bcrypt.genSaltSync(6);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)

  const temp =[]
  temp.push(
    {
    userId: uuidv4(),
    firstName: req.body.firstName,     
    lastName: req.body.lastName,
    username: req.body.username,
    password: hashedPassword,     
    email: req.body.email,          
    phoneNumber: req.body.phoneNumber,     
    location: req.body.location 
    }
  )
  const validationResult = userInfoValidator(temp[0])

  if(validationResult){
    arrayUsers.push(temp[0])
    res.sendStatus(201)
    }
  else {
    res.sendStatus(400)
  }
  })


app.get('/', (req, res) => {
  res.send('Welcome to Kirppari!')
})

const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
let jwtValidationOption = {}
jwtValidationOption.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtValidationOption.secretOrKey = secretKey;

passport.use(new JwtStrategy(jwtValidationOption, function(jwt_payload, done) {
    
    const user = arrayUsers.find(u => u.username === jwt_payload.user)
    done(null, user)
}));
app.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
  const payLoad = {
    email: req.user.email,
    location: req.user.location,
    user: req.user.username
  }

  const token = jwt.sign(payLoad, secretKey)

  res.json({token : token})
})

app.get('/jwtSecured', passport.authenticate('jwt', {session: false}), (req, res)=> {
  res.json({status: 'OK, TOIMII', user: req.user.username})
})


app.use('/items', items)


let serverInstance = null;

module.exports = {
  start: function() {
    serverInstance = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  },
  close: function() {
    serverInstance.close();
  }
}

