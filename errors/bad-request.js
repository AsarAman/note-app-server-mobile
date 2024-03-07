import CustomAPIError from './custom-api.js'
import httpStatusCodes from 'http-status-codes'

class BadRequestError extends CustomAPIError{
    constructor(message){
      super(message)
      this.statusCode = httpStatusCodes.BAD_REQUEST
    }
  }
  export default BadRequestError