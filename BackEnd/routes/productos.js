const express = require("express");
const Producto = require("../models/Producto");
const verificarToken = require("../middleware/verificarToken");

const router = express.Router();

// Ruta para crear un nuevo producto - protegida
router.post("/", verificarToken, async (req, res) => {
  const { nombre, descripcion, precio, categoria, cantidad } = req.body;

  try {
    const nuevoProducto = new Producto({ nombre, descripcion, precio, categoria, cantidad });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear el producto" });
  }
});

// Ruta para obtener todos los productos - no protegida
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos" });
  }
});

// Ruta para actualizar un producto - protegida
router.put("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria, cantidad } = req.body;

  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { nombre, descripcion, precio, categoria, cantidad },
      { new: true }
    );
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar el producto" });
  }
});

// Ruta para eliminar un producto - protegida
router.delete("/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    await Producto.findByIdAndDelete(id);
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el producto" });
  }
});

module.exports = router;



