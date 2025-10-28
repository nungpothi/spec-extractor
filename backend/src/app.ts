import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Import infrastructure
import { initializeDatabase } from './infrastructure/database/dataSource';
import { SpecificationRepository } from './infrastructure/repositories';

// Import use cases
import {
  GetAllSpecificationsUseCase,
  GetSpecificationByIdUseCase,
  CreateSpecificationUseCase,
  DeleteSpecificationUseCase,
  JsonToHtmlConverterService,
  PreviewJsonUseCase,
} from './usecases';

// Import interface layer
import {
  SpecificationController,
  PreviewController,
  errorHandler,
  requestLogger,
  createSpecificationRoutes,
  createPreviewRoutes,
} from './interface';
import { authRoutes, requirementRoutes, webhookRoutes, quotationRoutes } from './interface/routes';

class Application {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '8000');
    
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined'));
    }
    this.app.use(requestLogger);
  }

  private setupRoutes(): void {
    // Dependency injection
    const specificationRepository = new SpecificationRepository();
    const jsonToHtmlConverter = new JsonToHtmlConverterService();

    // Initialize use cases
    const getAllSpecificationsUseCase = new GetAllSpecificationsUseCase(specificationRepository);
    const getSpecificationByIdUseCase = new GetSpecificationByIdUseCase(specificationRepository);
    const createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationRepository,
      jsonToHtmlConverter
    );
    const deleteSpecificationUseCase = new DeleteSpecificationUseCase(specificationRepository);
    const previewJsonUseCase = new PreviewJsonUseCase(jsonToHtmlConverter);

    // Initialize controllers
    const specificationController = new SpecificationController(
      getAllSpecificationsUseCase,
      getSpecificationByIdUseCase,
      createSpecificationUseCase,
      deleteSpecificationUseCase
    );
    const previewController = new PreviewController(previewJsonUseCase);

    // Setup routes
    this.app.use('/api', createSpecificationRoutes(specificationController));
    this.app.use('/api', createPreviewRoutes(previewController));
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/requirements', requirementRoutes);
    this.app.use('/api/webhook', webhookRoutes);
    this.app.use('/api/quotations', quotationRoutes);

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        status: false,
        message: 'Route not found',
        results: [],
        errors: ['Route not found'],
      });
    });

    // Error handler (must be last)
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await initializeDatabase();
      
      // Setup routes after database initialization
      this.setupRoutes();
      
      // Start server
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`🔗 API base URL: http://localhost:${this.port}/api`);
      });
    } catch (error) {
      console.error('Failed to start application:', error);
      process.exit(1);
    }
  }
}

// Start the application
const app = new Application();
app.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
