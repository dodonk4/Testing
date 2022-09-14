import config from '../../config.js'
let usuariosDao
let productosDao
let carritosDao
switch (config.MODO_PERSISTENCIA) {
    case 'mongodb':
        const { default: DaoMongoDb } = await import('./daoMongoDb.js')
        const { default: ProductosDaoMongoDb } = await import('./daoProductosMongoDb.js')
        const { default: carritoDaoMongoDb } = await import('./daoCarritoMongoDb.js')
        usuariosDao = new DaoMongoDb()
        productosDao = new ProductosDaoMongoDb()
        carritosDao = new carritoDaoMongoDb();
        break
        
}
export { usuariosDao, productosDao, carritosDao }