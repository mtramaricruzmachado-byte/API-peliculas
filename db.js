import { Sequelize, DataTypes } from 'sequelize'

// Verificar que Render esté enviando la variable
console.log('DATABASE_URL:', process.env.DATABASE_URL)

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está configurada')
}

// Paso 1: Crear la conexión a la base de datos
const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})

// Paso 2: Definir el modelo de datos
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
})

async function iniciarDB() {
    try {
        // Probar conexión
        await db.authenticate()
        console.log('Conexión a PostgreSQL exitosa')

        // Sincronizar tablas
        await db.sync({ alter: true })

        // Verificar si la tabla está vacía
        const cantidad = await Pelicula.count()

        if (cantidad === 0) {
            await Pelicula.create({
                titulo: 'El Padrino',
                director: 'Francis Ford Coppola',
                anio: 1972
            })

            await Pelicula.create({
                titulo: 'El Padrino II',
                director: 'Francis Ford Coppola',
                anio: 1974
            })

            console.log('Películas de ejemplo creadas')
        }

        const peliculas = await Pelicula.findAll()
        console.log('peliculas', peliculas)

    } catch (error) {
        console.error('Error al iniciar la base de datos:', error)
    }
}

iniciarDB()

export { Pelicula }
