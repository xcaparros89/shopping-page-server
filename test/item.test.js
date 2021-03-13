const Item = require("../models/Item");
const mongoose = require("mongoose");
const supertest = require("supertest");
const express = require("express");
var itemRouter = require('../routes/item');

const app = express();
app.use(express.json());
app.use("/item", itemRouter);


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

  
test('/item/findAll', async () => {
    const item = await Item.create({ title: "item 1", description: "Lorem ipsum", price:3, img:'img', tags:['tag1', 'tag2'] });
    const item2 = await Item.create({ title: "item 2", description: "Lorem ipsum", price:13, img:'img2', tags:['tag21', 'tag22'] });
    await supertest(app).get("/item/findAll")
      .expect(200).then(async(response)=>{
        //Call doesn't return an error
        expect(response.body.success).toBe(true)

        //Body is an array with a length of two
        expect(Array.isArray(response.body.body)).toBeTruthy();
        expect(response.body.body.length).toEqual(2);

        //Response properties are equal to item and item2 properties
        expect(response.body.body[0].title).toBe(item.title)
        expect(response.body.body[0].description).toBe(item.description)
        expect(response.body.body[0]._id).toBe(item.id)
        expect(response.body.body[0].price).toBe(item.price)
        expect(response.body.body[0].img).toBe(item.img)
        expect(Array.isArray(response.body.body[0].tags)).toBeTruthy();
        expect(response.body.body[0].tags[0]).toBe(item.tags[0])
        expect(response.body.body[0].tags[1]).toBe(item.tags[1])
        expect(response.body.body[1].title).toBe(item2.title)
        expect(response.body.body[1].description).toBe(item2.description)
        expect(response.body.body[1]._id).toBe(item2.id)
        expect(response.body.body[1].price).toBe(item2.price)
        expect(response.body.body[1].img).toBe(item2.img)
        expect(Array.isArray(response.body.body[0].tags)).toBeTruthy();
        expect(response.body.body[1].tags[0]).toBe(item2.tags[0])
        expect(response.body.body[1].tags[1]).toBe(item2.tags[1])
      })
  })

test('/item/findOne/:key/:value', async()=>{
    const item = await Item.create({ title: "item 1", description: "Lorem ipsum", price:3, img:'img', tags:['tag1', 'tag2'] });

  //FindOne by id returns the correct object
  await supertest(app).get(`/item/findOne/_id/${item.id}`)
      .expect(200).then(async(response)=>{
        expect(response.body.success).toBe(true)
        expect(response.body.body.title).toBe(item.title)
        expect(response.body.body.description).toBe(item.description)
        expect(response.body.body._id).toBe(item.id)
        expect(response.body.body.price).toBe(item.price)
        expect(response.body.body.img).toBe(item.img)
        expect(Array.isArray(response.body.body.tags)).toBeTruthy();
        expect(response.body.body.tags[0]).toBe(item.tags[0])
        expect(response.body.body.tags[1]).toBe(item.tags[1])
      })

  //FindOne by title returns the correct object
  await supertest(app).get(`/item/findOne/title/${item.title}`)
      .expect(200).then(async(response)=>{
        expect(response.body.success).toBe(true)
        expect(response.body.body.title).toBe(item.title)
        expect(response.body.body.description).toBe(item.description)
        expect(response.body.body._id).toBe(item.id)
        expect(response.body.body.price).toBe(item.price)
        expect(response.body.body.img).toBe(item.img)
        expect(Array.isArray(response.body.body.tags)).toBeTruthy();
        expect(response.body.body.tags[0]).toBe(item.tags[0])
        expect(response.body.body.tags[1]).toBe(item.tags[1])
      })
})

test('/item/create', async()=>{
  const data = { title: "item 1", description: "Lorem ipsum", price:3, img:'img', tags:['tag1', 'tag2']  };
  await supertest(app).post('/item/create').send(data).expect(200).then(async(response)=>{

    //Call doesn't return an error
    expect(response.body.success).toBe(true)

    //Response properties are equal to data properties
    expect(response.body.body.title).toBe(data.title)
    expect(response.body.body.description).toBe(data.description)
    expect(response.body.body._id).toBeTruthy()
    expect(response.body.body.price).toBe(data.price)
    expect(response.body.body.img).toBe(data.img)
    expect(Array.isArray(response.body.body.tags)).toBeTruthy();
    expect(response.body.body.tags[0]).toBe(data.tags[0])
    expect(response.body.body.tags[1]).toBe(data.tags[1])
    //New item saved in database
    const item = await Item.findOne({ _id: response.body.body._id });
    expect(item).toBeTruthy();

    //New item is equal to data
    expect(item.title).toBe(data.title);
    expect(item.description).toBe(data.description);
    expect(item.price).toBe(data.price)
    expect(item.img).toBe(data.img)
    expect(Array.isArray(item.tags)).toBeTruthy();
    expect(item.tags[0]).toBe(data.tags[0])
    expect(item.tags[1]).toBe(data.tags[1])
  })
})

test('/item/update', async()=>{
  const item = await Item.create({ title: "item 1", description: "Lorem ipsum", price:3, img:'img', tags:['tag1', 'tag2'] });
  const data = { title: "item 2", description: "Ipsum lorem", price:23, img:'img2', tags:['tag21', 'tag22'], _id:item.id  };;
  await supertest(app).post('/item/update').send(data).expect(200).then(async(response)=>{

    //Call doesn't return an error
    expect(response.body.success).toBe(true)

    //Response properties are equal to data properties
    expect(response.body.body.title).toBe(data.title)
    expect(response.body.body.description).toBe(data.description)
    expect(response.body.body._id).toBeTruthy()
    expect(response.body.body.price).toBe(data.price)
    expect(response.body.body.img).toBe(data.img)
    expect(Array.isArray(response.body.body.tags)).toBeTruthy();
    expect(response.body.body.tags[0]).toBe(data.tags[0])
    expect(response.body.body.tags[1]).toBe(data.tags[1])

    //item still saved in database
    const item = await Item.findOne({ _id: response.body.body._id });
    expect(item).toBeTruthy();

    //item is now equal to data
    expect(item.title).toBe(data.title);
    expect(item.description).toBe(data.description);
    expect(item.price).toBe(data.price)
    expect(item.img).toBe(data.img)
    expect(Array.isArray(item.tags)).toBeTruthy();
    expect(item.tags[0]).toBe(data.tags[0])
    expect(item.tags[1]).toBe(data.tags[1])
  })

})