import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import mongoose,{ Schema } from "mongoose";
import {ManagerProductMongoDB} from "./Product.js"

const managerProduct= new ManagerProductMongoDB
let model;
if(mongoose.models['cart']){
    model=mongoose.models['cart']
}
else{
    const Schema = new mongoose.Schema({
        products:{
            type: [
                {
                    product:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products',
                        
                    },
                    quantity:Number
                    
                }
            ],
            default:[]
        }

    });
    model= mongoose.model('cart',Schema)
}


export class ManagerCartMongoDB extends ManagerMongoDB {
    constructor() {
        super(model)
        //Aqui irian los atributos propios de la clase
    }
    async addProduct(idCart,idProduct){
        if(await managerProduct.getElementById(idProduct)){
            try{
                const cart=await this.model.findById(idCart)
                let index=await cart.products.findIndex(element => element.product==idProduct)
                if(index !=-1){
                    cart.products[index].quantity+=1;
                }
                else{
                    await cart.products.push({  
                        product:idProduct,
                        quantity: 1})
                } 
                console.log(await cart) 
                cart.save()
                return cart
            }catch(error){
                console.log(error)
                return error
            }
        }
        return("No se encontro El producto")
    }

    async deleteProduct(idCart,id){
        if(managerProduct.getElementById(id)){
            try{
                const cart=await this.model.findById(idCart)
                await cart.products.remove(id)
                await cart.save()
                
                return (cart)
            }catch(error){
                console.log(error)
                return error
            }
        }
        return("No se encontro El producto")
    }

    async getProducts(idCart){
        try{
            const cart= await this.model.findById(idCart)
            let cartTotal=await cart.populate('products.product')
            return  cartTotal
        }catch(error){
            console.log(error)
            return (error)
        }
    }
    
    async deleteAllProducts(idCart){
        try{
            const cart=await this.model.findById(idCart)
            cart.products=[]
            cart.save()
            return("Carrito Vacio")
        }catch(error){
            console.log(error)
            return error
        }
        
    }

    async updateProduct(idCart,idProduct,quantity){
        try{
            const cart=await this.model.findById(idCart)
            let index=await cart.products.findIndex(element => element.product==idProduct)
            if(index !=-1){
                cart.products[index].quantity=parseInt(quantity.quantity);
            }
            cart.save()
            return(cart)
        }catch(error){
            console.log(error)
            return error
        }
    }

    async createCart(){
        try{
            return await this.model.create({})
        }catch(error){
            console.log(error)
            return error
        }

    }

    //Aqui irian los metodos propios de la clase
}