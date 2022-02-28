const fs = require('fs');
const path = require('path');
const db=require("../database/models");
const { Op } = require("sequelize");
const { validationResult } = require('express-validator'); 
const log = console.log;
db.Categorys.findAll()
.then(res => categories = res)
db.Sizes.findAll()
.then(res => sizes = res)
db.Styles.findAll()
.then(res => styles = res)
db.Colours.findAll()
.then(res => colours = res)

const productController = {
    prodDetail: (req,res) =>{
        db.Products.findByPk(req.params.productId)
        .then(product=>{
            console.log("Aca va el PRODUCTO",product);
            console.log("Aca va ID",product.id);
            console.log("Aca va C",product.idColour);
            db.Colours.findByPk(product.idColour)
            .then(color=> {
                let url_color = color.urlColour
                db.Sizes.findByPk(product.idColour)
                .then(size=> {
                    let talle = size.name
                    db.Image_product.findOne({
                        where:{idproducts:product.id}
                    })
                    .then(image=>{
                        console.log(image);
                        let url_image = image.urlName;
                        console.log(url_image);
                        return res.render("products/productDetail",{product,
                             url_color, talle, url_image})
                    })
                    .catch(err => console.log("Este es de IMAGE",err));        
                })
            })    
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    },
    
    list: (req,res) => {
        console.log("Entre a producto List")
        db.Products.findAll()
            .then(function(productList){
                console.log(productList)
                db.Image_product.findAll()
                  .then(images=>{
                res.render('products/productList', { productList, images});
                  })
            })
            .catch(err => console.log(err));
    },

    create: (req,res) => {
        console.log("Aca van los colores",colours);
        return res.render("products/productCreate",{sizes,colours,styles,categories})
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
            db.Products.create({
                name: req.body.name,
                price: Number(req.body.price),
                description: req.body.description, 
                idStar: 1,
                idCategory: req.body.category,
                idColour: colorArray[0],
                idSize:sizesArray[0],
                idStyle: req.body.Style
            })
            .then(res => {
                console.log("Creando producto" ,res)
                console.log("id del producto",res.dataValues.id)
                db.Image_product.create({
                    urlName: req.files.image[0].filename,
                    idproducts: res.dataValues.id
                })
                .then(res=>console.log("imagen",res))
            })
            .catch(err => console.log(err))
            return res.redirect('/'); 
        }
    },
    
    edition: (req,res) => {
        db.Products.findByPk(req.params.id)
        .then(resP => {
            let product = resP
            db.Image_product.findOne({where:{idproducts: req.params.id}})
            .then(resI =>  {
                let imgP = resI
                return res.render("products/productEdition", {product,categories,colours,sizes,imgP})
            })
            .catch(err => console.log("imagen",err))
            
        })
        .catch(err => console.log("producto",err))
        
    },

    prodEdition: (req,res)=>{
    db.Products.findByPk(req.params.id)
        .then(resP => {
            let product = resP
            db.Image_product.findOne({where:{idproducts : req.params.id}})
            .then(resI =>  {
                let imgP = resI.urlName
                let colorArray = req.body.color;
                let sizesArray = req.body.sizes;
                if(!Array.isArray(req.body.color)) colorArray = [req.body.color];
                if(!Array.isArray(req.body.sizes)) sizesArray = [req.body.sizes];  
                log("Aca color",colorArray); 
                log("Aca va size", sizesArray)
                let imgSecArray = req.body.imgSec;
                if(!Array.isArray(req.body.imgSec)) imgSecArray = [req.body.imgSec];
                console.log('Aca va Files: ');
                console.log(req.files);
                if (req.files.image){
                    fs.unlinkSync(path.join(__dirname,`../../public/images/products/${imgP.urlName}`))
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

                    db.Products.update(
                    {
                        name: req.body.name,
                        price: Number(req.body.price),
                        description: req.body.description, 
                        idStar: 1,
                        idCategory: req.body.category,
                        idStyles: req.body.Style,
                        idColour: colorArray[0],
                        idSize: sizesArray[0]
                    },
                    {
                        where: {id: product.id}
                    })
                    .then(()=>{
                        db.Image_product.update({
                            urlName: imgP,
                            idproducts: product.id
                        },
                        {
                            where: {idproducts: product.id}
                        })
                        .then(resImg=>
                            {
                                console.log("imagen",resImg)
                                res.redirect(`/products/${req.params.id}`);
                            })
                    })
                        })
                        .catch(err => console.log("imagen",err))
        })
        .catch(err => console.log("producto",err))
    },

    filter: (req,res)=>{ 
        const query = req.query; 
        console.log("Controller Filter: ",query);
        const indexFilter = Object.values(query);
        if (Object.keys(query)[0].indexOf('styles') == 0 ){ 
            Promise.all([
                db.Styles.findOne({
                    where:{
                        id: query.styles
                    }
                }),
                db.Products.findAll({
                    where:{
                        idStyle: query.styles
                    }
                }),
                db.Image_product.findAll()
            ])
            .then(ArrStyleProds=>{
                log('Aca va Arr:\n',ArrStyleProds);
                log('Style',[ArrStyleProds[0]][0].name)
                return res.render('products/productfilter',{images:ArrStyleProds[2],productList:  ArrStyleProds[1], Filtros: [ArrStyleProds[0]]});
            })
            .catch(err=> console.log(err))
        }else{
            var filtro2 = query.category;
            if (query.category1) filtro2 = query.category1;
            Promise.all([
                db.Categorys.findAll({
                    where:{
                        [Op.or]:[
                            { id: query.category },
                            { id: filtro2 }
                          ]
                    }
                }),
                db.Products.findAll({
                    where:{
                        [Op.or]: [
                            { idCategory: query.category }, 
                            { idCategory: filtro2 }
                          ]
                    }
                }), 
                db.Image_product.findAll()
            ])
            .then(ArrCateProds=>{
                log('Aca va Arr: \n',ArrCateProds)
                let cate = ArrCateProds[0];
                if(!Array.isArray(cate)) cate = [cate];
                return res.render('products/productFilter',{images:ArrCateProds[2],productList: ArrCateProds[1], Filtros: cate});
            })
            .catch(err=> console.log(err))
        }
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
        db.Image_product.findOne({where:{idproducts:req.params.id}})
        .then(ImgP =>{
            console.log(path.join(__dirname,`../../public/images/products/${ImgP.urlName}`))
            fs.unlinkSync(path.join(__dirname,`../../public/images/products/${ImgP.urlName}`))
            db.Image_product.destroy({where:{idproducts:req.params.id}})
                .then(db.Products.destroy({where:{id: req.params.id}}))
        })
    res.redirect("/products")
    }
}
   
module.exports = productController;
