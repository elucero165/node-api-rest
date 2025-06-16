import express from 'express';
const app = express();

const products=[
{ id: 1, name: "producto 1", price: 100},
{ id: 2, name: "producto 2", price: 200},
{ id: 3, name: "producto 3", price: 300},
];

app.get("/",(req,res) =>{
    res.send("holasss");
});

app.get("/products",(req,res) =>{
    res.send(products);
});

app.get("/products/:id",(req,res) =>{
    //console.log(req.params.id);
    const product=products.find((item) => item.id==req.params.id )
    res.send(product);
});

const PORT=3000;

app.listen(PORT,() => console.log(`http://localhost:${PORT}`));
