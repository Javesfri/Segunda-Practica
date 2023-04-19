import { ManagerMongoDB } from "../../../db/mongoDBManager.js";
import mongoose,{Schema} from "mongoose";

let model;


if(mongoose.models['messages']){
    model=mongoose.models['messages']
}
else{
    const messageSchema = new Schema({
        nombre: String,
        email: {
            type: String,
            unique: true
        },
        message: String
    })
    model= mongoose.model('messages',messageSchema)
}



export class ManagerMessageMongoDB extends ManagerMongoDB {
    constructor() {
        super(model)
        //Aqui irian los atributos propios de la clase
    }
    //Aqui irian los metodos propios de la clase
}