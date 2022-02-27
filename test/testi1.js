const assert = require('assert')
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);

const userArraySchema = require('../schemas/usersArray.schema.json');
const serverAddress = 'http://localhost:3000'

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
  
})
