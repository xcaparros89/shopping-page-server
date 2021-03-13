const mongoose = require("mongoose");
const supertest = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const Item = require("../models/Item");
const itemRouter = require("../routes/item");

const app = express();
app.use(express.json());
app.use("/item", itemRouter);

beforeEach((done) => {
  //don't coneect to the same server than the real info
  mongoose.connect(
    "mongodb://localhost/shopping-server-test",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test("/item/findAll There are no categories in the database", async () => {
  await supertest(app)
    .get("/item/findAll")
    .expect(200)
    .then(async (response) => {
      //Call return an error that says no categories found
      expect(response.body.success).toBe(false);
      expect(response.body.body).toBe("No items found");
    });
});

test("/item/findAll There are categories in the database", async () => {
  const item = await Item.create({
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
  });
  const item2 = await Item.create({
    title: "item 2",
    description: "Lorem ipsum",
    price: 13,
    img: "img2",
    tags: ["tag21", "tag22"],
  });
  await supertest(app)
    .get("/item/findAll")
    .expect(200)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);

      //Body is an array with a length of two
      expect(Array.isArray(response.body.body)).toBeTruthy();
      expect(response.body.body.length).toEqual(2);

      //Response properties are equal to item and item2 properties
      expect(response.body.body[0].title).toBe(item.title);
      expect(response.body.body[0].description).toBe(item.description);
      expect(response.body.body[0]._id).toBe(item.id);
      expect(response.body.body[0].price).toBe(item.price);
      expect(response.body.body[0].img).toBe(item.img);
      expect(Array.isArray(response.body.body[0].tags)).toBeTruthy();
      expect(response.body.body[0].tags[0]).toBe(item.tags[0]);
      expect(response.body.body[0].tags[1]).toBe(item.tags[1]);
      expect(response.body.body[1].title).toBe(item2.title);
      expect(response.body.body[1].description).toBe(item2.description);
      expect(response.body.body[1]._id).toBe(item2.id);
      expect(response.body.body[1].price).toBe(item2.price);
      expect(response.body.body[1].img).toBe(item2.img);
      expect(Array.isArray(response.body.body[0].tags)).toBeTruthy();
      expect(response.body.body[1].tags[0]).toBe(item2.tags[0]);
      expect(response.body.body[1].tags[1]).toBe(item2.tags[1]);
    });
});

test("/item/findOne/:key/:value The item doesn't exist in the database", async () => {
  await supertest(app)
    .get(`/item/findOne/_id/invalidId`)
    .expect(200)
    .then(async (response) => {
      //Call return an error that says no items found
      expect(response.body.success).toBe(false);
      expect(response.body.body).toBe("No items found");
    });
});

test("/item/findOne/:key/:value The item exist in the database", async () => {
  const item = await Item.create({
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
  });

  //FindOne by id returns the correct object
  await supertest(app)
    .get(`/item/findOne/_id/${item.id}`)
    .expect(200)
    .then(async (response) => {
      expect(response.body.success).toBe(true);
      expect(response.body.body.title).toBe(item.title);
      expect(response.body.body.description).toBe(item.description);
      expect(response.body.body._id).toBe(item.id);
      expect(response.body.body.price).toBe(item.price);
      expect(response.body.body.img).toBe(item.img);
      expect(Array.isArray(response.body.body.tags)).toBeTruthy();
      expect(response.body.body.tags[0]).toBe(item.tags[0]);
      expect(response.body.body.tags[1]).toBe(item.tags[1]);
    });

  //FindOne by title returns the correct object
  await supertest(app)
    .get(`/item/findOne/title/${item.title}`)
    .expect(200)
    .then(async (response) => {
      expect(response.body.success).toBe(true);
      expect(response.body.body.title).toBe(item.title);
      expect(response.body.body.description).toBe(item.description);
      expect(response.body.body._id).toBe(item.id);
      expect(response.body.body.price).toBe(item.price);
      expect(response.body.body.img).toBe(item.img);
      expect(Array.isArray(response.body.body.tags)).toBeTruthy();
      expect(response.body.body.tags[0]).toBe(item.tags[0]);
      expect(response.body.body.tags[1]).toBe(item.tags[1]);
    });
});

test("/item/create missing mandatory fields", async () => {
  const data = {
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
  };
  await supertest(app)
    .post("/item/create")
    .send({ ...data, title: "" })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe(
        "Title, description, price, tags and img are mandatory"
      );
    });
  await supertest(app)
    .post("/item/create")
    .send({ ...data, description: "" })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe(
        "Title, description, price, tags and img are mandatory"
      );
    });
  await supertest(app)
    .post("/item/create")
    .send({ ...data, price: "" })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe(
        "Title, description, price, tags and img are mandatory"
      );
    });
  await supertest(app)
    .post("/item/create")
    .send({ ...data, tags: "" })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe(
        "Title, description, price, tags and img are mandatory"
      );
    });
  await supertest(app)
    .post("/item/create")
    .send({ ...data, img: "" })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe(
        "Title, description, price, tags and img are mandatory"
      );
    });
});
test("/item/create missing mandatory fields", async () => {
  await Item.create({
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
  });
  const data = {
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
  };
  await supertest(app)
    .post("/item/create")
    .send(data)
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe(
        "There is already a item with the same title in the database"
      );
    });
});

test("/item/create missing non-mandatory fields", async () => {
  const data = {
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
  };
  await supertest(app)
    .post("/item/create")
    .send(data)
    .expect(200)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);

      //Response properties are equal to data properties
      expect(response.body.body.title).toBe(data.title);
      expect(response.body.body.description).toBe(data.description);
      expect(response.body.body._id).toBeTruthy();
      expect(response.body.body.price).toBe(data.price);
      expect(response.body.body.img).toBe(data.img);
      expect(Array.isArray(response.body.body.tags)).toBeTruthy();
      expect(response.body.body.tags[0]).toBe(data.tags[0]);
      expect(response.body.body.tags[1]).toBe(data.tags[1]);
      //New item saved in database
      const item = await Item.findOne({ _id: response.body.body._id });
      expect(item).toBeTruthy();

      //New item is equal to data
      expect(item.title).toBe(data.title);
      expect(item.description).toBe(data.description);
      expect(item.price).toBe(data.price);
      expect(item.img).toBe(data.img);
      expect(Array.isArray(item.tags)).toBeTruthy();
      expect(item.tags[0]).toBe(data.tags[0]);
      expect(item.tags[1]).toBe(data.tags[1]);

      //Non-mandatory fields are equal to the default
      expect(item.discount).toBe(0);
    });
});

test("/item/create with all fields", async () => {
  const data = {
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
    discount: 1
  };
  await supertest(app)
    .post("/item/create")
    .send(data)
    .expect(200)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);

      //Response properties are equal to data properties
      expect(response.body.body.title).toBe(data.title);
      expect(response.body.body.description).toBe(data.description);
      expect(response.body.body._id).toBeTruthy();
      expect(response.body.body.price).toBe(data.price);
      expect(response.body.body.img).toBe(data.img);
      expect(Array.isArray(response.body.body.tags)).toBeTruthy();
      expect(response.body.body.tags[0]).toBe(data.tags[0]);
      expect(response.body.body.tags[1]).toBe(data.tags[1]);
      expect(response.body.body.discount).toBe(data.discount);

      //New item saved in database
      const item = await Item.findOne({ _id: response.body.body._id });
      expect(item).toBeTruthy();

      //New item is equal to data
      expect(item.title).toBe(data.title);
      expect(item.description).toBe(data.description);
      expect(item.price).toBe(data.price);
      expect(item.img).toBe(data.img);
      expect(Array.isArray(item.tags)).toBeTruthy();
      expect(item.tags[0]).toBe(data.tags[0]);
      expect(item.tags[1]).toBe(data.tags[1]);
      expect(item.discount).toBe(data.discount);
    });
});

test("/item/update without mandatory fields", async () => {
  const item = await Item.create({
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
  });
  const data = {
    title: "item 2",
    description: "Ipsum lorem",
    price: 23,
    img: "img2",
    tags: ["tag21", "tag22"],
    _id: item.id,
  };
  await supertest(app)
    .post("/item/update")
    .send({...data, title:'' })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe('Title, description, price, tags and img are mandatory');
    });
  await supertest(app)
    .post("/item/update")
    .send({...data, description:'' })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe('Title, description, price, tags and img are mandatory');
    });
  await supertest(app)
    .post("/item/update")
    .send({...data, price:'' })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe('Title, description, price, tags and img are mandatory');
    });
  await supertest(app)
    .post("/item/update")
    .send({...data, img:'' })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe('Title, description, price, tags and img are mandatory');
    });
  await supertest(app)
    .post("/item/update")
    .send({...data, tags:'' })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe('Title, description, price, tags and img are mandatory');
    });
  await supertest(app)
    .post("/item/update")
    .send({...data, _id:'' })
    .expect(200)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe('No id sended');
    });
});

test("/item/update with incorrect id", async () => {
  const item = await Item.create({
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    tags: ["tag1", "tag2"],
  });
  const data = {
    title: "item 2",
    description: "Ipsum lorem",
    price: 23,
    img: "img2",
    tags: ["tag21", "tag22"],
    _id: 'incorrectId'
  };
  await supertest(app)
    .post("/item/update")
    .send(data)
    .expect(200)
    .then(async (response) => {

        //Call doesn't return an error
        expect(response.body.success).toBe(false);
  
        //Response properties are equal to data properties
        expect(response.body.body).toBe("Cannot find the item in the database");
      });
});

test("/item/update with all fields", async () => {
  const item = await Item.create({
    title: "item 1",
    description: "Lorem ipsum",
    price: 3,
    img: "img",
    discount:5,
    tags: ["tag1", "tag2"],
  });
  const data = {
    title: "item 2",
    description: "Ipsum lorem",
    price: 23,
    img: "img2",
    discount:5,
    tags: ["tag21", "tag22"],
    _id: item.id,
  };
  await supertest(app)
    .post("/item/update")
    .send(data)
    .expect(200)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);

      //Response properties are equal to data properties
      expect(response.body.body.title).toBe(data.title);
      expect(response.body.body.description).toBe(data.description);
      expect(response.body.body._id).toBeTruthy();
      expect(response.body.body.price).toBe(data.price);
      expect(response.body.body.img).toBe(data.img);
      expect(Array.isArray(response.body.body.tags)).toBeTruthy();
      expect(response.body.body.tags[0]).toBe(data.tags[0]);
      expect(response.body.body.tags[1]).toBe(data.tags[1]);
      expect(response.body.body.discount).toBe(data.discount);

      //item still saved in database
      const item2 = await Item.findOne({ _id: response.body.body._id });
      expect(item2).toBeTruthy();

      //item is now equal to data
      expect(item2.title).toBe(data.title);
      expect(item2.description).toBe(data.description);
      expect(item2.price).toBe(data.price);
      expect(item2.img).toBe(data.img);
      expect(Array.isArray(item2.tags)).toBeTruthy();
      expect(item2.tags[0]).toBe(data.tags[0]);
      expect(item2.tags[1]).toBe(data.tags[1]);
      expect(item2.discount).toBe(data.discount);
    });
});
