import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import mongoose,{ Schema } from "mongoose";

let model;
if(mongoose.models['users']){
    model=mongoose.models['users']
}
else{
    const userSchema = new Schema({
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
        },
        age: {
            type: Number,
            required: true
        },
        rol: {
            type: String,
            default: "User"
        },
        password: {
            type: String,
            required: true
        }
    })
    
    model= mongoose.model('users',userSchema)
}


export class ManagerUserMongoDB extends ManagerMongoDB {
    constructor() {
        super(model)
        //Aqui irian los atributos propios de la clase
    }

    async getElementByEmail(email) {
        try {
            return await this.model.findOne({ email: email })
        } catch (error) {
            return error
        }
    }
    //Aqui irian los metodos propios de la clase
}