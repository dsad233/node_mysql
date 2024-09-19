import swaggerUi from "swagger-ui-express";
import swaggereJsdoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        openapi : "3.0.0",
        info: {
            title: 'node_mysql API',
            version: '1.0.0',
            description: 'node_mysql API with express',
        },
        servers: [
            {
              url: 'http://localhost:3000',
            }
          ],
        components : {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
    },
    apis: ['src/**/*.js']
};

const specs = swaggereJsdoc(options);

const swagger = {
    swaggerUi,
    specs
};

export default swagger;