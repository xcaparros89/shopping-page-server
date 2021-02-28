const MongooseService = require( "./MongooseService" ); // Data Access Layer
const ItemModel = require( "../models/item" ); // Database Model

class Item {
  /**
   * @description Create an instance of Item
   */
  constructor () {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService( ItemModel );
  }

  /**
   * @description Attempt to create a post with the provided object
   * @param postToCreate {object} Object containing all required fields to
   * create post
   * @returns {Promise<{success: boolean, error: *}|{success: boolean, body: *}>}
   */
  async create ( itemToCreate ) {
    try {
      const result = await this.MongooseServiceInstance.create( itemToCreate );
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
  async find(params) {
    try {
        console.log(params);
      const result = await this.MongooseServiceInstance.find({});
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
}

module.exports = Item;