// create Website, get all websites status, get website status
import express from "express"
import { authMiddleware } from "./middleware/auth.middleware.ts";
import { PrismaClient } from "@prisma/client";
import cors from 'cors';
const app = express();

const prismaClient = new PrismaClient();

app.use(cors({
    origin: "https://uptime-checker-py3w.vercel.app/",
}))
app.use(express.json());

const PORT = 8080;

app.post("/api/v1/create",authMiddleware,async function(req,res){
    const userId = req.userId!;
    const {url} = req.body.data;
    // console.log(req.body);

    const response = await prismaClient.websites.create({
        data:{
            userId,
            url
        }
    });
    res.status(200).json({
        message: "Website added."
    })
})

app.get("/api/v1/getall",authMiddleware,async (req,res)=>{
    const userId = req.userId;
    const data = await prismaClient.websites.findMany({
        where: {
            userId,
            disabled: false
        },
        include: {
            websiteTicks: true
        }
    });
    // console.log(data);
    res.json({
        data
    })
})

app.get("/api/v1/getone",authMiddleware,async (req,res)=>{
    const userId = req.userId;
    const websiteId = req.query.websiteId as string;
    const data = await prismaClient.websites.findMany({
        where: {
            id: websiteId,
            userId,
            disabled: false
        },
        include: {
            websiteTicks: true
        }
    });
    res.json({
        data
    })
})

app.delete("/api/v1/delete/",authMiddleware,async (req,res)=>{
    const websiteId = req.query.websiteId as string;
    const userId = req.userId;
    await prismaClient.websites.update({
        where: {
            id: websiteId,
            userId

        },
        data: {
            disabled: true
        }
    });
    res.json({
        message: 'Deleted Successfully.'
    })
})

app.post('/api/v1/getkey', authMiddleware, async(req,res)=>{
    const key = req.body.key;
    if(key){
        console.log(key);
    }
})

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})