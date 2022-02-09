const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

const jsonDB = require('../model/jsonUsersDataBase');
const userModel = jsonDB('usersDataBase');
const bcrypt = require('bcryptjs'); 

const log = console.log; 


const usersController = {
    login: function(req,res) {
		
	
		res.render('users/login')
		
    },
    session: function (req,res){
		
		const resultValidation = validationResult(req);
		//console.log(resultValidation.mapped());
		//console.log(req.body.password);

		if (resultValidation.isEmpty()) {
			let users= userModel.all();
            let usuario=undefined;
			for (let i=0; i<users.length; i++) {
				if(users[i].email==req.body.email || users[i]['user-name']==req.body.email ){
					var esPass = bcrypt.compareSync(req.body.password,users[i].password);
					if(esPass){
						usuario=users[i];
						break;
					}
				}
			}
			if  (usuario== undefined){
				
				return res.render('users/login', {errors: [
					{msg: 'Lo sentimos, no encontramos tu cuenta'}
				]})	
			}
			console.log(usuario)

			req.session.a=usuario;
			res.redirect(`/users/${req.session.a.id}`)
		}else {
			return res.render("users/login", {errors: resultValidation.errors})
		}
	},
    register: function(req,res) {
        return res.render("users/register");
    },
	store: function(req, res){
		const resultValidation = validationResult(req);
		console.log('Aca va el file: ');
		console.log(req.file);
			// const error = new Error('Hubo un error intente nuevamente!')
			// return next(error)
		console.log(resultValidation.errors)
		if (resultValidation.errors.length > 0) {
			return res.render('users/register', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}else {
			console.log('Aca va el BODY: ')
			console.log(req.body);
			const contraEncritada = bcrypt.hashSync(req.body.password,10); 
			console.log('contraEncritada:');
			console.log(contraEncritada);
			var aCrear = {
				'user-name': req.body['user-name'], 
				password: contraEncritada, 
				name: req.body.name,
				surname: req.body.surname, 
				email: req.body.email, 
				fNac: req.body.fNac, 
				dni: Number(req.body.dni)
			}
			if (req.file) aCrear.image = req.file.filename;
			let aCrearID = userModel.create(aCrear);
			return res.redirect(`/users/${aCrearID}`);
		}
	},
	delete: function(req,res){
		const user = userModel.find(req.params.id);
		if (user.image != undefined) fs.unlinkSync(path.join(__dirname,`../../public/images/users/${user.image}`));
		userModel.delete(user.id);
		return res.redirect('/users');
	},

	list: (req,res)=>{
		const users = userModel.all();
		res.render('users/usersList',{users});
	},

	usuario: (req,res)=>{
		const usuario = userModel.find(req.params.id);
        res.render('users/usuario',{ element : usuario});
    }, 
	edition: (req,res) =>{
		var usuario = userModel.find(req.params.id); 
		res.render('users/userEdit', {element : usuario} );
	}, 
	update: (req,res)=>{
		const user = userModel.find(req.params.id); 
		let user_edit; 
		log('Aca va BODY: '); 
		log(req.body); 
		log('Aca va File: '); 
		log(req.file); 
		if ( req.file ){ 
			if (user.image != undefined) fs.unlinkSync(path.join(__dirname,`../../public/images/users/${user.image}`));
			user_edit = { 
				id: Number(user.id), 
				name: req.body.name,
				surname: req.body.surname, 
				'user-name': req.body['user-name'], 
				email: req.body.email, 
				dni: Number(req.body.dni), 
				fNac: req.body.fNac,
				image: req.file.filename,
				password: user.password,
				rol: user.rol
			}; 
		} else if(req.body['img-default'] == 'on') { 
			if (user.image != undefined) fs.unlinkSync(path.join(__dirname,`../../public/images/users/${user.image}`));
			user_edit = { 
				id: Number(user.id), 
				name: req.body.name,
				surname: req.body.surname, 
				'user-name': req.body['user-name'], 
				email: req.body.email, 
				dni: Number(req.body.dni), 
				fNac: req.body.fNac,
				password: user.password,
				rol: user.rol
			};
		}else { 
			user_edit = { 
				id: Number(user.id), 
				name: req.body.name,
				surname: req.body.surname, 
				'user-name': req.body['user-name'], 
				email: req.body.email, 
				dni: Number(req.body.dni), 
				fNac: req.body.fNac, 
				image: user.image,
				password: user.password,
				rol: user.rol
			};
		}
		log(user_edit); 
		userModel.update(user_edit); 
		res.redirect(`/users/${req.params.id}`);
	}

   
}

module.exports = usersController;