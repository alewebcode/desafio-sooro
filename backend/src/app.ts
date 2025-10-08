import express from 'express';
import cors from 'cors';
import './database/data-source';
import 'dotenv/config';
import { routes } from './http/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

export { app };
