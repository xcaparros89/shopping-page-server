const Category = require("../models/Category");
const mongoose = require("mongoose");
const supertest = require("supertest");
const express = require("express");
var categoryRouter = require('../routes/category');

const app = express();
app.use(express.json());
app.use("/category", categoryRouter);


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

  
test('/category/findAll', async () => {
    const category = await Category.create({ title: "category 1", description: "Lorem ipsum" });
    const category2 = await Category.create({ title: "category 2", description: "Lorem ipsum" });
    await supertest(app).get("/category/findAll")
      .expect(200).then(async(response)=>{
        //Success is true
        expect(response.body.success).toBe(true)

        //Body is an array with a length of two
        expect(Array.isArray(response.body.body)).toBeTruthy();
        expect(response.body.body.length).toEqual(2);

        //Response properties are equal to category and category2 properties
        expect(response.body.body[0].title).toBe(category.title)
        expect(response.body.body[0].description).toBe(category.description)
        expect(response.body.body[0]._id).toBe(category.id)
        expect(response.body.body[1].title).toBe(category2.title)
        expect(response.body.body[1].description).toBe(category2.description)
        expect(response.body.body[1]._id).toBe(category2.id)
      })
  })

test('/category/findONe/:key/:value', async()=>{
  const category = await Category.create({ title: "category 1", description: "Lorem ipsum" });

  //FindOne by id returns the correct object
  await supertest(app).get(`/category/findOne/_id/${category.id}`)
      .expect(200).then(async(response)=>{
        expect(response.body.success).toBe(true)
        expect(response.body.body.title).toBe(category.title)
        expect(response.body.body.description).toBe(category.description)
        expect(response.body.body._id).toBe(category.id)
      })

  //FindOne by title returns the correct object
  await supertest(app).get(`/category/findOne/title/${category.title}`)
      .expect(200).then(async(response)=>{
        expect(response.body.success).toBe(true)
        expect(response.body.body.title).toBe(category.title)
        expect(response.body.body.description).toBe(category.description)
        expect(response.body.body._id).toBe(category.id)
      })
})

test('/category/create', async()=>{
  const data = { title: "category 1", description: "Lorem ipsum" };
  await supertest(app).post('/category/create').send(data).expect(200).then(async(response)=>{

    //Success is true
    expect(response.body.success).toBe(true)

    //Response properties are equal to data properties
    expect(response.body.body.title).toBe(data.title)
    expect(response.body.body.description).toBe(data.description)
    expect(response.body.body._id).toBeTruthy()

    //New category saved in database
    const category = await Category.findOne({ _id: response.body.body._id });
    expect(category).toBeTruthy();

    //New category is equal to data
    expect(category.title).toBe(data.title);
    expect(category.description).toBe(data.description);
  })
})

test('/category/update', async()=>{
  const category = await Category.create({ title: "category 1", description: "Lorem ipsum" });
  const data = { title: "category 2", description: "Ipsum lorem", _id:category.id };
  await supertest(app).post('/category/update').send(data).expect(200).then(async(response)=>{

    //Succes is true
    expect(response.body.success).toBe(true)

    //Response properties are equal to data properties
    expect(response.body.body.title).toBe(data.title)
    expect(response.body.body.description).toBe(data.description)
    expect(response.body.body._id).toBeTruthy()

    //Category still saved in database
    const category = await Category.findOne({ _id: response.body.body._id });
    expect(category).toBeTruthy();

    //Category is now equal to data
    expect(category.title).toBe(data.title);
    expect(category.description).toBe(data.description);
  })

})