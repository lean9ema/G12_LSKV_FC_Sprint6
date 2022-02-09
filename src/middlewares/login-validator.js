const {body} = require('express-validator'); 
const path = require('path');

const validatorLogin=[
    body('email').notEmpty().withMessage('Debes escribir un correo electrónico'),/*.bail()
    .isEmail().withMessage('Debes escribir un formato de correo válido'),*/

    body('password').notEmpty().withMessage('Escriba una contraseña').bail()
        .isLength({min:6}).withMessage('Debe tener minimo 6 caracteres'),

                   ]

module.exports = validatorLogin; 