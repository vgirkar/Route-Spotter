const {body} = require('express-validator');
const{validationResult} = require('express-validator');

//check if the route parameter is valid ObjectId type value
exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(id.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignUp = [
    body('firstName','First name cannot be empty' ).notEmpty().trim().escape(), 
    body('lastName','Last name cannot be empty').notEmpty().trim().escape(),
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})
];

exports.validateLogIn = [
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min:8, max:64})
];

exports.validateConnection = [
    body('name', 'Title cannot be empty and minimum 3 letters are required').notEmpty().trim().escape().isLength({min:3}),
    body('topic', 'Topic cannot be empty and minimum 3 letters are required').notEmpty().trim().escape().isLength({min:3}),
    body('details', 'Details cannot be empty and minimum 10 letters are required').notEmpty().trim().escape().isLength({min:10}),
    body('location', 'Location cannot be empty').notEmpty().trim().escape(),
    body('date', 'Date cannot be empty').notEmpty().trim().escape(),
    body('startTime', 'Start Time cannot be empty').notEmpty().trim().escape(),
    body('endTime', 'End Time cannot be empty').notEmpty().trim().escape(),
    body('image', 'Iimage cannot be empty').notEmpty().trim(),
    body('date').trim().isAfter(new Date().toDateString()).withMessage("Match Date should be valid and after Today's date")
];

exports.validateResult = (req, res, next) =>{
    let errors = validationResult(req);
    if (!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash ('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}