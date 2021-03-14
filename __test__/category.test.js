const mongoose = require("mongoose");
const supertest = require("supertest");
const express = require("express");
const Category = require("../models/Category");
const categoryRouter = require("../routes/category");

const app = express();
app.use(express.json());
app.use("/category", categoryRouter);

beforeEach((done) => {
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

test("/category/findAll There are no categories in the database", async () => {
  await supertest(app)
    .get("/category/findAll")
    .then(async (response) => {
      //Call return an error that says no categories found
      expect(response.body.success).toBe(false);
      expect(response.body.body).toBe("No categories found");
    });
});

test("/category/findAll There are categories in the database", async () => {
  const category = await Category.create({
    title: "category 1",
    description: "Lorem ipsum",
  });
  const category2 = await Category.create({
    title: "category 2",
    description: "Lorem ipsum",
  });
  await supertest(app)
    .get("/category/findAll")
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);

      //Body is an array with a length of two
      expect(Array.isArray(response.body.body)).toBeTruthy();
      expect(response.body.body.length).toEqual(2);

      //Response properties are equal to category and category2 properties
      expect(response.body.body[0].title).toBe(category.title);
      expect(response.body.body[0].description).toBe(category.description);
      expect(response.body.body[0]._id).toBe(category.id);
      expect(response.body.body[1].title).toBe(category2.title);
      expect(response.body.body[1].description).toBe(category2.description);
      expect(response.body.body[1]._id).toBe(category2.id);
    });
});

test("/category/findONe/:key/:value The category doesn't exist in the database", async () => {
  await supertest(app)
    .get(`/category/findOne/_id/invalidId`)
    .then(async (response) => {
      //Call return an error that says no categories found
      expect(response.body.success).toBe(false);
      expect(response.body.body).toBe("No categories found");
    });
});

test("/category/findONe/:key/:value The category exist in the database", async () => {
  const category = await Category.create({
    title: "category 1",
    description: "Lorem ipsum",
  });

  //FindOne by id returns the correct object
  await supertest(app)
    .get(`/category/findOne/_id/${category.id}`)
    .then(async (response) => {
      expect(response.body.success).toBe(true);
      expect(response.body.body.title).toBe(category.title);
      expect(response.body.body.description).toBe(category.description);
      expect(response.body.body._id).toBe(category.id);
    });

  //FindOne by title returns the correct object
  await supertest(app)
    .get(`/category/findOne/title/${category.title}`)
    .then(async (response) => {
      expect(response.body.success).toBe(true);
      expect(response.body.body.title).toBe(category.title);
      expect(response.body.body.description).toBe(category.description);
      expect(response.body.body._id).toBe(category.id);
    });
});

test("/category/create missing mandatory fields", async () => {
  const data = { title: "title", description: "Lorem ipsum", discount: 1 };
  await supertest(app)
    .post("/category/create")
    .send({ ...data, title: "" })
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe("Title and description are mandatory");
    });
  await supertest(app)
    .post("/category/create")
    .send({ ...data, description: "" })
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe("Title and description are mandatory");
    });
});

test("/category/create missing non-mandatory fields", async () => {
  const data = { title: "category 1", description: "Lorem ipsum" };
  await supertest(app)
    .post("/category/create")
    .send(data)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);

      //Response properties are equal to data properties
      expect(response.body.body.title).toBe(data.title);
      expect(response.body.body.description).toBe(data.description);

      //Missing data property is equal to the default
      expect(response.body.body.discount).toBe(0);

      expect(response.body.body._id).toBeTruthy();

      //New category saved in database
      const category = await Category.findOne({ _id: response.body.body._id });
      expect(category).toBeTruthy();

      //New category is equal to data
      expect(category.title).toBe(data.title);
      expect(category.description).toBe(data.description);
    });
});
test("/category/create with all the fields", async () => {
  const data = { title: "category 1", description: "Lorem ipsum", discount: 1 };
  await supertest(app)
    .post("/category/create")
    .send(data)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);

      //Response properties are equal to data properties
      expect(response.body.body.title).toBe(data.title);
      expect(response.body.body.description).toBe(data.description);
      expect(response.body.body.discount).toBe(data.discount);
      expect(response.body.body._id).toBeTruthy();

      //New category saved in database
      const category = await Category.findOne({ _id: response.body.body._id });
      expect(category).toBeTruthy();

      //New category is equal to data
      expect(category.title).toBe(data.title);
      expect(category.description).toBe(data.description);
    });
});

test("/category/update without mandatory fields", async () => {
  const category = await Category.create({
    title: "category 1",
    description: "Lorem ipsum",
    discount: 1,
  });
  const data = {
    title: "category 2",
    description: "Ipsum lorem",
    discount: 1,
    _id: category.id,
  };
  await supertest(app)
    .post("/category/update")
    .send({ ...data, title: "" })
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe("Title and description are mandatory");
    });

  await supertest(app)
    .post("/category/update")
    .send({ ...data, description: "" })
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe("Title and description are mandatory");
    });

  await supertest(app)
    .post("/category/update")
    .send({ ...data, _id: "" })
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe("No id sended");
    });
});

test("/category/update with incorrect id", async () => {
  const category = await Category.create({
    title: "category 1",
    description: "Lorem ipsum",
    discount: 1,
  });
  const data = {
    title: "category 2",
    description: "Ipsum lorem",
    discount: 1,
    _id: "incorrectId",
  };
  await supertest(app)
    .post("/category/update")
    .send(data)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(false);

      //Response properties are equal to data properties
      expect(response.body.body).toBe(
        "Cannot find the category in the database"
      );
    });
});

test("/category/update without non-mandatory fields", async () => {
  const category = await Category.create({
    title: "category 1",
    description: "Lorem ipsum",
    discount: 3,
  });
  const data = {
    title: "category 2",
    description: "Ipsum lorem",
    _id: category.id,
  };
  await supertest(app)
    .post("/category/update")
    .send(data)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);
      //Response properties are equal to data properties
      expect(response.body.body.title).toBe(data.title);
      expect(response.body.body.description).toBe(data.description);

      //Missing data property is equal to 0
      expect(response.body.body.discount).toBe(0);

      expect(response.body.body._id).toBeTruthy();

      //Category still saved in database
      const category2 = await Category.findOne({ _id: response.body.body._id });
      expect(category2).toBeTruthy();

      //Category is now equal to data
      expect(category2.title).toBe(data.title);
      expect(category2.description).toBe(data.description);

      //Missing data property is equal to 0
      expect(category2.discount).toBe(0);
    });
});

test("/category/update with all fields", async () => {
  const category = await Category.create({
    title: "category 1",
    description: "Lorem ipsum",
    discount: 3,
  });
  const data = {
    title: "category 2",
    description: "Ipsum lorem",
    discount: 2,
    _id: category.id,
  };
  await supertest(app)
    .post("/category/update")
    .send(data)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);
      //Response properties are equal to data properties
      expect(response.body.body.title).toBe(data.title);
      expect(response.body.body.description).toBe(data.description);
      expect(response.body.body.discount).toBe(data.discount);

      expect(response.body.body._id).toBeTruthy();

      //Category still saved in database
      const category2 = await Category.findOne({ _id: response.body.body._id });
      expect(category2).toBeTruthy();

      //Category is now equal to data
      expect(category2.title).toBe(data.title);
      expect(category2.description).toBe(data.description);
      expect(category2.discount).toBe(data.discount);
    });
});

test("/category/delete without correct id", async () => {
  await supertest(app)
    .get(`/category/delete/incorrectId`)
    .then(async (response) => {
      //Call returns an error
      expect(response.body.success).toBe(false);

      //Error message is the correct one
      expect(response.body.body).toBe(
        "Cannot find the category in the database"
      );
    });
});
test("/category/delete with correct id", async () => {
  const category = await Category.create({
    title: "category 1",
    description: "Lorem ipsum",
    discount: 3,
  });
  await supertest(app)
    .get(`/category/delete/${category._id}`)
    .then(async (response) => {
      //Call doesn't return an error
      expect(response.body.success).toBe(true);

      //Response properties are equal to data properties
      expect(response.body.body.title).toBe(category.title);
      expect(response.body.body.description).toBe(category.description);
      expect(response.body.body.discount).toBe(category.discount);
    });
});
