"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../../controllers/profile.controller");
const upload_file_1 = require("../../middlewares/upload-file");
const authentication_1 = require("../../middlewares/authentication");
const profileRoute = (0, express_1.default)();
profileRoute.get('/', authentication_1.authentication, profile_controller_1.getAllProfile);
profileRoute.post('/', (0, upload_file_1.upload)('multiple', '', [
    { name: 'profileImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
]), profile_controller_1.createProfile);
profileRoute.put('/', (0, upload_file_1.upload)('multiple', '', [
    { name: 'profileImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
]), authentication_1.authentication, profile_controller_1.updateProfile);
exports.default = profileRoute;
