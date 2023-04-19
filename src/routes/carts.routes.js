import { Router } from "express";
//import { CartManager } from "../controllers/CartManager.js";
import { getManagerProducts,getManagerCart}  from "../dao/daoManager.js";
import {ManagerCartMongoDB} from '../dao/MongoDB/models/Cart.js'


const routerCart = Router();
const cartManager=new ManagerCartMongoDB



routerCart.post('/', async (req,res)=>{
    const newCart = await cartManager.createCart()
    res.send(newCart)
})

routerCart.get('/', async (req,res)=>{
    const newCart = await cartManager.getElements()
    res.send(newCart)
})

routerCart.get('/:cid', async (req,res)=>{
    const cart=await cartManager.getProducts(req.params.cid)
    const listProducts=await cart.products
    console.log(await listProducts)
    const total=[]
    listProducts.map(prod =>{
        const newProd={...prod.product._doc}
        console.log(newProd)
        const{title,description,price,code,category,thumbnail}=newProd
        total.push({title:title,description:description,price:price,code:code,category:category,quantity:prod.quantity ,imagen:thumbnail})

    })
    //res.send(total)
    res.render("cart", {total})

})


routerCart.post('/:cid/products/:pid',async (req,res)=>{
    const addProductToCart=await cartManager.addProduct(req.params.cid,req.params.pid)
    res.send(addProductToCart)
})




routerCart.delete('/:cid/products/:pid',async (req,res)=>{
    const deleteProductOfCart=await cartManager.deleteProduct(req.params.cid,req.params.pid);
    res.send(deleteProductOfCart);
})

routerCart.delete('/:cid', async(req,res) =>{
    const deleteAllProducts= await cartManager.deleteAllProducts(req.params.cid);
    res.send(deleteAllProducts);
})

routerCart.put('/:cid/products/:pid', async (req,res)=>{
    const updateProduct= await cartManager.updateProduct(req.params.cid,req.params.pid,req.body)
    res.send(updateProduct)
})

export default routerCart