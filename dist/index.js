"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_route_1 = __importDefault(require("./routes/v2/index.route"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', index_route_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});
app.listen(port, () => {
    console.log(`Typescript Express app listening on port ${port}`);
});
