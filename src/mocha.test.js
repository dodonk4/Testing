import { request } from "express";
import {productosDao} from "./persistencia/daos/index.js";
describe ("test", async function(){
    it("debería retornar todos los productos registrados", async function(){
        console.log("Estos son todos los productos registrados: ");
        console.log(await productosDao.getAll());
    });
    it("debería retornar un producto por el nombre", async function(){
        console.log("Este es el producto seleccionado: " + await productosDao.getByName("Manta"))
    });
    it("debería retornar que se ha guardado un producto" , async function(){
        console.log("Se ha guardado el siguiente producto: " + await productosDao.saveProduct({title: "Peluche", codigo: 342757527, precio: 24, foto: "ejemplo.png", stock: 2}))
    });
    it("debería retornar que un error de que NO se ha podido guardado un producto" , async function(){
        console.log("Se ha guardado el siguiente producto: " + await productosDao.saveProduct({title: "Peluche", codigo: 342757527}))
    });
    it("debería retornar que se ha actualizado un producto" , async function(){
        console.log("Se ha actualizado el producto Peluche por: " + await productosDao.updateProduct("Peluche", "Juguete", 456, 1, "otroEjemplo.png", 562))
    });
    it("debería retornar que se ha eliminado un producto" , async function(){
        console.log("Se ha eliminado el siguiente producto: " + await productosDao.deleteByName("Juguete"))
    });
})