import axios from 'axios';


try {
  const { data: data3 } = await axios.post('http://localhost:8080/inicioThunder', {
      nombre: "thunder",
      contraseña: "thunder"
  })
    console.log(data3)
} catch (error) {
    console.log(error)
}

try {
    const { data: data3 } = await axios.post('http://localhost:8080/createProduct', {
        title: "Tornillo",
        precio: 20,
        codigo: 7898565478874,
        foto: "https://http2.mlstatic.com/D_NQ_NP_881127-MLA49532152964_032022-O.webp",
        stock: 30
    })
    console.log(data3)
  } catch (error) {
    console.log(error)
  }

  try {
    const { data: data3 } = await axios.put('http://localhost:8080/updateProduct', {
        Nombre: "Tornillo",
        Title: "Tuerca",
        Foto: "https://www.tipos.co/wp-content/uploads/2015/01/tuercas.jpg",
        Stock: 12,
        Precio: 25,
        Codigo: 78951546587899
    })
    console.log(data3)
  } catch (error) {
    console.log(error)
  }

  try {
    const { data: data3 } = await axios.delete('http://localhost:8080/deleteProduct', {
        headers: {
            Authorization: "authorizationToken"
          },
        data: {
            title: "Tuerca"
        }
        
    })
    console.log(data3)
  } catch (error) {
    console.log(error)
  }


try {
    const { data: data3 } = await axios.get('http://localhost:8080/logoutThunder')
    console.log(data3)
  } catch (error) {
    console.log(error)
  }