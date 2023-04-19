import jwt  from "jsonwebtoken";
export const generateToken = (user) =>{
 /*
    1er: Objeto asociacion del token
    2do: Clave privada del cifrado 
    3er: Tiempo de expiracion
 */

    const token = jwt.sign({user},process.env.COOCKE_SECRET,{expiresIn: '24h'})
    return token
}

export const authToken = (req,res,next) =>{
    //consultar en el header el token
    const authHeader = req.headers.authorization

    //Token no existente o expirado
    if(!authHeader){
        return res.status(401).send({error: "Usuario no autenticado"})
    };
    //
    const token = authHeader.split(" ")[1];

    //Validar si el token existe
    jwt.sign(token,process.env.COOCKE_SECRET, (error, credentials) =>{
        if(error){
            return res.status(403).send({error: "Usuario no autorizado"})
        }

        //Token existe y valido
        req.user = credentials.user;
        next()
    });

}