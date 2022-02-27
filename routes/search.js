const express = require('express')
const router = express.Router()
const items = require('./items')(items);


router.get('/location/:location', (req, res) => {
    //console.log(req.query)
    console.log(req.query.location)
    const result = items.filter(location => location==req.query.location)
    console.log(result)
    res.json(result)
    res.sendStatus(200)
  })

  router.get('/category/:category', (req, res) => {
    //console.log(req.query)
    console.log(req.query.category)
    const result = items.filter(category => category==req.query.category)
    console.log(result)
    res.json(result)
    res.sendStatus(200)
  })

  router.get('/date/:date', (req, res) => {
    //console.log(req.query)
    console.log(req.query.date)
    const result = items.filter(creationDate => creationDate==req.query.date)
    console.log(result)
    res.json(result)
    res.sendStatus(200)
  })

module.exports = router