import jwt from 'jsonwebtoken';

export function verifyJWTToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject([err, decodedToken])
      }
      resolve(decodedToken);
    })
  })
}

export function createJWToken(sessionData) {
  if (typeof sessionData !== 'object') {
    sessionData = {}
  }
  let token = jwt.sign({
     data: sessionData
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFE_TIME,
      algorithm: process.env.JWT_ALGORITHM
  })

  return token
}

export default {
    verifyJWTToken,
    createJWToken
}