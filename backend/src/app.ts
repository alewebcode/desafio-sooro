import express from 'express';
import cors from 'cors';
import './database/data-source';

const app = express();

app.use(cors());
app.use(express.json());

export { app };
