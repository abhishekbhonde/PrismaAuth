"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const app = express();
const prisma = new client_1.PrismaClient();
const saltRounds = 10;
app.use(bodyParser.json());
// Sign Up Endpoint
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        const user = yield prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            msg: "User created successfully",
            user: { username: user.username, id: user.id },
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            msg: "Failed to create user",
        });
    }
}));
// Sign In Endpoint
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(401).json({
                msg: "Invalid credentials"
            });
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                msg: "Invalid credentials"
            });
        }
        res.status(200).json({
            msg: "Sign-in successful",
            user: { username: user.username, id: user.id },
        });
    }
    catch (error) {
        console.error("Error signing in:", error);
        res.status(500).json({
            msg: "Error in logging in"
        });
    }
}));
// Get All Users Endpoint
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
