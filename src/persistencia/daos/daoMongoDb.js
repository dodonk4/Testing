import { Admin } from "mongodb";
import { AssistantInstance } from "twilio/lib/rest/autopilot/v1/assistant.js";
import contenedorMongoDb from "../contenedores/contenedorMongoDb.js";


class DaoMongoDb extends contenedorMongoDb {

    constructor() {
        super('usuariosRegistrados', {
            nombre: { type: String, required: true },
            contraseña: { type: String, required: true },
            cantidad: { type: Array, required: true},
            telefono: { type: Number, required: true},
            email: { type: String, required: true},
            direccion: { type: String, required: true},
            edad: { type: Number, required: true},
            foto: { type: String, required: true},
            // codigoSecreto: { type: String, required: true}
        })
        
    }


    // async verifySecretCode2(codigoSecreto){
    //    return await this.verifySecretCode(codigoSecreto);
    // }

    // async save2 (objeto){
    //     await this.save(objeto);
    // }
    

}

// class CommonUser extends DaoMongoDb{

// }

// class AdminUser extends DaoMongoDb{

// }


// class Factory extends DaoMongoDb{
//     async factorizar(objeto){
//         if (await this.verifySecretCode2(objeto.codigoSecreto) === 1){
//             new AdminUser(objeto);
//         }else if(await this.verifySecretCode2(objeto.codigoSecreto) === 0){
//             new CommonUser(objeto);
//         }
//     }
// }





export default DaoMongoDb;