import pkg from 'mongoose';
const { model } = pkg;
import mongoose from 'mongoose';
import config from '../../config.js';
import {configuracion, loggerConsola, loggerError} from '../../log4js/log4.js';
configuracion();
await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)



class contenedorProductosMongoDb{
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async saveProduct(objeto){
        try {
            let timestamp = Date.now();
            const prods = await this.getAll();
            let maxId = 1;
            for (let i = 0; i < await prods.length; i++) {
                maxId += 1;
            }
            const product = {title: objeto.title, codigo: objeto.codigo, precio: objeto.precio, foto: objeto.foto, stock: objeto.stock, timestap: timestamp, id: maxId};
            const productSaveModel = new this.coleccion(product);
            let productSave = await productSaveModel.save();
            // loggerConsola.info(productSave);
            return productSave;
        } catch (error) {
            loggerError.error(`Error de lectura: ${err}`);
        }
    
}

    async getAll(){
        try{
                let productos = await this.coleccion.find({}).lean();             
                return productos;
        }
        catch(err){
            loggerError.error(`Error de lectura: ${err}`);
        }
    }

    async getByName(name){
        try{
                let producto = await this.coleccion.find({title: name});
                return producto;
        }
        catch(err){
            loggerError.error(`Error de lectura: ${err}`);
        }
    }

    async deleteByName(name){
        try{
                let productoAEliminar = (await this.getByName(name))
                await this.coleccion.deleteOne({ title: name });
                return productoAEliminar;

        }
        catch(err){
            loggerError.error(`Error de lectura: ${err}`);
        }
    }

    async updateProduct(name, title, codigo, stock, foto, precio){
        try{
                let parametros = [title, codigo, stock, foto, precio]
                await this.coleccion.updateOne({title: name}, {$set: {title: title, codigo: codigo, stock: stock, foto: foto, precio: precio}});
                let productoActual = await this.getByName(title);
                return productoActual
            }
        catch(err){
            loggerError.error(`Error de lectura: ${err}`);
        }
    }


}

export default contenedorProductosMongoDb;