import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);

// Health check at root
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'sfl-gateway',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = (): void => {
    app.listen(config.port, () => {
        console.log(`🚀 SFL Gateway running on port ${config.port}`);
        console.log(`📡 Environment: ${config.nodeEnv}`);
        console.log(`🔗 Auth Service: ${config.authServiceUrl}`);
        console.log(`🌐 CORS Origin: ${config.corsOrigin}`);
    });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start the server if this file is run directly
if (require.main === module) {
    startServer();
}

export default app;
