"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const user_controller_1 = require("../../controllers/user.controller");
const authentication_1 = require("../../middlewares/authentication");
const prisma = new client_1.PrismaClient();
const searchRoute = express_1.default.Router();
searchRoute.get('/search', authentication_1.authentication, user_controller_1.searchUsers);
exports.default = searchRoute;
