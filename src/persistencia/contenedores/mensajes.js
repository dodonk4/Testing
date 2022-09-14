import fs from 'fs';
import {configuracion, loggerError} from '../../log4js/log4.js';
import normalizr from 'normalizr';
configuracion();
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;
export default class Mensajeria{
  constructor(archivo){
      this.archivo = archivo;
  }
  async obtenerTodos (){
      try {

      let leido2 = await fs.promises.readFile(this.archivo);

          let stringed2 = leido2.toString('utf8');
          let parseado2 = JSON.parse(stringed2);

          const authorSchema = new schema.Entity('authors', {}, {idAttribute: 'email'});

          const mensajesSchema = new schema.Entity('texts', {
            author: authorSchema
          });

          const mensajeriaSchema = new schema.Entity('mensajeria', {
            mensajes: [mensajesSchema],
            author: authorSchema
          })
          

          
          const denormalizedData = denormalize(parseado2.result, mensajeriaSchema, parseado2.entities);
          const objetivo1 = JSON.stringify(denormalizedData);
          const objetivo2 = JSON.parse(objetivo1);
          return objetivo2.mensajes;

      } catch (error) {
        loggerError.error(`fallo la operacion obtenerTodos: ${error.message}`);


      }
  }
  async insertarMensajesIndividuales(objeto){
      try {
          let leido2 = await fs.promises.readFile(this.archivo);
          let stringed2 = leido2.toString('utf8');
          let parseado2 = JSON.parse(stringed2);

          const authorSchema = new schema.Entity('authors', {}, {idAttribute: 'email'});

          const mensajesSchema = new schema.Entity('texts', {
            author: authorSchema
          });

          const mensajeriaSchema = new schema.Entity('mensajeria', {
            mensajes: [mensajesSchema],
            author: authorSchema
          })

          const denormalizedData = denormalize(parseado2.result, mensajeriaSchema, parseado2.entities);
          const objetivo1 = JSON.stringify(denormalizedData);
          const objetivo2 = JSON.parse(objetivo1);
          
          objetivo2.mensajes.push(objeto);
          const normalizedData = normalize(objetivo2, mensajeriaSchema);
          console.log('-------------------------------')

          await fs.promises.writeFile(this.archivo, JSON.stringify(normalizedData), 'utf-8');

      } catch (error) {
          loggerError.error(`fallo la operacion obtenerTodos: ${error.message}`);
      }     
  }
}

