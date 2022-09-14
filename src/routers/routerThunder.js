import express from 'express';
import { Router } from 'express';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// import controladorGeneral from '../controladores/controladorGeneral.js';
import controladorComplejoThunder from '../controladores/controladorComplejoThunder.js';
// import controladorComplejo from '../controladores/controladorComplejo.js';
import { passportMiddleware } from '../passport/passport.js';
import { passportSessionHandler } from '../passport/passport.js';
import controladorFail from '../controladores/controladorFail.js';
import log4js from 'log4js';
import {configuracion, loggerConsola, loggerWarning} from '../log4js/log4.js';
import {puerto} from '../minimist/minimist.js';
import compression from 'compression';
configuracion();


const thunderRouter = new Router();
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

thunderRouter.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://root:1234@cluster0.5xw3itz.mongodb.net/?retryWrites=true&w=majority`,
        mongoOptions: advancedOptions
    }),
    secret: '123456789',
    resave: true,
    saveUninitialized: true
}));
thunderRouter.use(passportMiddleware);
thunderRouter.use(passportSessionHandler);
thunderRouter.use(express.json());
thunderRouter.use(express.urlencoded({ extended: true }));

// thunderRouter.get('/registro', controladorGeneral.getRegistro);
thunderRouter.post('/loginThunder', controladorComplejoThunder.postLoginThunder);
// thunderRouter.get('/login', controladorGeneral.getLogin);
// thunderRouter.get('/inicio', controladorComplejo.getInicio);
thunderRouter.post('/inicioThunder', passport.authenticate('login', { failureRedirect: '/fail-login', failureFlash: true}), controladorComplejoThunder.postInicioThunder);
// thunderRouter.get('/fail-registro', controladorFail.getFailRegistro);
// thunderRouter.get('/fail-login', controladorFail.getFailLogin);
thunderRouter.get('/logoutThunder', controladorComplejoThunder.getLogoutThunder);
// thunderRouter.get('/info', compression(), controladorComplejo.getInfo);
// thunderRouter.post('/carrito', controladorComplejo.postCarrito);//CAMBIAR A "postCarrito"
// thunderRouter.get('/carrito', controladorComplejo.getCarrito);
// thunderRouter.post('/carritoDone', controladorComplejo.postCarritoDone);
// thunderRouter.get('/carritoDone', controladorComplejo.getCarritoDone);
thunderRouter.get('/carritoThunder', controladorComplejoThunder.getCarritoThunder);
thunderRouter.post('/createProduct', controladorComplejoThunder.postProduct);
thunderRouter.get('/getProductByName', controladorComplejoThunder.getProductByName);
thunderRouter.get('/getAllProducts', controladorComplejoThunder.getAllProducts);
thunderRouter.put('/updateCarrito', controladorComplejoThunder.updateCarritoCantidad);
thunderRouter.put('/updateProduct', controladorComplejoThunder.updateProduct);
// thunderRouter.get('/', controladorGeneral.getLogin);
thunderRouter.delete('/deleteProduct', controladorComplejoThunder.deleteProduct);
thunderRouter.post('/createCarrito', controladorComplejoThunder.createCarritoOnlyAdmin);
// thunderRouter.get('/test/:name', controladorGeneral.dtoTester);
// thunderRouter.get('*', (req, res)=>{
//     loggerWarning.warn(`localhost:${puerto}${req.params[0]}`);
//     loggerWarning.warn(`Metodo: GET`);
//     res.send('Ruta inexistente');
// })

export default thunderRouter;
