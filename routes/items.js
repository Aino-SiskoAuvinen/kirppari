const express = require('express')
const { v4: uuidv4 } = require('uuid');
const router = express.Router()
const passport = require('passport')
const Ajv = require('ajv')
const ajv = new Ajv()
const itemInfoSchema = require('../schemas/itemInfo.schema.json')
const itemInfoModifySchema = require('../schemas/itemInfoModify.schema.json')
const itemInfoValidator = ajv.compile(itemInfoSchema)
const itemInfoModifyValidator = ajv.compile(itemInfoModifySchema)


const items =[{
    "itemId": uuidv4(),
    "title": "hammasharja", 
    "description": "vähän käytetty Jordanin hammasharja",
    "price": "5 €", 
    "category": "hygienia",
    "creationDay": "2019-08-24", 
    "location": "Oulu",
    "Shipping": false, 
    "Pickup": true,
    "userId": uuidv4(),  
    "image1": null, 
    "image2": null, 
    "image3": null, 
    "image4": null  
  },
  {
    "itemId": uuidv4(),
    "title": "bumerangi", 
    "description": "aito kiinapiraatti",
    "price": "15 €", 
    "category": "lelut",
    "creationDay": "2019-08-24", 
    "location": "Puumala",
    "Shipping": false, 
    "Pickup": true,
    "userId": "1",  
    "image1": null, 
    "image2": null, 
    "image3": null, 
    "image4": null  
  },
  {
    "itemId": uuidv4(),
    "title": "villasukat", 
    "description": "koko 37",
    "price": "5 €", 
    "category": "vaatteet",
    "creationDay": "2019-08-24",  
    "location": "Puumala",
    "Shipping": false, 
    "Pickup": true,  
    "userId": "2",   
    "image1": null, 
    "image2": null, 
    "image3": null, 
    "image4": null  
  }]

router.get('/', (req, res) => {
    res.json(items)
  })

router.get('/id/:id', (req, res) => {
    let foundIndex = items.findIndex(t => t.itemId == req.params.id)

    if(foundIndex==-1){
        res.sendStatus(404)
    }
    else {
        res.json(items[foundIndex])
    }
  })
  
router.delete('/id/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    let foundIndex = items.findIndex(t => t.itemId == req.params.id)

    console.log(req.user.username)
    if(foundIndex==-1){
        res.sendStatus(404)
    }
    else {
        if(items[foundIndex].username == req.user.username){
        items.splice(foundIndex, 1)
        res.sendStatus(202)
    }
        else {
          res.sendStatus(401)
        }}
  })

router.post('/',passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log(req.body)

    const temp = []
    temp.push(
      {
        itemId: uuidv4(),
        title: req.body.title, 
        description: req.body.description,
        price: req.body.price, 
        category: req.body.category,
        creationDay: req.body.creationDay, 
        Shipping: req.body.Shipping, 
        Pickup: req.body.Pickup,
        username: req.user.username, 
        location: req.user.location,
        email: req.user.email, 
        image1: req.body.image1, 
        image2:req.body.image2, 
        image3: req.body.image3, 
        image4: req.body.image4 
      }
    )

    const validationResult = itemInfoValidator(temp[0])
    console.log(temp[0])
    console.log(validationResult)

    if(validationResult){
      items.push(temp[0])
      res.sendStatus(201)
    }
    else {
      res.sendStatus(400)
    }
    
  })

router.put('/id/:id' ,passport.authenticate('jwt', {session: false}), (req, res) => {
    let foundItem = items.find(t => t.itemId == req.params.id)
    
    if(foundItem){
      const validationResult = itemInfoModifyValidator(req.body)
      if(validationResult){
        if (foundItem.username==req.user.username){
          foundItem.title = req.body.title, 
          foundItem.description = req.body.description,
          foundItem.price = req.body.price,  
          foundItem.category = req.body.category,
          foundItem.Shipping = req.body.Shipping, 
          foundItem.Pickup = req.body.Pickup,  
          foundItem.email = req.body.email,
          foundItem.location = req.body.location,
          foundItem.image1 = req.body.image1, 
          foundItem.image2 = req.body.image2, 
          foundItem.image3 = req.body.image3, 
          foundItem.image4 = req.body.image4 
          res.sendStatus(202)
        }
        else {
          res.sendStatus(401)
      }}
      else {
        res.sendStatus(400)
      }}
    else{
      res.sendStatus(404)
    }
  })

  router.get('/location/:location', (req, res) => {
    //console.log(req.query)
    console.log(req.params.location)
    const result = []
    for (var i in items){
      if (items[i].location == req.params.location)
        result.push(items[i])
    }
    console.log(result)
    res.json(result)
  })

  router.get('/category/:category', (req, res) => {
    console.log(req.params.category)
    const result = []
    for (var i in items){
      if (items[i].category == req.params.category)
        result.push(items[i])
    }
    console.log(result)
    res.json(result)
  })

  router.get('/date/:creationDay', (req, res) => {
    console.log(req.params.creationDay)
    const result = []
    for (var i in items){
      if (items[i].creationDay == req.params.creationDay)
        result.push(items[i])
    }
    console.log(result)
    res.json(result)
  })

  module.exports = router