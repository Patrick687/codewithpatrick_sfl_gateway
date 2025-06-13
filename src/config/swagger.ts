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
                // League service schemas (proxied)
                League: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'League unique identifier',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                        },
                        name: {
                            type: 'string',
                            description: 'League name',
                            example: 'Premier League 2024',
                        },
                        description: {
                            type: 'string',
                            description: 'League description',
                            example: 'A competitive fantasy football league',
                        },
                        maxMembers: {
                            type: 'integer',
                            description: 'Maximum number of members allowed',
                            example: 12,
                        },
                        currentMembers: {
                            type: 'integer',
                            description: 'Current number of members',
                            example: 8,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'League creation timestamp',
                            example: '2024-01-15T10:30:00Z',
                        },
                        createdBy: {
                            type: 'string',
                            format: 'uuid',
                            description: 'ID of the user who created the league',
                            example: '456e7890-e89b-12d3-a456-426614174001',
                        },
                    },
                },
                CreateLeagueRequest: {
                    type: 'object',
                    required: ['name', 'maxMembers'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'League name',
                            example: 'Premier League 2024',
                        },
                        description: {
                            type: 'string',
                            description: 'League description',
                            example: 'A competitive fantasy football league',
                        },
                        maxMembers: {
                            type: 'integer',
                            minimum: 2,
                            maximum: 20,
                            description: 'Maximum number of members (2-20)',
                            example: 12,
                        },
                    },
                },
                UpdateLeagueRequest: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'League name',
                            example: 'Premier League 2024 Updated',
                        },
                        description: {
                            type: 'string',
                            description: 'League description',
                            example: 'An updated competitive fantasy football league',
                        },
                        maxMembers: {
                            type: 'integer',
                            minimum: 2,
                            maximum: 20,
                            description: 'Maximum number of members (2-20)',
                            example: 15,
                        },
                    },
                },
                LeagueWithMembers: {
                    allOf: [
                        { $ref: '#/components/schemas/League' },
                        {
                            type: 'object',
                            properties: {
                                members: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/LeagueMember',
                                    },
                                },
                            },
                        },
                    ],
                },
                LeagueMember: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Member unique identifier',
                            example: '789e0123-e89b-12d3-a456-426614174002',
                        },
                        userId: {
                            type: 'string',
                            format: 'uuid',
                            description: 'User ID of the member',
                            example: '456e7890-e89b-12d3-a456-426614174001',
                        },
                        username: {
                            type: 'string',
                            description: 'Username of the member',
                            example: 'john_doe',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email of the member',
                            example: 'john@example.com',
                        },
                        joinedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'When the user joined the league',
                            example: '2024-01-20T14:30:00Z',
                        },
                        isOwner: {
                            type: 'boolean',
                            description: 'Whether this member is the league owner',
                            example: false,
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
