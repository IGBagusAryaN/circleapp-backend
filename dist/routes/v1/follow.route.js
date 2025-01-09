"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const follow_controller_1 = require("../../controllers/follow.controller");
const authentication_1 = require("../../middlewares/authentication");
const followRoute = (0, express_1.default)();
followRoute.get('/following/:id', authentication_1.authentication, follow_controller_1.getFollowing);
followRoute.get('/followers/:id', authentication_1.authentication, follow_controller_1.getFollowers);
followRoute.get('/status/:id', authentication_1.authentication, follow_controller_1.checkFollowStatus);
followRoute.post('/:id', authentication_1.authentication, follow_controller_1.toggleFollow);
exports.default = followRoute;
