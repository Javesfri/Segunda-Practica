import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import mongoose,{ Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
let model;


if(mongoose.models['products']){
    model=mongoose.models['products']
}
else{
    const productSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required:true,
        }, 
        code: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
    })
    productSchema.plugin(mongoosePaginate)
    model= mongoose.model('products',productSchema)
}


export class ManagerProductMongoDB extends ManagerMongoDB {
    constructor() {
        super(model)
        //Aqui irian los atributos propios de la clase
    }

    async getPagProducts(category,sort,page,limit){
        try {
            let query = {};
            if (category) {
              query.category = category;
            }
            let products = await this.model.paginate(query, {
              limit: limit,
              page: page,
              sort: sort,
            });
            return products
          } catch (error) {
            console.log(error);
            return error
          }
    }
    //Aqui irian los metodos propios de la clase
}