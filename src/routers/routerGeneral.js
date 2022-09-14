import express from 'express';
import { Router } from 'express';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import controladorGeneral from '../controladores/controladorGeneral.js';
import controladorComplejo from '../controladores/controladorComplejo.js';
import { passportMiddleware } from '../passport/passport.js';
import { passportSessionHandler } from '../passport/passport.js';
import controladorFail from '../controladores/controladorFail.js';
import log4js from 'log4js';
import {configuracion, loggerConsola, loggerWarning} from '../log4js/log4.js';
import {puerto} from '../minimist/minimist.js';
import compression from 'compression';
configuracion();


const mainRouter = new Router();
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

mainRouter.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://root:1234@cluster0.5xw3itz.mongodb.net/?retryWrites=true&w=majority`,
        mongoOptions: advancedOptions
    }),
    secret: '123456789',
    resave: true,
    saveUninitialized: true
}));
mainRouter.use(passportMiddleware);
mainRouter.use(passportSessionHandler);
mainRouter.use(express.json());
mainRouter.use(express.urlencoded({ extended: true }));

mainRouter.get('/registro', controladorGeneral.getRegistro);
mainRouter.post('/login', controladorGeneral.postLogin);
mainRouter.get('/login', controladorGeneral.getLogin);
mainRouter.get('/inicio', controladorComplejo.getInicio);
mainRouter.post('/inicio', passport.authenticate('login', { failureRedirect: '/fail-login', failureFlash: true}), controladorComplejo.postInicio);
mainRouter.get('/fail-registro', controladorFail.getFailRegistro);
mainRouter.get('/fail-login', controladorFail.getFailLogin);
mainRouter.get('/logout', controladorComplejo.getLogout);
mainRouter.get('/info', compression(), controladorComplejo.getInfo);
mainRouter.post('/carrito', controladorComplejo.postCarrito);//CAMBIAR A "postCarrito"
mainRouter.get('/carrito', controladorComplejo.getCarrito);
mainRouter.post('/carritoDone', controladorComplejo.postCarritoDone);
mainRouter.get('/carritoDone', controladorComplejo.getCarritoDone);
// mainRouter.get('/carritoThunder', controladorComplejo.getCarritoThunder);
// mainRouter.post('/createProduct', controladorComplejo.postProduct);
// mainRouter.get('/getProductByName', controladorComplejo.getProductByName);
// mainRouter.get('/getAllProducts', controladorComplejo.getAllProducts);
// mainRouter.put('/updateCarrito', controladorComplejo.updateCarritoCantidad);
// mainRouter.put('/updateProduct', controladorComplejo.updateProduct);
mainRouter.get('/', controladorGeneral.getLogin);
// mainRouter.delete('/deleteProduct', controladorComplejo.deleteProduct);
// mainRouter.post('/createCarrito', controladorComplejo.createCarritoOnlyAdmin);
mainRouter.get('/test/:name', controladorGeneral.dtoTester);
mainRouter.get('*', (req, res)=>{
    loggerWarning.warn(`localhost:${puerto}${req.params[0]}`);
    loggerWarning.warn(`Metodo: GET`);
    res.send('Ruta inexistente');
})

export default mainRouter;
