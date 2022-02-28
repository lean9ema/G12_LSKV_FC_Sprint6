const db = require("../database/models");

const homeController = {
   index: (req,res) =>{
        Promise.all([db.Categorys.findAll(),db.Styles.findAll()])
        .then(arrValores=>{
             console.log('Aca va el arr de cate y styles:\m',arrValores[0])
             console.log('Blusa:',arrValores[0].find(e=> e.name == "Blusas").id)
             return res.render("home1/home", 
             {
                  categories : arrValores[0],
                  styles: arrValores[1]
          });
        })
        .catch(err=>console.log(err));
        },
   locals: (req,res) =>{
        return res.render("locals");
        },
   contact: (req,res) =>{
        return res.render("contact");
        },
   business: (req,res) =>{
          return res.render("empresa")
        },
   logout: (req,res) => {
        delete req.session.a
        res.redirect('/')
   },
}

module.exports = homeController; 