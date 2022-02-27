const assert = require('assert')
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);


const userArraySchema = require('../schemas/usersArray.schema.json');
const itemArraySchema = require('../schemas/itemInfoArray.schema.json')
const serverAddress = 'https://kirppari.herokuapp.com'

var jwtToken = ""
var itemId = ""
var address =""


describe('Kirppari API Tests', function() {

  before(function() {
    server.start();
  });

  after(function() {
    server.close();
  })

  describe('Get /users', function() {
    it('should return all users', function(done) {
      chai.request(serverAddress)
      .get('/users')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(userArraySchema)
        done();
      })
    })
  })

  describe('Add new user data', function() {
    it('should accept user data when data is correct', function(done) {
      chai.request(serverAddress)
        .post('/users')
        .send({
          firstName: "Joulu",
          lastName: "Pukki",
          email: "pukinpaja@gmail.com",
          phoneNumber: "040-1231234",
          location: "Korvatunturi",
          username: "vanhaukki",
          password: "kauhiaasettia"
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        })
      })
      it('should reject request with missing fields from data structure', function(done) {
        chai.request(serverAddress)
        .post('/users')
        .send({
          firstName: "Joulu",
          lastName: "Pukki",
          phoneNumber: "040-1231234",
          location: "Korvatunturi",
          username: "vanhaukki",
          password: "jotainkauheaasotkua"
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        })
      })
      it('should reject request with incorrect data types', function(done){
        chai.request(serverAddress)
        .post('/users')
        .send({
          firstName: "Joulu",
          lastName: "Pukki",
          email: "pukinpaja@gmail.com",
          phoneNumber: "040-1231234",
          location: null,
          username: "vanhaukki",
          password: "jotainkauheaasotkua"
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        })
      })
      it('should reject empty post requests', function(done){
        chai.request(serverAddress)
        .post('/users')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(500);
          done();
        })
      })
      it('should contain added user data', function(done){
        chai.request(serverAddress)
        .get('/users')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
        
          
          let found = false;
        
          for(let i=0; i<res.body.length; i++){
            if((res.body[i].firstName=='Joulu') && (res.body[i].lastName=='Pukki')&&
            (res.body[i].email=='pukinpaja@gmail.com')&& (res.body[i].phoneNumber=='040-1231234') &&
            (res.body[i].location=='Korvatunturi')&& (res.body[i].username=='vanhaukki')){
                found = true;
                break;
              }
            }
          if(found == false) {
            assert.fail('Data not saved')
          }
          done();
        })
      })
    })
  describe('POST /login', function(){
    it('should reject logging when password is incorrect', function(done){
      chai.request(serverAddress)
        .post('/login')
        .auth('vanhaukki', 'kuhiaasettia')
        .send({
          username: "vanhaukki",
          password: "jtainkauheaasotkua"
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        })
    })
    it('should reject logging when username is incorrect', function(done){
      chai.request(serverAddress)
        .post('/login')
        .auth('anhaukki', 'kauhiaasettia')
        .send({
          username: "anhaukki",
          password: "kauhiaasettia"
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        })
    })
    it('should log in with correct password and username', function(done){
      chai.request(serverAddress)
        .post('/login')
        .auth('vanhaukki', 'kauhiaasettia')
        .send({
          username: 'vanhaukki',
          password: 'kauhiaasettia'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          jwtToken = res.body.token;
          done();
        })
    })
  })
  describe('Get /items', function(){
    it('should return all items', function(done) {
      chai.request(serverAddress)
      .get('/items')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.jsonSchema(itemArraySchema)
        done();
      })
    })
  })
  describe('Add new item data', function(){
    it('should accept item data when data is correct', function(done){
      chai.request(serverAddress)
        .post('/items')
        .auth(jwtToken, {type: 'bearer'})
        .send({
          title: "tonttu", 
          description: "pieni",
          price: "20 €", 
          category: "sisustus",
          creationDay: "2022-02-27", 
          Shipping: false, 
          Pickup: true, 
          image1: "", 
          image2: "", 
          image3: "", 
          image4: "" 
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        })
    })
    it('should reject data if not logged in', function(done){
      chai.request(serverAddress)
        .post('/items')
        .send({
          title: "tonttu", 
          description: "pieni",
          price: "20 €", 
          category: "sisustus",
          creationDay: "2022-02-27", 
          Shipping: false, 
          Pickup: true, 
          image1: "", 
          image2: "", 
          image3: "", 
          image4: "" 
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          done();
        })
    })
    it('should reject data if missing fields', function(done){
      chai.request(serverAddress)
        .post('/items')
        .auth(jwtToken, {type: 'bearer'})
        .send({
          title: "tonttu", 
          description: "pieni",
          price: "20 €", 
          creationDay: "2022-02-27", 
          Shipping: false, 
          Pickup: true, 
          image1: "", 
          image2: "", 
          image3: "", 
          image4: "" 
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        })
    })
    it('should reject data with incorrect datatypes', function(done){
      chai.request(serverAddress)
        .post('/items')
        .auth(jwtToken, {type: 'bearer'})
        .send({
          title: "tonttu", 
          description: "pieni",
          price: 20, 
          category: "sisustus",
          creationDay: "2022-02-27", 
          Shipping: false, 
          Pickup: true, 
          image1: "", 
          image2: "", 
          image3: "", 
          image4: "" 
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          done();
        })
    })
    it('should contain added item data', function(done){
      chai.request(serverAddress)
      .get('/items')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      
        
        let found = false;
      
        for(let i=0; i<res.body.length; i++){
          if((res.body[i].title=='tonttu') && (res.body[i].description=='pieni') &&
          (res.body[i].price=='20 €') && (res.body[i].category=='sisustus') &&
          (res.body[i].creationDay=='2022-02-27') && (res.body[i].Shipping==false) &&
          (res.body[i].Pickup==true) && (res.body[i].username=="vanhaukki")){
              found = true;
              itemId = res.body[i].itemId
              break;
            }
          }
        if(found == false) {
          assert.fail('Data not saved')
        }
        done();
      })
    })
  })
  describe('put /items/id/:id', function(){
    it('should accept correct data', function(done){
      address = '/items/id/' + itemId
      chai.request(serverAddress)
      .put(address)
      .auth(jwtToken, {type: 'bearer'})
      .send({
        title: "tonttu", 
        description: "suuri",
        price: "20 €", 
        category: "sisustus",
        creationDay: "2022-02-27", 
        email: "jokinmuu@gmail.com",
        location: "Korvatunturi",
        Shipping: false, 
        Pickup: true, 
        image1: "", 
        image2: "", 
        image3: "", 
        image4: "" 
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(202);
        done();
      })
    })
    it('should reject modification if missing fields', function(done) {
      address = '/items/id/' + itemId
      chai.request(serverAddress)
      .put(address)
      .auth(jwtToken, {type: 'bearer'})
      .send({
        title: "tonttu", 
        description: "suuri", 
        category: "sisustus",
        creationDay: "2022-02-27", 
        email: "jokinmuu@gmail.com",
        location: "Korvatunturi",
        Shipping: false, 
        Pickup: true, 
        image1: "", 
        image2: "", 
        image3: "", 
        image4: "" 
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      })
    })
    it('should reject modification if wrong types of date', function(done) {
      address = '/items/id/' + itemId
      chai.request(serverAddress)
      .put(address)
      .auth(jwtToken, {type: 'bearer'})
      .send({
        title: "tonttu", 
        description: "suuri",
        price: 30, 
        category: "sisustus",
        creationDay: "2022-02-27", 
        email: "jokinmuu@gmail.com",
        location: "Korvatunturi",
        Shipping: false, 
        Pickup: true, 
        image1: "", 
        image2: "", 
        image3: "", 
        image4: "" 
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      })
    })
    it('should reject modification if not logged in', function(done) {
      address = '/items/id/' + itemId
      chai.request(serverAddress)
      .put(address)
      .send({
        title: "tonttu", 
        description: "suuri",
        price: "20 €", 
        category: "sisustus",
        creationDay: "2022-02-27", 
        email: "jokinmuu@gmail.com",
        location: "Korvatunturi",
        Shipping: false, 
        Pickup: true, 
        image1: "", 
        image2: "", 
        image3: "", 
        image4: "" 
      })
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      })
    })
    it('should contain modified item data', function(done){
      chai.request(serverAddress)
      .get('/items')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      
        
        let found = false;
      
        for(let i=0; i<res.body.length; i++){
          if((res.body[i].title=='tonttu') && (res.body[i].description=='suuri') &&
          (res.body[i].price=='20 €') && (res.body[i].category=='sisustus') &&
          (res.body[i].creationDay=='2022-02-27') && (res.body[i].Shipping==false) &&
          (res.body[i].Pickup==true) && (res.body[i].username=="vanhaukki")){
              found = true;
              itemId = res.body[i].itemId
              break;
            }
          }
        if(found == false) {
          assert.fail('Data not saved')
        }
        done();
      })
    })
  })
  describe('del /items/id:id', function(){
    it('should reject deletion if not authorized', function(done) {
      address = '/items/id/' + itemId
      chai.request(serverAddress)
      .del(address)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        done();
      })
    })
    it('should delete item when authorized', function(done){
      address = '/items/id/' + itemId
      chai.request(serverAddress)
      .del(address)
      .auth(jwtToken, {type: 'bearer'})
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(202);
        done();
      })
    })
    it('should not find deleted item', function(done){
      address = '/items/id/' + itemId
      chai.request(serverAddress)
      .get(address)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
      
        
        let found = false;
      
        for(let i=0; i<res.body.length; i++){
          if(res.body[i].itemId==itemId){
              assert.fail('Item was not deleted')
            }
          }
        done();
      })
    })
  })

  describe('get /items/search', function(){
    it('should find items by location', function(done){
      address = '/items/location/Linnanmaki'
      chai.request(serverAddress)
      .get(address)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done()
      })
    })
    it('should find items by category', function(done){
      address = '/items/location/vaatteet'
      chai.request(serverAddress)
      .get(address)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done()
      })
    })
    it('should find items by date', function(done){
      address = '/items/location/2022-02-24'
      chai.request(serverAddress)
      .get(address)
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done()
      })
    })
  })

  
  
})
