import { PrismaClient } from "@prisma/client";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
const prisma = new PrismaClient();

app.post("/signup", async (req: any, res: any) => {
  
    const username = req.body.username;
    const password = req.body.password;
    try {
    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    res.status(201).json({
      msg: "user created successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed to create user",
    });
  }
});

app.post("/sigin", async (req: any, res: any, status:string) => {
  const username = req.body.username;
  const password = req.body.password;

   try {
        const user = prisma.user.findUnique({
            where:{username}

          
        });
        if(!user){
            res.status(401).json({
                msg:"Invalid credentials"
            })
        }
   } catch (error) {
        res.status(500).json({
            msg:"error in logging"
        })
   }
});