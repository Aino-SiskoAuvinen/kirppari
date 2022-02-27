const express = require('express')
const { v4: uuidv4 } = require('uuid');
const router = express.Router()

const arrayUsers =[]

router.get('/', (req, res) => {
    res.json(arrayUsers)
  })

router.get('/:id', (req, res) => {
    let foundIndex = arrayUsers.findIndex(t => t.userId == req.params.id)

    if(foundIndex==-1){
        res.sendStatus(404)
    }
    else {
        res.json(arrayUsers[foundIndex])
    }
  })
  
router.delete('/:id', (req, res) => {
    let foundIndex = arrayUsers.findIndex(t => t.userId == req.params.id)

    if(foundIndex==-1){
        res.sendStatus(404)
    }
    else {
        arrayUsers.splice(foundIndex, 1)
        res.sendStatus(202)
    }
  })

router.post('/', (req, res) => {
  console.log(req.body)
  

  const salt = bcrypt.genSaltSync(6);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)

  
  arrayUsers.push(
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
  res.sendStatus(201)
})

router.put('/:id' , (req, res) => {
  let foundUser = arrayUsers.find(t => t.userId == req.params.id)
  if(foundUser){
    foundUser.firstName = req.body.firstName,     
    foundUser.lastName = req.body.lastName,     
    foundUser.email = req.body.email,           
    foundUser.phoneNumber = req.body.phoneNumber,     
    foundUser.location = req.body.location
    res.sendStatus(202)
  }
  else{
    res.sendStatus(404)
  }
})

module.exports = router
module.exports = {arrayUsers: arrayUsers}