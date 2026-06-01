import {Sequelize, DataTypes} from 'sequelize'


//Paso 1: Crear la conexión a la base de datos
const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
})

//Paso 2: Definir el modelo de datos
const Pelicula = db.define('Pelicula', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false
    },
    anio: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

async function iniciarDB() {
    //Siconcronizar tablas
    await db.sync({alter: true}) 
    //Insertar peliculas de ejemplo
    await Pelicula.create({id: 1, titulo: 'El Padrino', director: 'Francis Ford Coppola', anio: 1972})
    await Pelicula.create({id: 2, titulo: 'El Padrino II', director: 'Francis Ford Coppola', anio: 1974})
    //Obtener todas las peliculas
    const peliculas = await Pelicula.findAll();
    console.log('peliculas', peliculas)
}

iniciarDB()

export {Pelicula}
