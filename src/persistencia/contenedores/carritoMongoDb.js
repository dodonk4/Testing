import pkg from 'mongoose';
const { model } = pkg;
import mongoose from 'mongoose';
import config from '../../config.js';
import {configuracion, loggerError} from '../../log4js/log4.js';
configuracion();

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)



class carritoMongoDb{
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema);
    }

    async createCarrito(){
            try {
                let arrayCantidades = [];
                let array = ["Colchon", "Manta", "Computadora", "Auriculares", "Parlantes", "Chromecast"]
                for (let i = 0; i < array.length; i++) {
                    arrayCantidades.push(0);
                }
                const carrito = {nombre: "Unico", productos: array, cantidad: arrayCantidades};
                const carritoSaveModel = new this.coleccion(carrito);
                let cosa = await this.coleccion2.find({});
                let carritoSave = await carritoSaveModel.save();
                console.log(carritoSave);
                console.log(cosa);
            } catch (error) {
                loggerError.error(`Error de lectura: ${err}`);
            }
        
    }

    async obtenerCantidades(){
        try {
            let carritos = await this.coleccion.find({});
            return carritos[0].cantidad;
        } catch (error) {
            loggerError.error(`Error de lectura: ${err}`);
        }
    }

    async obtenerProductos(){
        try {
            let carritos = await this.coleccion.find({});
            return carritos[0].productos;
        } catch (error) {
            loggerError.error(`Error de lectura: ${err}`);
        }
    }

    async updateCantidad(cantidadDeUsuario){
        try{
                await this.coleccion.updateOne({nombre: "Unico"}, {$set: {cantidad: cantidadDeUsuario}});
        }
        catch(err){
            loggerError.error(`Error de lectura: ${err}`);
        }
    }

}

export default carritoMongoDb;