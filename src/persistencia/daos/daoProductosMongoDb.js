import contenedorProductosMongoDb from "../contenedores/contenedorProductosMongoDb.js";

class DaoProductosMongoDb extends contenedorProductosMongoDb {

    constructor() {
        super('productos', {
            id: { type: Number, required: true },
            title: { type: String, required: true },
            codigo: { type: Number, required: true},
            foto: { type: String, required: true },
            precio: { type: Number, required: true },
            stock: { type: Number, required: true },
            timestap: { type: Number, required: true }
        })
    }

    async dtoCaller(name){
        console.log('COPIA DE METODO DE DAO');
        try {
            console.log(name);
            let producto = await this.coleccion.find({title: name});
            const objeto = {id: producto[0].id, title: producto[0].title, precio: producto[0].precio, stock: producto[0].stock};
            return objeto;
        } catch (error) {
            loggerError.error(`Error de lectura: ${err}`);
        }
    }
}

export default DaoProductosMongoDb;