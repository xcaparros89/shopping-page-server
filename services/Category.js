const MongooseService = require( "./MongooseService" ); // Data Access Layer
const CategoryModel = require( "../models/category" ); // Database Model

class Category {
  /**
   * @description Create an instance of category
   */
  constructor () {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService( CategoryModel );
  }

  /**
   * @description Attempt to create a post with the provided object
   * @param postToCreate {object} Object containing all required fields to
   * create post
   * @returns {Promise<{success: boolean, error: *}|{success: boolean, body: *}>}
   */
  async create ( categoryToCreate ) {
    try {
      const result = await this.MongooseServiceInstance.create( categoryToCreate );
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
  async findAll() {
    try {
      const result = await this.MongooseServiceInstance.find({});
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
  async findOne(params) {
    try {
      const result = await this.MongooseServiceInstance.find({params});
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
  async update(params) {
    try {
      const result = await this.MongooseServiceInstance.update({params});
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
  async delete(params) {
    try {
      const result = await this.MongooseServiceInstance.delete({params});
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
}

module.exports = Category;