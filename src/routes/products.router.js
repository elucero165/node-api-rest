import { Router } from "express";
import { body } from "express-validator";

import {
  getAllProducts,
  deleteProduct,
  getProductById,
  saveProductWithCustomId,
  updateProduct,
  searchProducts,
  searchProducts2
} from "../controllers/products.controller.js";

import { verifyToken } from "../middleware/auth-middleware.js";

const router = Router();

router.get("/products", verifyToken, getAllProducts);
router.get("/products/search", verifyToken, searchProducts);
router.get("/products/search2", verifyToken, searchProducts2);

router.post("/products/create", 
  verifyToken ,
  [
    body("id").notEmpty().withMessage("El ID es obligatorio"),
    body("name")
      .notEmpty().withMessage("El nombre es obligatorio")
      .matches(/^[\p{L}0-9\sñÑáéíóúÁÉÍÓÚüÜ]+$/u)
      .withMessage("El nombre solo puede contener letras, números, espacios y acentos"),
    body("price")
      .notEmpty().withMessage("El precio es obligatorio")
      .isFloat({ gt: 0, max: 9999999, decimal_digits: '0,2' })
      .withMessage("El precio debe ser un número positivo con hasta 2 decimales"),
    body("stock")
      .notEmpty().withMessage("El stock es obligatorio")
      .isInt({ min: 0 })
      .withMessage("El stock debe ser un número entero mayor o igual a 0")
  ],

  saveProductWithCustomId

);


router.get("/products/:id", verifyToken, getProductById);



router.put(
  "/products/:id",
  verifyToken,
  [
    body("name")
      .optional()
      .matches(/^[\p{L}0-9\sñÑáéíóúÁÉÍÓÚüÜ]+$/u)
      .withMessage("El nombre solo puede contener letras, números, espacios y acentos"),
    body("price")
      .optional()
      .isFloat({ gt: 0, max: 9999999, decimal_digits: '0,2' })
      .withMessage("El precio debe ser un número positivo con hasta 2 decimales"),
    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("El stock debe ser un número entero mayor o igual a 0")
  ],
  updateProduct
);


router.delete("/products/:id",verifyToken, deleteProduct); 

export default router;

