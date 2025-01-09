"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../../middlewares/authentication");
const reply_controller_1 = require("../../controllers/reply.controller");
const upload_file_1 = require("../../middlewares/upload-file");
const replyRouter = (0, express_1.default)();
replyRouter.get('/:threadId', authentication_1.authentication, reply_controller_1.getRepliesThread);
replyRouter.post('/:id', authentication_1.authentication, (0, upload_file_1.upload)('single', 'image'), reply_controller_1.createReply);
replyRouter.put('/:id', authentication_1.authentication, reply_controller_1.updateReplies);
replyRouter.delete('/:id', authentication_1.authentication, reply_controller_1.deleteReplies);
exports.default = replyRouter;
