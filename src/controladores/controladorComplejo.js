import http from 'http';
import Mensajeria from '../persistencia/contenedores/mensajes.js';
import { usuariosDao } from '../persistencia/daos/index.js';
import { productosDao } from '../persistencia/daos/index.js';
import util from 'util';
import path from 'path';
import os from 'os';
import log4js from 'log4js';
import {configuracion, loggerConsola, loggerError} from '../log4js/log4.js';
import {puerto} from '../minimist/minimist.js';
import { sender2 } from '../nodemailer/send.mjs';
import {senderWpp, senderWppToClient} from '../twilio/indexWpp.mjs';
configuracion();
import {fileURLToPath} from 'url';
import { abort } from 'process';
import { equal } from 'assert';
import { carritosDao } from '../persistencia/daos/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let a = 0;


const tenerA = async ()=>{ return a };
const mensajeriaANormalizar = new Mensajeria('./public/texto/mensajesANormalizar.txt');

const controladorComplejo = {
    getInicio: async (req, res)=>{
        loggerConsola.info(`localhost:${puerto}/inicio`)
        loggerConsola.info(`Metodo: GET`);
        if (req.session.passport) {
            let usuario = await usuariosDao.getByName(req.session.passport.user.nombre)
            let productos = await productosDao.getAll();
            console.log(usuario);
            let mensajes = await mensajeriaANormalizar.obtenerTodos();
            res.render('logueado', { titulo: 'PRODUCTO', titulo2: 'PRECIO', titulo3: 'THUMBNAIL', productos, mensajes, nombre: req.session.passport.user.nombre, foto: usuario[0].foto, edad: usuario[0].edad, email: usuario[0].email, direccion: usuario[0].direccion, telefono: usuario[0].telefono});
        } else {
            res.render('redireccion');
        }
    },
    postInicio: async (req, res)=>{
        if(a != 0){
            res.send('Deslogueate antes de intentar iniciar sesión nuevamente');
        }else{
            loggerConsola.info(`localhost:${puerto}/inicio`);
            loggerConsola.info(`Metodo: POST`);
            req.session.user = req.body.nombre;
            a = req.body.nombre;
            req.session.password = req.body.contraseña;
            req.session.cookie.maxAge = 60000;
            let productos = await productosDao.getAll();
            let usuario = await usuariosDao.getByName(req.session.passport.user.nombre)
            console.log(usuario);
            console.log(await productos);
            let mensajes = await mensajeriaANormalizar.obtenerTodos();
            res.render('logueado', { titulo: 'PRODUCTO', titulo2: 'PRECIO', titulo3: 'THUMBNAIL', productos, mensajes, nombre: req.session.passport.user.nombre, foto: usuario[0].foto, edad: usuario[0].edad, email: usuario[0].email, direccion: usuario[0].direccion, telefono: usuario[0].telefono});
        }
            
    },
    getInfo: async (req, res)=>{
            console.log(req.session)
            loggerConsola.info(`localhost:${puerto}/info`)
            loggerConsola.info(`Metodo: GET`);
            function print(objeto) {
                return util.inspect(objeto, true, 0, false);
              }
            let cosa = Object.entries(process.memoryUsage());
            let cosa2 = JSON.stringify(cosa[0]);
            let newCosa = cosa2.replace('"rss",', '').replace('[', '').replace(']', '');
            res.send(`Path de ejecución: ${path.join(__dirname, '/server.js')}<br>
            Carpeta del proyecto: ${process.cwd()}<br>
            Process ID: ${process.pid}<br>
            Version de Node.js: ${process.version}<br>
            Título del proceso: ${process.title}<br>
            Sistema operativo: ${process.platform}<br>
            Memoria reservada: ${newCosa}<br>
            Argumentos de Entrada: ${process.argv.slice(2)}<br>
            Numero de procesadores: ${os.cpus().length}`);
            
        },
    postCarrito: async (req, res)=>{
            if (req.session.passport) {
                a = req.session.passport.user.nombre;        
                console.log(req.session.passport);
                let arrayCantidad = req.body.cantidad;
                await usuariosDao.changeCantidad(arrayCantidad, a)
                console.log(arrayCantidad);
                res.render('carrito', { layout: 'otro', nombre: req.session.passport.user.nombre, cantidad0: arrayCantidad[0], cantidad1: arrayCantidad[1], cantidad2: arrayCantidad[2], cantidad3: arrayCantidad[3], cantidad4: arrayCantidad[4],  cantidad5: arrayCantidad[5], maximum0: req.body.stock[0], maximum1: req.body.stock[1], maximum2: req.body.stock[2], maximum3: req.body.stock[3], maximum4: req.body.stock[4], maximum5: req.body.stock[5]});
            } else {
                res.render('redireccion');
            }
        },
    postCarritoDone: async (req, res)=>{
            let arrayCantidad = req.body.cantidad;
            await usuariosDao.changeCantidad(arrayCantidad, a)
            console.log(a);
            await sender2(a);
            await senderWpp(a);
            await senderWppToClient(a);
            res.render('carritoDone');
        },
    getCarritoDone: async (req, res)=>{
            console.log(a);
            if (a != 0){
                res.render('carritoDone');
            }else{
                res.render('redireccion');
            }
        },
    getCarrito: async (req, res) => {
            if(a != 0){
                let cantidades = await usuariosDao.getCantidad(a);
                let productos = await productosDao.getAll();
                res.render('carrito', { layout: 'otro', nombre: a, cantidad0: cantidades[0], cantidad1: cantidades[1], cantidad2: cantidades[2], cantidad3: cantidades[3], cantidad4: cantidades[4],  cantidad5: cantidades[5], maximum0: productos[0].stock, maximum1: productos[1].stock, maximum2: productos[2].stock, maximum3: productos[3].stock, maximum4: productos[4].stock, maximum5: productos[5].stock});//Y ACÁ SE LE PONDRÍAN LAS CANTIDADES EN EL RENDER CON UN getCantidad() EN EL contenedorMongoDB
            }else{
                res.render('registrado');
            }
        },
    getAll: async (req, res) => {
            res.json(await usuariosDao.getAll());
        },
    getLogout: async (req,res)=>{
            a = 0;
            loggerConsola.info(`localhost:${puerto}/logout`);
            loggerConsola.info(`Metodo: GET`);
                req.session.destroy(err => {
                    if (err) {
                    res.json({ status: 'Logout ERROR', body: err })
                    } else {
                    res.render('logout')
                    }
                })
            },
    postProduct: async (req, res)=>{
        try {
            if(req.session.passport.user.nombre === 'isma'){
                await productosDao.saveProduct(req.body);
                res.send(`${req.body.title} ha sido registrado`)
            }else{
                throw new Error;
            }
            
        } catch (error) {
            loggerError.error(error);
            loggerConsola.info('Hubo un error');
        }
        
    },
    getProductByName: async (req, res)=>{
        try {
                let producto = await productosDao.getByName(req.body.title);
                res.send(await producto);
            
        } catch (error) {
            loggerError.error(error);
            loggerConsola.info('Hubo un error');
        }
    },
    createCarritoOnlyAdmin: async (req, res)=>{
        try {
            if(req.session.passport.user.nombre === 'isma'){
                await carritosDao.createCarrito();
                res.send(`Un carrito se creo`);
            }else{
                throw new Error;
            }
        } catch (error) {
            loggerError.error(error);
            loggerConsola.info('Hubo un error');
        }
    },
    updateCarritoCantidad: async (req, res)=>{
        try {
                if(req.session.passport){
                    let bodier = req.body;
                    let nombres = Object.keys(bodier);
                    let values = Object.values(bodier);
                    let nuevoArray = [];
                    let nuevoArrayCantidad = [];
                    let productosDeCarrito = await carritosDao.obtenerProductos();
                    for (let i = 0; i < productosDeCarrito.length; i++) {
                        for (let i2 = 0; i2 < nombres.length; i2++) {
                            if(nombres[i2] === productosDeCarrito[i]) {
                                nuevoArray.push(nombres[i2]);
                                nuevoArrayCantidad.push(values[i2]);
                            }
                        } 
                    }
                    await carritosDao.updateCantidad(nuevoArrayCantidad);
                    await usuariosDao.changeCantidad(nuevoArrayCantidad, req.session.passport.user.nombre);
                    res.send('Se actualizó exitosamente');
                }else{
                    res.send('Nesecitas loguearte');
                }
            
            //Ver la forma de tener los nombres d elos productos ingresados y depsues localizarlos con los nombres d elos productos del carrito
            // 
        } catch (error) {
            loggerError.error(error);
            loggerConsola.info('Hubo un error');
        }
    },
    getCarritoThunder: async (req, res) => {
        if(a != 0){
            let cantidades = await usuariosDao.getCantidad(a);
            let productos = await carritosDao.obtenerProductos();
            let resultado = [];
            for (let i = 0; i < productos.length; i++) {
                let productoCompleto = productos[i] + ": " + cantidades[i];
                resultado.push(productoCompleto);
                
            }
            
            res.send(resultado)
        }else{
            res.send('Necesitas loguearte');
        }
    },
    getAllProducts: async (req, res) => {
        let productos = await productosDao.getAll();
        res.send(productos);
        
    },
    deleteProduct: async (req, res) => {
        await productosDao.deleteByName(req.body.title);
        res.send(req.body.title + " ha sido eliminado")
    },
    updateProduct: async (req, res) => {
        if(req.session.passport.user.nombre === 'isma'){
            await productosDao.updateProduct(req.body.Nombre, req.body.Title, req.body.Codigo, req.body.Stock, req.body.Foto, req.body.Precio)
            res.send(req.body.Nombre + " ha sido actualizado")
        }else{
            res.send("Usted no está autorizado para realizar está acción. Sólo un Admin puede hacerlo")
        }
    }

}
    


export default controladorComplejo;