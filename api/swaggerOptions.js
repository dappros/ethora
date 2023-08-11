const tags = require('./tags.js')
const path = require('path')

const pathToSwagger = path.resolve(__dirname, 'swagger.js')

module.exports = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Platform API',
      description: 'Platform API description',
      contact: {
        name: 'Dappros developers team',
      },
      server: ['http://localhost'],
    },
    tags: tags,
    schemes: ['https', 'http'],
    components: {
      securitySchemes: {
        JwtAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
    security: [
      {
        JwtAuth: [],
      },
    ],
    definitions: {
      DefaultRooms: {
        type: 'object',
        properties: {
          jid: {
            type: 'string'
          },
          pinned: {
            type: 'boolean'
          }
        }
      },
      UserData: {
        type: 'object',
        properties: {
          email: {
            type: 'string'
          },
          firstName: {
            type: 'string'
          },
          lastName: {
            type: 'string'
          }
        }
      },
      UserNormalLogin: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      UserEmailLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
        },
      },
      UserGoogleAppleFacebookLogin: {
        type: 'object',
        required: ['loginType', 'password', 'authToken'],
        properties: {
          loginType: {
            type: 'string',
            enum: ['google', 'facebook', 'apple'],
          },
          authToken: {
            type: 'string',
          },
          signupPlan: {
            type: 'string',
            enum: ['business', 'free']
          }
        },
      },
      SignatureLogin: {
        type: 'object',
        required: ['walletAddress', 'signature', 'msg'],
        properties: {
          walletAddress: {
            type: 'string',
          },
          signature: {
            type: 'string',
          },
          msg: {
            type: 'string',
          },
        },
      },
      SignatureRegistration: {
        type: 'object',
        required: [
          'walletAddress',
          'signature',
          'msg',
          'firstName',
          'lastName',
        ],
        properties: {
          walletAddress: {
            type: 'string',
          },
          signature: {
            type: 'string',
          },
          msg: {
            type: 'string',
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
        },
      },
      UsernameRegistration: {
        type: 'object',
        required: ['username', 'password', 'firstName', 'lastName'],
        properties: {
          username: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
        },
      },
      EmailRegistration: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
        },
      },
      UserLoginSuccess: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          msg: {
            type: 'string',
            default: 'success',
          },
          token: {
            type: 'string',
          },
          success_xmpp: {
            type: 'boolean',
          },
        },
      },
    },
  },
  apis: [pathToSwagger],
}
