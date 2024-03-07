import httpStatusCodes from 'http-status-codes'
import CustomAPIError from './custom-api.js'

class UnauthenticatedError extends CustomAPIError{
    constructor(message){
      super(message)
      this.statusCode = httpStatusCodes.FORBIDDEN
    }
  }

export default UnauthenticatedError