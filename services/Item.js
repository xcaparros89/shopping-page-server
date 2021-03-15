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
   * @returns {Promise<{success: boolean, body: *}|{success: boolean, body: *}>}
   */
  async create ( itemToCreate ) {
    try {
      const {title, description, price, tags, img, discount} = itemToCreate;
      if(!title | !description | !price | !tags | !img){
        return { success: false, body: 'Title, description, price, tags and img are mandatory' };
      }
      const sameTitle = await this.MongooseServiceInstance.findOne({title})
      if(sameTitle){
        return {success:false, body:'There is already a item with the same title in the database'}
      }
      const result = await this.MongooseServiceInstance.create( {title, description, price, tags, img, discount} );
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, body: err };
    }
  }
  async findAll() {
    try {
      const result = await this.MongooseServiceInstance.find({});
      if (result.length) {
        return { success: true, body: result };
      } else {
        return { success: false, body: "No items found" };
      }
    } catch ( err ) {
      return { success: false, body: err };
    }
  }
  async findOne(params) {
    try {
      const result = await this.MongooseServiceInstance.findOne(params);
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, body: "No items found"  };
    }
  }
  async update(params) {
    try {
      const {_id, title, description, price, tags, img, discount} = params;
      if(!title | !description | !price | !tags | !img){
        return { success: false, body: 'Title, description, price, tags and img are mandatory' };
      }
      if(!_id){
        return { success: false, body: 'No id sended' };
      }
      const result = await this.MongooseServiceInstance.update({_id}, {title, description, price, tags, img, discount});
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, body: 'Cannot find the item in the database'  };
    }
  }
  async delete(id) {
    try {
      const result = await this.MongooseServiceInstance.delete(id);
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, body: "Cannot find the item in the database" };
    }
  }
}

module.exports = Item;