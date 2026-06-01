import express from 'express'
import { Pelicula } from './db.js'
import jwt from 'jsonwebtoken'




const app = express()
const PORT = process.env.PORT || 3000
const SECRET_KEY = process.env.SECRET_KEY || 'mi_clave_secreta'



app.use(express.json())
app.get('/', (req, res) => {
    res.json({message: 'Bienvenido a la API de Peliculas'})
})


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const user = { id: 1, username: 'Haber' };

        const token = jwt.sign(user, SECRET_KEY, {
            expiresIn: '1h'
        });

        res.json({
            message: 'Login exitoso',
            token
        });
    } else {
        res.status(401).json({
            message: 'Credenciales incorrectas'
        });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Formato: "Bearer TOKEN"

    if (!token) return res.status(401).json({ message: 'Token requerido' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });

        req.user = user;
        next();
    })
}


//GET - Obtener todas las peliculas
//Endpoint protegido - Solo accesible con token válido
app.get('/api/peliculas', authenticateToken, async (req, res) => {
    const peliculas = await Pelicula.findAll()
    res.status(200).json(peliculas);
})

//POST - Crear una nueva pelicula
app.post('/api/peliculas', authenticateToken, async (req, res) => {
    const body = req.body;
    const resultado = await Pelicula.create(body);
    res.status(200).json(resultado);
})

//PUT - Actualizar una pelicula existente
app.put('/api/peliculas/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const pelicula = await Pelicula.findByPk(id);

    if (!pelicula) {
        return res.status(404).json({error: 'Pelicula no encontrada'})
    }
    await pelicula.update(body);
    res.status(200).json({
        mensaje: 'Pelicula actualizada correctamente',
        pelicula
    })
})

//DELETE - Eliminar una pelicula
app.delete('/api/peliculas/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;

    const pelicula = await Pelicula.findByPk(id);

    if (!pelicula) {
        return res.status(404).json({
            mensaje: 'Pelicula no encontrada'
        })
    }

    await pelicula.destroy();

    res.status(200).json({
        mensaje: 'Pelicula eliminada correctamente'
    })
})


//Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

