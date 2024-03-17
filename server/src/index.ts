import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();




//Not found
app.use((req: Request, res:Response, next:NextFunction)=>{
    res.status(404).json({message:"Not Found!"});
});

//500
app.use((error: Error,req: Request,res: Response, next:NextFunction)=>{
    console.log(error);
    res.status(500).json({message: error.message});
});

app.listen(3000, () => {
    console.log("Server started listing to PORT:3000");
})


