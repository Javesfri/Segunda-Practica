import { Router } from "express";
import { isAuthenticated } from "../controllers/session.controller.js";
//import { ProductManager } from "../controllers/ProductManager.js"
import {ManagerProductMongoDB} from '../dao/MongoDB/models/Product.js'
const productManager=new ManagerProductMongoDB
const routerProduct = Router();

routerProduct.get("/",isAuthenticated, async (req, res) => {
  const mail=req.session.user.email
  const rol=req.session.user.rol
  console.log(req.session)
  const category = req.query.category;
  const sort = req.query.sort;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const data =await productManager.getPagProducts(category,sort,page,limit)
  const products=[...data.docs]
  const total=[]
  products.map(prod =>{
    const newProd={...prod._doc}
    const{title,description,price,code,category,thumbnail,stock}={...newProd}
    total.push({title:title,description:description,price:price,code:code,category:category,stock:stock ,imagen:thumbnail})

})
  const pages=data.totalPages
  let totalPages=[]
  for(let i=1;i<=pages;i++){
    totalPages.push({page:i})
  }
  res.render("products",{
    products:total,
    pages:totalPages,
    mail:mail,
    rol:rol
  })
  //res.send(products);
});

routerProduct.get("/:pid", async (req, res) => {
  const productId = await productManager.getElementById(req.params.pid);
  res.send(productId);
});

routerProduct.post("/", async (req, res) => {
  console.log(await req.body);
  let newProduct = await productManager.addElements(req.body);
  res.send(newProduct);
});


routerProduct.delete("/:id", async (req, res) => {
  await productManager.deleteElement(req.params.id);
  res.send(await productManager.getElements());
});

routerProduct.put("/:id", async (req, res) => {
  let updateProduct = await productManager.updateElement(
    req.params.id,
    req.body
  );
  res.send(updateProduct);
});

export default routerProduct;
