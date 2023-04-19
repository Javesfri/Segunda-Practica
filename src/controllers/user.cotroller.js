import { ManagerUserMongoDB } from "../dao/MongoDB/models/User.js";

export const managerUser = new ManagerUserMongoDB()

export const createUser = async (req, res) => {
    res.redirect("/api/session/login")
}