"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const suggested_controller_1 = require("../../controllers/suggested.controller");
const authentication_1 = require("../../middlewares/authentication");
const suggestRouter = (0, express_1.default)();
suggestRouter.get('/', authentication_1.authentication, suggested_controller_1.getSuggestedUsers);
exports.default = suggestRouter;
