import { usuariosDao } from '../persistencia/daos/index.js';
import {configuracion, loggerConsola} from '../log4js/log4.js';
import {puerto} from '../minimist/minimist.js';
import { sender } from '../nodemailer/send.mjs';
import { productosDao } from '../persistencia/daos/index.js';

configuracion();


const controladorGeneral = {
    getRegistro: async (req, res)=>{
      loggerConsola.info(`localhost:${puerto}/registro`);
      loggerConsola.info(`Metodo: GET`);
        res.render('inicio');
    },
    postLogin: async(req,res)=>{
      await sender();
      console.log('despues de sender');
      loggerConsola.info(`localhost:${puerto}/login`);
      loggerConsola.info(`Metodo: POST`);
        if(req.body.nombre){
           res.render('registrado', {nombre: req.body.nombre} ); 
           await usuariosDao.save(req.body);
          //  await usuariosDao.userFactory(req.body.codigoSecreto);
         }
         else{
           res.send('Registro Fallado')
         }
    },
    getLogin: async (req,res)=>{
      loggerConsola.info(`localhost:${puerto}/login`);
      loggerConsola.info(`Metodo: GET`);
        res.render('registrado');
    },
    dtoTester: async (req, res)=>{
      let result = await productosDao.dtoCaller(req.params.name);
      res.send(result);
    }
    
}

export default controladorGeneral;

