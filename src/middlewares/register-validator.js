const {body} = require('express-validator'); 
const path = require('path');
const jsonDB = require('../model/jsonUsersDataBase');
const userModel = jsonDB('usersDataBase'); 

var fecha = new Date(); 
var mes = fecha.getMonth() + 1;  
var dia = fecha.getDate(); 
var anio = fecha.getFullYear();
var f = new Date(anio,mes,dia); 

const validator = [
    body('user-name').notEmpty().withMessage('Debe escribir un nombre de usuario'),

    body('name').notEmpty().withMessage('Debe escribir un nombre'),
    
    body('surname').notEmpty().withMessage('Debe escribir un apellido'),
    
    body('email').notEmpty().withMessage('Debes escribir un correo electrónico').bail()
        .isEmail().withMessage('Debes escribir un formato de correo válido').bail()
        .custom((value, {req})=>{
            var email = req.body.email; 
            var users = userModel.all();
            var emails = [];
            users.forEach(user => {
                emails.push(user.email);
            }); 
            console.log(emails);
            console.log(email);
            if(emails.includes(email)) throw new Error('El un email ya registrado debe ingresar otro')
            return true;
        }),

    body('password').notEmpty().withMessage('Escriba una contraseña').bail()
        .isLength({min:6}).withMessage('Debe tener minimo 6 caracteres'), 
    
    body('confirm-password').notEmpty().withMessage('Escriba una contraseña').bail()
        .isLength({min:6}).withMessage('Debe tener minimo 6 caracteres').bail()
        .custom((value, {req})=>{
            var pas = req.body.password; 
            var pass = req.body['confirm-password']; 
            if (pas != pass) throw new Error('Debe poner la misma contraseña');
            return true;
        }), 

    body('dni').notEmpty().withMessage('Debe un DNI').bail()
        .isLength({min:7, max:9}).withMessage('Escriba un DNI valido'),

    body('fNac').notEmpty().withMessage('Debe elegir una fecha').bail()
        .trim()
        .isDate().withMessage('Debe ser una fecha valida'),

    body('image').custom((value, { req }) => {
        let file = req.file;
        let acceptedExtensions = ['.jpg', '.png', '.gif'];
        if( file ) {
            let fileExtension = path.extname(file.originalname);
            if (!acceptedExtensions.includes(fileExtension)) {
                throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
            }
        }
        return true;
    }), 

]

module.exports = validator; 
