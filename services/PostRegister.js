const MongooseService = require( "./MongooseService" ); // Data Access Layer
const UserModel = require( "../models/user" ); // Database Model

class PostRegister {
  /**
   * @description Create an instance of PostService
   */
  constructor () {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService( UserModel );
  }

  /**
   * @description Attempt to create a post with the provided object
   * @param postToCreate {object} Object containing all required fields to
   * create post
   * @returns {Promise<{success: boolean, error: *}|{success: boolean, body: *}>}
   */
  async create ( userToCreate ) {
    try {
      const result = await this.MongooseServiceInstance.create( userToCreate );
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
}

module.exports = PostRegister;