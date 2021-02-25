const assert = require( "chai" ).assert;
const mocha = require( "mocha" );
const Register = require('../../services/Register');

mocha.describe( "Register", () => {
    const PostServiceInstance = new Register();
    
    mocha.describe( "Create instance of register", () => {
       it( "Is not null", () => {
         assert.isNotNull( PostServiceInstance );
       } );
     
       it( "Exposes the createUser method", () => {
         assert.isFunction( PostServiceInstance.create );
       } );
     } );
  } );