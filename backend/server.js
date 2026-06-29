import express from "express";
import cors from "cors";
import switchRouter from "./src/routers/switch.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({credentials: true,origin:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(switchRouter)


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})
