"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const like_controller_1 = require("../../controllers/like.controller");
const authentication_1 = require("../../middlewares/authentication");
const likeRoute = (0, express_1.default)();
likeRoute.get('/:id', like_controller_1.getAllLike);
likeRoute.post('/:id', authentication_1.authentication, like_controller_1.toggleLikeThread);
exports.default = likeRoute;
