"use strict";
// const express = require('express');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
let genres = [{
        id: 1,
        name: 'comedy',
    }, {
        id: 2,
        name: 'drama',
    }];
app.get('/', (req, res) => {
    res.send('Helo vidly');
});
app.get('/api/genres', (req, res) => {
    res.send(genres);
});
app.get('/api/genres:id', (req, res) => {
    const gToSend = genres.find(g => g.id === parseInt(req.params.id));
    res.send(gToSend);
});
app.listen(3000, () => console.log('listening on 3000'));
