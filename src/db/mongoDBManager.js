import mongoose from "mongoose";

export class ManagerMongoDB {


    constructor(model) {
 //Atributo privado
        this.model = model
    }
    


   /* async #setConnection() {
        try {
            await mongoose.connect(this.#url)
            console.log("DB is connected")
            this.connected=true
        } catch (error) {
            return error
        }
    }*/

    async addElements(elements) { //Agrego 1 o varios elementos
        //await this.#setConnection()
        try {
            return await this.model.insertMany([elements])
        } catch (error) {
            return error
        }
    }

    async getElements() {
       // await this.#setConnection()
        try {
            return await this.model.find()
        } catch (error) {
            return error
        }
    }

    async getElementById(id) { //Agrego 1 o varios elementos
        //await this.#setConnection()
        try {
            return await this.model.findById(id)
        } catch (error) {
            return error
        }
    }

    async updateElement(id, info) {
        //await this.#setConnection()
        try {
            return await this.model.findByIdAndUpdate(id, info)
        } catch (error) {
            return error
        }
    }

    async deleteElement(id) {
      //  await this.#setConnection()
        try {
            return await this.model.findByIdAndDelete(id)
        } catch (error) {
            return error
        }
    }

}