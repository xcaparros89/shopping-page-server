const User = require("../models/user");
const mongoose = require("mongoose");
const supertest = require("supertest");
const express = require("express");
var authRouter = require('../routes/auth');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use("/auth", authRouter);


beforeEach((done) => {
    mongoose.connect("mongodb://localhost/shopping-server",
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => done());
  });
  
  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
  });

  
test('/signup', async () => {
    const data = {   
        username: 'username',
        email: 'email',
        password: 'password',
        address: 'adress',
        name: 'name',
        surnames: 'surnames',
        city: 'city',
        state: 'state',
        zip: 'zip' };
        
    await supertest(app).post("/auth/signup").send(data).expect(200).then(async(response)=>{

        //Call doesn't return an error
        expect(response.body.success).toBe(true)

        //All the response properties are equal to data properties
        expect(response.body.body.username).toBe(data.username)
        expect(response.body.body.email).toBe(data.email)
        expect(bcrypt.compareSync(data.password, response.body.body.password)).toBeTruthy()
        expect(response.body.body.address).toBe(data.address)
        expect(response.body.body.name).toBe(data.name)
        expect(response.body.body.surnames).toBe(data.surnames)
        expect(response.body.body.city).toBe(data.city)
        expect(response.body.body.state).toBe(data.state)
        expect(response.body.body.zip).toBe(data.zip)
    })

    })
test('/login', async () => {
  let password='password'
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);
    const user = await User.create({username: 'username',
    email: 'email',
    password: hashPass,
    address: 'adress',
    name: 'name',
    surnames: 'surnames',
    city: 'city',
    state: 'state',
    zip: 'zip'})
    const data = {   
        username: 'username',
        password: 'password'
     };
        
    await supertest(app).post("/auth/login").send(data).expect(200).then(async(response)=>{

        //Call doesn't return an error      
        expect(response.body.success).toBe(true)

        //All the response properties are equal to user properties
        expect(response.body.body.username).toBe(user.username)
        expect(response.body.body.email).toBe(user.email)
        expect(hashPass).toBe(response.body.body.password)
        expect(response.body.body.address).toBe(user.address)
        expect(response.body.body.name).toBe(user.name)
        expect(response.body.body.surnames).toBe(user.surnames)
        expect(response.body.body.city).toBe(user.city)
        expect(response.body.body.state).toBe(user.state)
        expect(response.body.body.zip).toBe(user.zip)

    })

    })
