const jsonDB = require('../model/jsonProductsDataBase');
const productModel = jsonDB('productsDataBase');
const categories = ["Blusas", "Remeras", "Vestidos", "Monos", "Shorts", "Faldas", "Jeans"];
const sizes = ['XS','S','M','L','XL','XXL'];
const colours = [{name:'Rojo',cod:'red'},{name:'Azul',cod:'blue'},{name:'Verde',cod:'green'},{name:'Negro',cod:'black'},{name:'Blanco',cod:'white'},{name:'pink',cod:'pink'}]
const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const productController = {
    prodDetail: (req,res) =>{
        let product = productModel.find(req.params.productId)
        const productList = productModel.readFile();
        return res.render("products/productDetail",{ product,productList })    
    },
    
    list: (req,res) => {
        const productList = productModel.readFile();
        return res.render('products/productList', { productList })
    },

    create: (req,res) => {
        return res.render("products/productCreate",{sizes,colours,categories})
    },

    store: (req,res)=>{
        console.log('Entrando a Store del productController');
        console.log('Va el req.file: ')
        console.log(req.file);
        console.log('Va req.files: ')
        console.log(req.files);
        console.log('Aca va el BODY: ')
        console.log(req.body);
        const resultValidation = validationResult(req); 
        console.log(resultValidation.errors);
        if(resultValidation.errors.length > 0 ){ 
            return res.render('products/productCreate', { 
                errors: resultValidation.mapped(), 
                oldData: req.body,
                categories, 
                sizes, 
                colours
            })
        }else{ 
            let colorArray = req.body.color;
            let sizesArray = req.body.sizes;
            if(!Array.isArray(req.body.color)) colorArray = [req.body.color];
            if(!Array.isArray(req.body.sizes)) sizesArray = [req.body.sizes];  
            let filenamesImgSec = [];
            if(req.files.images){ 
                for(let i =0; i < req.files.images.length; i++) filenamesImgSec.push(req.files.images[i].filename);
            }
            let aCrear = {
                name: req.body.name,
                price: Number(req.body.price),
                description: req.body.description, 
                stars: 0,
                category: req.body.category,
                'img-pr': req.files.image[0].filename, 
                'img-se': filenamesImgSec
            };
            aCrear.colours = colorArray; 
            aCrear.sizes = sizesArray;
            console.log('aCrear: ');
            console.log(aCrear);
            productModel.create(aCrear);
            return res.redirect('/products'); 
        }
    },
    
    edition: (req,res) => {
        let product=productModel.find(req.params.id);
        return res.render("products/productEdition", {product,categories,colours,sizes,})
    },

    prodEdition: (req,res)=>{
      let product = productModel.find(req.params.id)
      let imgP = product['img-pr'];
      let colorArray = req.body.colours;
      let sizesArray = req.body.sizes;
      if(!Array.isArray(req.body.colours)) colorArray = [req.body.colours];
      if(!Array.isArray(req.body.sizes)) sizesArray = [req.body.sizes];  

      let imgSecArray = req.body.imgSec;
      if(!Array.isArray(req.body.imgSec)) imgSecArray = [req.body.imgSec];
      console.log('Aca va Files: ');
      console.log(req.files);
      if (req.files.image){
        fs.unlinkSync(path.join(__dirname,`../../public/images/products/${product['img-pr']}`))
        imgP = req.files.image[0].filename;
      }
      if (req.files.images){
        product['img-se'].forEach(img => {
            if ( ! imgSecArray.find( imagen => imagen ==  img) ){
                console.log("Elimina la imagen", img )
                fs.unlinkSync(path.join(__dirname,`../../public/images/products/${img}`))
            }
        });
        for(let i =0; i < req.files.images.length; i++) imgSecArray.push(req.files.images[i].filename);
      }
      console.log('Aca va BODY: ');
      console.log(req.body);
      let productBody={
        id: Number(req.params.id),
        name: req.body.name,
        price: Number(req.body.price) ,
        description: req.body.description ,
        category: req.body.category,
        colours: colorArray,
        sizes: sizesArray,
        stars: Number(product.stars),
        'img-pr': imgP,
        'img-se': imgSecArray
    };
    console.log("Aca va req.files: ");
    console.log(req.files);
    productModel.update(productBody);

    res.redirect(`/products/${product.id}`);
    },
    filter: (req,res)=>{ 
        const query = req.query; 
        const aFiltrar = Object.values(query);
        let filtrado;
        if (Object.keys(query)[0].indexOf('styles') == 0 ){ 
            filtrado = productModel.filterFroStyle(aFiltrar);
        }else{
            filtrado = productModel.filterForCategories(aFiltrar);
        }
        return res.render('products/productfilter',{productList: filtrado, Filtros: aFiltrar});
    },
    prodCart: function (req,res){
        console.log(req.params.id)
        console.log(req.body.cant)
        let prod = [req.params.id,req.body.cant,req.body.sizes]
        res.cookie('carrito', prod, {maxAge:60000*60*60});
        console.log(req.cookies.carrito)
        res.redirect('/products/productCart')
    },
    prodCart1: function(req,res){
        if(req.cookies.carrito){
            let product = productModel.find(req.cookies.carrito[0])
            product.cant = Number(req.cookies.carrito[1])
            product.size = req.cookies.carrito[2]
            product.total = product.price*product.cant
            console.log(product)
            return res.render("products/productCart",{product})
        }else{
            return res.render("products/productCart")
        }
        
    },
    
    prodCart2: function(req,res) {
        return res.render("products/productCart2")
    },
    
    prodCart3: function(req,res) {
        return res.render("products/productCart3")
    },
    
    prodCart4: function(req,res) {
        if(req.cookies.carrito){
            let product = productModel.find(req.cookies.carrito[0])
            product.cant = Number(req.cookies.carrito[1])
            product.total = product.price*product.cant
            console.log(product)
            return res.render("products/productCart4",{product})
        }else{
            return res.render("products/productCart4")
        }
    },
    destroy: (req, res) =>{
        let product = productModel.find(req.params.id)
		fs.unlinkSync(path.join(__dirname,`../../public/images/products/${product['img-pr']}`))
		for(let i =0; i < product['img-se'].length ; i++){
            fs.unlinkSync(path.join(__dirname,`../../public/images/products/${product['img-se'][i]}`))
        };
        productModel.delete(req.params.id);
		res.redirect('/products');
    }
};

module.exports = productController;
