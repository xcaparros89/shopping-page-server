const MongooseService = require( "./MongooseService" ); // Data Access Layer
const UserModel = require( "../models/user" ); // Database Model
const bcrypt = require("bcryptjs");

class Login {
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
  async findOne(params) {
    try {
        console.log('params');
      const result = await this.MongooseServiceInstance.findOne({username: params.username});
      if(result === null || !bcrypt.compareSync(params.password, result.password)){
          return {success:false, body:'The user and/or password are incorrect'}
      }
      return { success: true, body: result };
    } catch ( err ) {
      return { success: false, error: err };
    }
  }
}

module.exports = Login;