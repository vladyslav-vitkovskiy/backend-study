import express, { Application, Request, Response, NextFunction } from "express";
import { allowedProperties, dbObject, updateDbObject } from "../db/db";
import { validateProperties } from "../middlewares/allowedProperties";

const app: Application = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(dbObject);
});

app.get("/product/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const product = dbObject.find((product) => product.id === parseInt(id));
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.status(200).json(product);
});

app.post(
  "/product",
  validateProperties(allowedProperties),
  (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const id = dbObject.length + 1;
    const newProduct = { id, ...body };
    dbObject.push(newProduct);

    res.status(200).json(newProduct);
  }
);

app.put(
  "/product/:id",
  validateProperties(allowedProperties),
  (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const body = req.body;
    const productToUpdate = dbObject.find(
      (product) => product.id === parseInt(id)
    );

    if (!productToUpdate) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const newdbObject = dbObject.map((product) => {
      if (product.id === parseInt(id)) {
        return { ...product, ...body };
      }
      return product;
    });

    updateDbObject(newdbObject);
    res.status(200).json({ ...productToUpdate, ...body });
  }
);

app.delete('/product/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const productToDelete = dbObject.find((product) => product.id === parseInt(id));

  if (!productToDelete) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const newdbObject = dbObject.filter((product) => product.id !== parseInt(id));
  
  updateDbObject(newdbObject);

  res.status(200).json({ message: "Product deleted" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
