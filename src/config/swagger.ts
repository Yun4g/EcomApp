import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EcomApp API',
            version: '1.0.0',
            description: 'API documentation for EcomApp',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: [
        './src/routes/*.ts',
           './src/Docs/*.ts'
    ]
}

export const swaggerSpec = swaggerJsdoc(options)