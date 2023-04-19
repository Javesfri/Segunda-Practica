import local from 'passport-local'
import passport from 'passport'
import jwt from 'passport-jwt'
import GitHubStrategy from 'passport-github2'
import { managerUser } from '../controllers/user.cotroller.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import {authToken, generateToken} from '../utils/jwt.js'

//Passport se va a manejar como si fuera un middleware 
const LocalStrategy = local.Strategy //Estretagia local de autenticacion
//Passport define done como si fuera un res.status()


const JWTStrategy = jwt.Strategy //Estrategia de JWT
const ExtractJWT = jwt.ExtractJwt //Extractor ya sea de headers o cookies, etc


const initializePassport = () => {




    const cookieExtractor = (req) => {
        //Si existen cookies, verifico si existe mi cookie  sino asigno null
        const token = req.cookies ? req.cookies.jwtCookies : null
        //Si no existe, asigno undefined
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //De donde extraigo mi token
        secretOrKey: process.env.COOCKE_SECRET //Mismo valor que la firma de las cookies
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }

    }))


    //Ruta a implementar
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //Validar y crear Usuario
            const bodyReq = {...req.body}
            try {
                const user = await managerUser.getElementByEmail(username) //Username = email

                if (user) { //Usario existe
                    console.log("Usuario Existente")
                    return done(null, false) //null que no hubo errores y false que no se creo el usuario

                }

                const passwordHash = createHash(bodyReq.password)
                bodyReq.password=passwordHash
                const result = await managerUser.addElements(bodyReq)
                console.log("User Creado")
                const token=generateToken(result)
                console.log(token)
                return done(null, result) //Usuario creado correctamente

            } catch (error) {
                return done("Error al obtener el usario "+error)
            }

        }

    ))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await managerUser.getElementByEmail(username)

            if (!user) { //Usuario no encontrado
                console.log("User no encontrado")
                return done(null, false)
            }
            if (validatePassword(password, user.password)) { //Usuario y contraseña validos
                console.log("Sesion Iniciada")
                return done(null, user)
            }
            console.log("Constraseña invalida")
            return done(null, false) //Contraseña no valida

        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/authSession/githubSession',
         }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await managerUser.getElementByEmail(profile._json.email)

            if (user) { //Usuario ya existe en BDD
                done(null, user)
            } else {
                const passwordHash = createHash('coder123')
                const user={
                    first_name: profile._json.name,
                    last_name: ' ',
                    //profile._json.email ??
                    email:  profile._json.email,
                    age: 18,
                    password: passwordHash //Contraseña por default ya que no puedo accder a la contraseña de github
                }
                const userCreated = await managerUser.addElements(user)

                done(null, userCreated)
            }

        } catch (error) {
            return done(error)
        }
    }))

    //Iniciar la session del usuario
    passport.serializeUser(async (user, done) => {
        let userId = user._id
        if (Array.isArray(user)) {
            userId= user[0]._id;
        }
        done(null, userId)
    })

    //Eliminar la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await managerUser.getElementById(id)
        done(null, user)

    })

}

export default initializePassport;