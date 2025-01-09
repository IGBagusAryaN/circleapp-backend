"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const thread_controller_1 = require("../../controllers/thread.controller");
const authentication_1 = require("../../middlewares/authentication");
const upload_file_1 = require("../../middlewares/upload-file");
const threadRoute = (0, express_1.default)();
threadRoute.get('/', authentication_1.authentication, thread_controller_1.getAllThread);
threadRoute.get('/:id', authentication_1.authentication, thread_controller_1.getThreadDetail);
threadRoute.put('/:id', authentication_1.authentication, (0, upload_file_1.upload)('single', 'image'), thread_controller_1.updateThread);
threadRoute.post('/', authentication_1.authentication, (0, upload_file_1.upload)('single', 'image'), thread_controller_1.createThread);
threadRoute.delete('/:id', authentication_1.authentication, thread_controller_1.deleteThread);
exports.default = threadRoute;
