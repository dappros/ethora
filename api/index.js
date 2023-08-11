const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = require("./swaggerOptions")

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const useSwagger = (app, swaggerPath = '/api-docs') => {
  app.use(swaggerPath, swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

module.exports = useSwagger
