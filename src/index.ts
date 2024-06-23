import { PrismaClient } from "@prisma/client";
const express = require("express");
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')

const app = express();
const prisma = new PrismaClient();
const saltRounds = 10;

app.use(bodyParser.json());

// Sign Up Endpoint
app.post("/signup", async (req:any, res:any) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            msg: "User created successfully",
            user: { username: user.username, id: user.id },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            msg: "Failed to create user",
        });
    }
});

// Sign In Endpoint
app.post("/signin", async (req:any, res:any) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({
                msg: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                msg: "Invalid credentials"
            });
        }

        res.status(200).json({
            msg: "Sign-in successful",
            user: { username: user.username, id: user.id },
        });
    } catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({
            msg: "Error in logging in"
        });
    }
});

// Get All Users Endpoint
app.get('/users', async (req:any, res:any) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
