import {Sequelize, DataTypes} from 'sequelize'


//Paso 1: Crear la conexión a la base de datos
const db = new Sequelize(process.env.DATABASE_URL, {
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
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
    //Verificar si la tabla esta vacia
    const cantidad = await Pelicula.count()

    if(cantidad === 0) {
        await Pelicula.create({
            titulo: 'El Padrino',
            director: 'Francis Ford Coppola',
            anio: 1972
        });

        await Pelicula.create({
            titulo: 'El Padrino II',
            director: 'Francis Ford Coppola',
            anio: 1974
        });
    }
    
    //Obtener todas las peliculas
    const peliculas = await Pelicula.findAll();
    console.log('peliculas', peliculas)
}

iniciarDB()

export {Pelicula}
