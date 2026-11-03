const express = require('express');
const { Producto, Inventario } = require('../models');
const { autenticar } = require('../middleware/auth');
const router = express.Router();

router.use(autenticar);

router.get('/productos', async (req, res, next) => {
    try {
        const { q, categoria, precioMin, precioMax } = req.query;
        if (q !== undefined && (typeof q !== 'string' || q.trim() === '')) {
            return res.status(400).json({ mensaje: 'El parámetro de búsqueda "q" es inválido.' });
        }
        if (categoria !== undefined && (typeof categoria !== 'string' || categoria.trim() === '')) {
            return res.status(400).json({ mensaje: 'El parámetro de búsqueda "categoria" es inválido.' });
        }
        if (precioMin !== undefined && (typeof precioMin !== 'string' || precioMin.trim() === '' || Number(precioMin) < 0 || !Number.isFinite(Number(precioMin)))) {
            return res.status(400).json({ mensaje: 'El parámetro de búsqueda "precioMin" es inválido.' });
        }
        if (precioMax !== undefined && (typeof precioMax !== 'string' || precioMax.trim() === '' || Number(precioMax) < 0 || !Number.isFinite(Number(precioMax)))) {
            return res.status(400).json({ mensaje: 'El parámetro de búsqueda "precioMax" es inválido.' });
        }
        if (precioMin !== undefined && precioMax !== undefined && Number(precioMin) > Number(precioMax)) {
            return res.status(400).json({ mensaje: 'El precio minimo no puede ser mayor que el precio maximo.' });
        }
        const filtro = { 'activo': true };

        if (q !== undefined) {
            const texto = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escapar caracteres especiales para regex
            filtro.$or = [
                { nombre: { $regex: texto, $options: 'i' } },
                { descripcion: { $regex: texto, $options: 'i' } },
            ];
        }

        if (categoria !== undefined) {
            filtro.categoria = categoria.trim();
        }

        if (precioMin !== undefined) {
            filtro.precio = { ...filtro.precio, $gte: Number(precioMin) };
        }

        if (precioMax !== undefined) {
            filtro.precio = { ...filtro.precio, $lte: Number(precioMax) };
        }

        const productos = await Producto.find(filtro).populate('distribuidorId', 'razonSocial municipio estadoVerificacion');
        const productosVerificados = productos.filter(producto => producto.distribuidorId && producto.distribuidorId.estadoVerificacion === 'verificada');
        const productosIds = [...productosVerificados.map(producto => producto._id)];
        const inventarios = await Inventario.find({
            productoId: { $in: productosIds }
        });
        const resultados = productosVerificados.map(producto => {
            const inventario = inventarios.find(inv => inv.productoId.toString() === producto._id.toString());
            return {
                ...producto.toJSON(),
                existencias: inventario ? inventario.existencias : null
            };
        });

        function prioridadExistencias(producto) {
            if (producto.existencias > 0) return 0;
            if (producto.existencias === 0) return 1;
            return 2; // null
        }

        resultados.sort((a, b) => prioridadExistencias(a) - prioridadExistencias(b));
        
        return res.status(200).json({ productos: resultados });
    } catch (error) {
        next(error);
    }
});

module.exports = router;