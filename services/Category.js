const MongooseService = require("./MongooseService"); // Data Access Layer
const CategoryModel = require("../models/category"); // Database Model

class Category {
  /**
   * @description Create an instance of category
   */
  constructor() {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService(CategoryModel);
  }

  /**
   * @description Attempt to create a post with the provided object
   * @param postToCreate {object} Object containing all required fields to
   * create post
   * @returns {Promise<{success: boolean, error: *}|{success: boolean, body: *}>}
   */
  async create(categoryToCreate) {
    try {
      const {title, description} = categoryToCreate;
      if (!title | !description) {
        return { success: false, body: "Title and description are mandatory" };
      }
      const result = await this.MongooseServiceInstance.create(
        categoryToCreate
      );
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async findAll() {
    try {
      const result = await this.MongooseServiceInstance.find({});
      if (result.length) {
        return { success: true, body: result };
      } else {
        return { success: false, body: "No categories found" };
      }
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async findOne(params) {
    try {
      const result = await this.MongooseServiceInstance.findOne(params);
        return { success: true, body: result };
    } catch (err) {
      return { success: false, body: "No categories found" };
    }
  }
  async update(params) {
    try {
      //const user = await this.MongooseServiceInstance.findOne({_id: params._id});
      const { _id, title, description, discount } = params;
      if (!title | !description) {
        return { success: false, body: "Title and description are mandatory" };
      }
      if (!_id) {
        return { success: false, body: "No id sended" };
      }
      let newDiscount = discount? discount : 0;
      const result = await this.MongooseServiceInstance.update(
        { _id },
        { title, description, discount:newDiscount }
      );
      return { success: true, body: result };
    } catch (err) {
      return { success: false, body: "Cannot find the category in the database" };
    }
  }
  async delete(id) {
    try {
      const result = await this.MongooseServiceInstance.delete(id);
      return { success: true, body: result };
    } catch (err) {
      return { success: false, body: "Cannot find the category in the database" };
    }
  }
}

module.exports = Category;
