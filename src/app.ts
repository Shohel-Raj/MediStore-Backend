import express from "express"

import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { productRouter } from "./modules/products/products.router";
import { sellerRouter } from "./modules/seller/seller.router";
import { CartRoutes } from "./modules/cart/cart.router";

const app = express();

app.use(cors({
    origin: process.env.APP_URL ,
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());




app.use("/api/v1/medicines", productRouter)

app.use("/api/v1/seller", sellerRouter)



app.use("/api/v1/cart", CartRoutes)


app.get("/", async(req, res) => {
     const session = await auth.api.getSession({
                headers: req.headers as any
            })
            console.log(session)
    res.send("MediStore is cooking..........");
});


export default app;