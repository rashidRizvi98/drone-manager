import { body, check } from "express-validator";

export const medicationCreationInputValidator = ()=> {
    return [
    body('name')
      .isLength({ min: 1 })
      .withMessage('Name must be at least 1 char long')
      .exists()
      .withMessage('Name number is required')
      .trim()
      .matches(/^[a-zA-Z0-9-_]+$/)
      .withMessage('allowed only letters, numbers, dashes and underscore for name')
      .escape(),
    body('code')
      .isLength({ min: 1 })
      .withMessage('Code must be at least 1 char long')
      .exists()
      .withMessage('Code is required')
      .trim()
      .matches(/^[A-Z0-9_]+$/)
      .withMessage('llowed only upper-case letters, underscore and number for code')
      .escape(),
    body('weight')
      .isInt({ min: 1 })
      .withMessage('Weight must be more than 0 ')
      .exists()
      .withMessage('Weight is required'),
    check('image')
    .custom((value, {req}) => {
        
        if(req.file.mimetype === 'image/jpg'){
            return '.jpg';
        }else 
        if(req.file.mimetype === 'image/jpeg'){
            return '.jpeg';
        }else 
        if(req.file.mimetype === 'image/png'){
            return '.png';
        }{
            return false;
        }
    })
    .withMessage('Please upload images of type .jpg,.jpeg or .png.')
  ];
}