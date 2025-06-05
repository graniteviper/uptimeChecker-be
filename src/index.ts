import express from "express"
import { authMiddleware } from "./middleware/auth.middleware";
import { PrismaClient } from "@prisma/client";
import cors from 'cors';
const app = express();
import * as nodeUtil from 'util';
(global as any).util = nodeUtil;
import util from 'util';

if (!util.inherits) {
  util.inherits = function(ctor: any, superCtor: any): void {
    ctor.prototype = Object.create(superCtor.prototype);
    ctor.prototype.constructor = ctor;
  };
}

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
    console.error(err.stack);
  });

const prismaClient = new PrismaClient();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

const PORT = 8080;

app.post("/api/v1/create",authMiddleware,async function(req,res){
    const userId = req.userId!;
    const {url} = req.body.data;
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
            websiteTicks: {
              orderBy: {
                timestamp: 'desc'
              },
              take: 20
            }
        }
    });
    res.json({
        data
    })
})

app.get("/api/v1/getone", authMiddleware, async (req, res) => {
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

  if (!data || data.length === 0) {
    res.json({ data: [] });
    return;
  }

  const websiteTicks = data[0].websiteTicks;

  const locationCounts: Record<string, number> = {};
  websiteTicks.forEach((tick) => {
    const location = tick.location;
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });

  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([location]) => location);

  const filteredByTopLocations = websiteTicks.filter((tick) =>
    topLocations.includes(tick.location)
  );

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const badTicks = filteredByTopLocations.filter(
    (tick) => tick.status === "Bad" && new Date(tick.timestamp) >= threeDaysAgo
  );

  const badTickIds = new Set(badTicks.map((tick) => tick.id)); 
  const remainingTicks = filteredByTopLocations
    .filter((tick) => !badTickIds.has(tick.id))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const combinedTicks = [...badTicks, ...remainingTicks].slice(0, 20);

  const obj = data[0];
  res.json({
    data: {
      websiteTicks: combinedTicks,
      id: obj.id,
      url: obj.url,
      userId: obj.userId
    }
  });
});

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

app.get("/health",(req,res)=>{
    res.send("hi")
    return;
})

app.post('/api/syncUsers',async (req,res)=>{
  const user_data = req.body.user_data;
  
 try {
   await prismaClient.user.create({
    data:{
      id: user_data.email_addresses[0].id,
      email: user_data.email_addresses[0].email_address
    }
  })
  res.status(200)
  return;
 } catch (error) {
    console.log(error);
    res.status(400)
    return;
 }
})

app.post("/api/v1/chatbot",async(req,res)=>{

})

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})