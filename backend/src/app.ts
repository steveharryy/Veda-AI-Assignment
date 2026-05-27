import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import assignmentRoutes from './routes/assignment.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the VedaAI Platform Backend API!',
    healthCheck: 'http://localhost:5000/health',
    endpoints: {
      assignments: 'http://localhost:5000/api/assignments'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/assignments', assignmentRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error(`Resource Not Found — ${req.method} ${req.url}`);
  error.status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
