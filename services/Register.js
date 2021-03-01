const MongooseService = require("./MongooseService"); // Data Access Layer
const UserModel = require("../models/user"); // Database Model
const bcrypt = require("bcryptjs");

class Register {
  /**
   * @description Create an instance of PostService
   */
  constructor() {
    // Create instance of Data Access layer using our desired model
    this.MongooseServiceInstance = new MongooseService(UserModel);
  }

  /**
   * @description Attempt to create a post with the provided object
   * @param postToCreate {object} Object containing all required fields to
   * create post
   * @returns {Promise<{success: boolean, error: *}|{success: boolean, body: *}>}
   */
  async create({
    username,
    email,
    password,
    address,
    name,
    surnames,
    city,
    state,
    zip,
  }) {
    try {
      if (
        !username |
        !email |
        !password |
        !address |
        !name |
        !surnames |
        !city |
        !state |
        !zip
      ) {
        return { success: false, body: "fill all the required fields" };
      }
      const user = await this.MongooseServiceInstance.findOne({ email: email });
      if (user !== null) {
        return { success: false, body: "This email is already registered" };
      }

      const repeatedUser = await this.MongooseServiceInstance.findOne({ username: username });
      if (repeatedUser !== null) {
        return { success: false, body: "This username is already used" };
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const result = await this.MongooseServiceInstance.create({
        username,
        email,
        password:hashPass,
        address,
        name,
        surnames,
        city,
        state,
        zip,
      });
      return { success: true, body: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
}

module.exports = Register;
