import jwt from 'jsonwebtoken'

export const generateJwtToken = (tokenPayload: object, secretKey: string, expiresIn = '') => {
  try {
    if (!tokenPayload || Object.keys(tokenPayload).length === 0) {
      throw new Error('Token payload must be non-empty Object')
    }
    if (typeof secretKey !== 'string' || secretKey === '') {
      throw new Error('secretKey must be must be non-empty String ')
    }
    if (!expiresIn) {
      throw new Error('expiresIn must be provided')
    }

    return jwt.sign(tokenPayload, secretKey, { expiresIn: expiresIn })

  } catch (error) {
    throw error
  }
}

export const verifyJwtToken = (tokenPayload: '', secretKey: string) => {
  try {
     if (!tokenPayload || Object.keys(tokenPayload).length === 0) {
       throw new Error('Token payload must be non-empty Object')
     }
    if (typeof secretKey !== 'string' || secretKey === '') {
      throw new Error('secretKey must be must be non-empty String ')
    }

  return jwt.verify(tokenPayload, secretKey)

  } catch (error) {
    throw error
  }
}