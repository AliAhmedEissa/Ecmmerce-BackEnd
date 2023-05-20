import joi from 'joi'
import { Types } from 'mongoose';

const validationObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message('in-valid Id')
}
export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
    id: joi.string().custom(validationObjectId).required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}

export const validation = (schema, isHeadersSent = false) => {
    return (req, res, next) => {
        let requestData = {
            ...req.body,
            ...req.query,
            ...req.params,
            // ...req.headers,
        }
        if (req.file || req.files) requestData.file = req.file || req.files
        if (req.headers?.authorization && isHeadersSent) requestData = { authorization: req.headers.authorization }
        const validationResult = schema.validate(requestData, {
            abortEarly: false
        })
        if (validationResult?.error) {
            return res.status(400).json({ message: "Validation Error", Errors: validationResult.error.details })
        }
        next()
    }
}
