"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiSpec = void 0;
exports.openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'EcoQuest Platform API',
        version: '1.0.0',
        description: 'Enterprise Gamified Environmental Education Platform API Specification',
        contact: {
            name: 'EcoQuest Engineering Team',
            email: 'support@ecoquest.edu',
        },
    },
    servers: [
        {
            url: 'http://localhost:5000/api/v1',
            description: 'Local Development Server',
        },
    ],
    paths: {
        '/health': {
            get: {
                summary: 'Health Check Endpoint',
                responses: {
                    '200': { description: 'Platform is healthy and operational' },
                },
            },
        },
        '/auth/login': {
            post: {
                summary: 'User Login & Token Generation',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'JWT tokens and user profile' },
                },
            },
        },
        '/modules': {
            get: {
                summary: 'List Environmental Curriculum Modules',
                responses: {
                    '200': { description: 'List of published modules' },
                },
            },
        },
        '/quizzes': {
            get: {
                summary: 'List All Quiz Assessments',
                responses: {
                    '200': { description: 'Quizzes list' },
                },
            },
        },
        '/gamification/overview': {
            get: {
                summary: 'Student XP, Level, Streak & Badge Gallery',
                responses: {
                    '200': { description: 'Gamification stats overview' },
                },
            },
        },
        '/ai/chat': {
            post: {
                summary: 'AI Environmental Assistant Chat Query',
                responses: {
                    '200': { description: 'AI Assistant answer with study recommendations' },
                },
            },
        },
        '/reports/student': {
            get: {
                summary: 'Student Progress & Performance Report',
                responses: {
                    '200': { description: 'Student metrics summary' },
                },
            },
        },
    },
};
