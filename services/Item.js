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
      const result = await this.MongooseServiceInstance.findOne(params);
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
  async update(params) {
    try {
      //const user = await this.MongooseServiceInstance.findOne({_id: params._id});
      const {_id, title, description, price, tags, img, discount} = params;
      if(!title | !description | !price | !tags | !img){
        //fes un loop que torni els fields que estan buits.
        return { success: false, error: 'Title, de are mandatory' };
      }
      if(!_id){
        return { success: false, error: 'Need id' };
      }
      const result = await this.MongooseServiceInstance.update({_id}, {title, description, price, tags, img, discount});
      if(!result){
        return { success: false, error: 'Cannot find the item in the database' };
      }
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

module.exports = Item;