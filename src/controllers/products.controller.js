import { validationResult } from "express-validator";
import * as model from "../models/products.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await model.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    
    const product = await model.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "No existe el producto como parametro id" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

//nuevo con setDoc
export const saveProductWithCustomId = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }  
  try {
        const { id, ...productData } = req.body;
        const existeProduct = await model.getProductById(id);
        if(existeProduct){
          return res.status(409).json({error: "ya existe un producto con ese ID"});
        }
        //if (!id) {
        //    return res.status(400).json({ error: "El id es obligatorio" });
        //}

        await model.saveProductWithCustomId(id, productData);
        res.status(201).json({ message: "Producto guardado exitosamente con ID personalizado", id });
    } catch (error) {
        console.error("Error al guardar producto con ID:", error);
        res.status(500).json({ error: "Error al guardar el producto" });
    }
};

export const updateProduct = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { name, price, stock, description, sku, category } = req.body;

        const existingProduct = await model.getProductById(id);

        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const updatedFields = {};

        if (name !== undefined) updatedFields.name = name;
        if (price !== undefined) updatedFields.price = parseFloat(price);
        if (stock !== undefined) updatedFields.stock = parseInt(stock);
        if (description !== undefined) updatedFields.description = description;
        if (sku !== undefined) updatedFields.sku = sku;
        if (category !== undefined) updatedFields.category = category;

        await model.updateProductById(id, updatedFields);

        res.json({ message: "Producto actualizado correctamente", updatedFields });

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
};





export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log(id);
    // Confirmamos si el producto existe
    const product = await model.getProductById(id);

    //console.log(product);

    if (product==null) {
      return res.status(404).json({ error: "El producto no existe" });
    }
    
    await model.deleteProduct(id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

export const searchProducts = async (req, res) => {
    try {
        const { categoria, descripcion } = req.query;
        console.log(categoria || descripcion);

        const productos = await model.searchProducts({ categoria, descripcion });
        
        res.json(productos);
        
    } catch (error) {
        console.error("Error al buscar productos:", error);
        res.status(500).json({ message: "Error al buscar productos" });
    }
};

export const searchProducts2 = async (req, res) => {
    try {
        const { categoria, descripcion } = req.query;
        console.log(categoria || descripcion);

        if (!categoria && !descripcion) {
          return res.status(400).json({ message: "Debes proporcionar al menos 'categoria' o 'descripcion'." });
        }

        const productos = await model.searchProductsExact({ categoria, descripcion });
        
        res.json(productos);
        
    } catch (error) {
        console.error("Error al buscar productos:", error);
        res.status(500).json({ message: "Error al buscar productos" });
    }
};
