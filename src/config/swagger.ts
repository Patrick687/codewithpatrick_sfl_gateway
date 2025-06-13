import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SFL Gateway API',
            version: '1.0.0',
            description: 'API Gateway for the SFL application - routes requests to various microservices',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                HealthResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'ok',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00.000Z',
                        },
                        service: {
                            type: 'string',
                            example: 'sfl-gateway',
                        },
                        version: {
                            type: 'string',
                            example: '1.0.0',
                        },
                    },
                },
                // Auth service schemas (proxied)
                RegisterRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            minLength: 8,
                            description: 'User password (minimum 8 characters)',
                            example: 'password123',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            minLength: 8,
                            description: 'User password',
                            example: 'password123',
                        },
                    },
                },
                ChangePasswordRequest: {
                    type: 'object',
                    required: ['oldPassword', 'newPassword'],
                    properties: {
                        oldPassword: {
                            type: 'string',
                            minLength: 8,
                            description: 'Current password',
                            example: 'oldpassword123',
                        },
                        newPassword: {
                            type: 'string',
                            minLength: 8,
                            description: 'New password (minimum 8 characters)',
                            example: 'newpassword123',
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            description: 'JWT authentication token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        user: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'User ID',
                                    example: 1,
                                },
                                email: {
                                    type: 'string',
                                    format: 'email',
                                    description: 'User email',
                                    example: 'user@example.com',
                                },
                            },
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message',
                            example: 'Invalid credentials',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts', './src/index.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'SFL Gateway API Documentation',
    }));

    // Serve the raw OpenAPI JSON
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
};

export default specs;
