// creates an end user account
/**
 * @swagger
 * /v1/users/:
 *   post:
 *     summary: end user' google, facebook, apple, crypto' signature
 *     description: |
 *       Crate End user endpoint, should be used with Authorization header set to App JWT.
 *       App JWT example: {JWT token}
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/definitions/UserGoogleAppleFacebookLogin'
 *               - $ref: '#/definitions/SignatureRegistration'
 *           examples:
 *             social:
 *               value:
 *                 loginType: google | facebook | apple
 *                 password: pass
 *                 authToken: token
 *             signature:
 *               value:
 *                 loginType: signature
 *                 walletAddress: '0xd374e71b0943d2ca83968cb3c41332fc693a7427'
 *                 signature: '0xc83dcf6b475cf99026505658d87741ce9180cc0b4a4ab78d7044d3b9e9d3fdf153e3e9c9c549c06ca26581cdf5398b485129a64affdcc2357b4de68283fe4a541c'
 *                 msg: 'Register'
 *                 firsName: Crypto
 *                 lastName: Man
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/sign-up-with-email/:
 *   post:
 *     summary: Users are allowed to register from the application, but they will need an authorization token from the corresponding application.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               signupPlan:
 *                  type: string
 *                  enum: [business, free]
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/create-with-app-id/{id}:
 *   post:
 *     summary: If the user has the appropriate ACL, they can create other users for the application with the ID passed as a parameter
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/create-many-with-app-id/{id}:
 *   post:
 *     summary: If the user has the appropriate ACL, they can create other users for the application with the ID passed as a parameter
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usersList:
 *                 type: array
 *                 items:
 *                   $ref: '#/definitions/UserData'
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/tags-set/{appId}:
 *   post:
 *     summary: Set tags to the users. To preserve the previous user tags, they need to be sent along with the new tags.
 *     description: Set tags to the users. To preserve the previous user tags, they need to be sent along with the new tags. Allows do delete tags with [] tagsList.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usersIdList:
 *                 type: array
 *                 items:
 *                   type: string
 *               tagsList:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/tags-add/{appId}:
 *   post:
 *     summary: Add tags to the users.
 *     description: Add tags to the users.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usersIdList:
 *                 type: array
 *                 items:
 *                   type: string
 *               tagsList:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/tags-delete/{appId}:
 *   post:
 *     summary: Removing tags specified in the request body from users.
 *     description: Removing tags specified in the request body from users.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usersIdList:
 *                 type: array
 *                 items:
 *                   type: string
 *               tagsList:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */


/**
 * @swagger
 * /v1/users/terms-and-conditions:
 *   post:
 *     summary: post terms and conditions
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAgreeWithTerms:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: A successful response
 */



/**
 * @swagger
 * /v1/users/login:
 *   post:
 *     summary: end user' login by google, facebook, apple, crypto' signature
 *     description: |
 *       End user login endpoint, should be used with Authorization header set to App JWT.
 *       App JWT example: {JWT token}
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/definitions/UserGoogleAppleFacebookLogin'
 *               - $ref: '#/definitions/SignatureLogin'
 *           examples:
 *             social:
 *               value:
 *                 loginType: google | facebook | apple
 *                 password: pass
 *                 authToken: token
 *             signature:
 *               value:
 *                 loginType: signature
 *                 walletAddress: '0xd374e71b0943d2ca83968cb3c41332fc693a7427'
 *                 signature: '0xc83dcf6b475cf99026505658d87741ce9180cc0b4a4ab78d7044d3b9e9d3fdf153e3e9c9c549c06ca26581cdf5398b485129a64affdcc2357b4de68283fe4a541c'
 *                 msg: 'Login'
 *     responses:
 *       '200':
 *         description: A successful response
 *       '409':
 *          description: user did not validate his email in registration step
 */

/**
 * @swagger
 * /v1/users/login-with-email:
 *   post:
 *     summary: login with email and password
 *     description: |
 *       End user login endpoint, should be used with Authorization header set to App JWT.
 *       Ethora App JWT example: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxZTU1YzlkOTBlYTk5NTk0YmM3ZTZhMiIsImFwcE5hbWUiOiJFdGhvcmEiLCJhcHBHb29nbGVJZCI6Ijk3MjkzMzQ3MDA1NC1oYnNmMjlvaHBhdG83NnRpbDJqdGY2amdnMWI0Mzc0Yy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImNyZWF0b3JJZCI6IjYyYzNmNGE5M2FkMjcwNjc0YzFmNjJmYiIsImNyZWF0ZWRBdCI6IjIwMjItMDctMDVUMDg6Mjc6MjYuMzM2WiIsIl9fdiI6MH0sImlhdCI6MTY1NzAwOTY1OH0.dnvrO_dQ_2GLyUX-b71CcHFDnphpjeTYOxz6vZ2fsPY
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/set-permanent-password-with-temp-password:
 *   post:
 *     summary: set-permanent-password-with-temp-password
 *     tags:
 *       - Users
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tempPassword:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/login/refresh:
 *   post:
 *     description: User refreshing
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: A successful response
 */
// refresh user token

/**
 * @swagger
 * /v1/users/changePassword:
 *   post:
 *     description: change user password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               npassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

// e-mail verification
/**
 * @swagger
 * /v1/users/verifyEmail:
 *   post:
 *     description:  e-mail verification
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               npassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

// resend email verification link
/**
 * @swagger
 * /v1/users/resendLink:
 *   post:
 *     description: resend email verification link
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

// requests a password reset
/**
 * @swagger
 * /v1/users/forgot:
 *   post:
 *     description: requests a password reset
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

// resets a user's password
/**
 * @swagger
 * /v1/users/reset:
 *   post:
 *     description: resets a user's password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

// route to check if particular user exists in all database
/**
 * @swagger
 * /v1/users/checkEmail/{email}:
 *   get:
 *     description: route to check if particular user exists in all database
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/{appId}:
 *   get:
 *     description: get users, require App Jwt
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *       - in: query
 *         name: limit
 *         type: number
 *       - in: query
 *         name: offset
 *         type: number
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [email, createdAt, firstName, lastName]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/:
 *   put:
 *     description: Update current users
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               zip:
 *                 type: string
 *               description:
 *                 type: string
 *               isProfileOpen:
 *                 type: boolean
 *               isAssetsOpen:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/{appId}/{userId}:
 *   put:
 *     description: Update users by id
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               zip:
 *                 type: string
 *               description:
 *                 type: string
 *               isProfileOpen:
 *                 type: boolean
 *               isAssetsOpen:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/count:
 *   get:
 *     description: count users
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: tag
 *         type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns profile data + image for currently authenticated user
/**
 * @swagger
 * /v1/users/profile/{walletAddress}:
 *   get:
 *     description: access to user profile
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */
// returns profile data + image for currently authenticated user
/**
 * @swagger
 * /v1/users/profile/{walletAddress}/{accessToken}:
 *   get:
 *     description: access to user profile
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         type: string
 *         required: true
 *       - in: path
 *         name: accessToken
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/search:
 *   post:
 *     description: users search
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               zip:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */


// adds tag (or tags) to a user
/**
 * @swagger
 * /v1/users/referral:
 *   post:
 *     description: post new refferal
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               referrerId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */


// return user's action
/**
 * @swagger
 * /v1/users/actions:
 *   get:
 *     description: countTokenCreation for app
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns a last 5 days of new user registrations for a particular Application
/**
 * @swagger
 * /v1/users/graph:
 *   get:
 *     description: returns a last 5 days of new user registrations for a particular Application
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users:
 *   delete:
 *     description: deleting current user
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/delete-many-with-app-id/{id}:
 *   post:
 *     description: deleting user by user id
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usersIdList
 *             properties:
 *               usersIdList:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/reset-passwords-with-app-id/{id}:
 *   post:
 *     description: reseting password for users from usersIdList
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usersIdList
 *             properties:
 *               usersIdList:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

//#region Emails request
/**
 * @swagger
 * /v1/users/emails:
 *   post:
 *     description: add emails
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginType:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/emails:
 *   get:
 *     description: get user emails
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/emails/{email}:
 *   delete:
 *     description: deleting user email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

// creates an end user account
/**
 * @swagger
 * /v1/users/payments:
 *   post:
 *     description: payments
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               transaction:
 *                 type: Object
 *     responses:
 *       '200':
 *         description: A successful response
 */

// creates an end user account
/**
 * @swagger
 * /v1/users/checkExtWallet:
 *   post:
 *     description: check if ext wallet exists
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               walletAddress:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/acl:
 *   get:
 *     description: get current user' acls
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: A successful response
 */


/**
 * @swagger
 * /v1/users/acl/{appId}/{userId}:
 *   put:
 *     description: update acl for appId and userId respectively
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               network:
 *                 type: object
 *                 properties:
 *                   netStats:
 *                     type: object
 *                     properties:
 *                       read:
 *                         type: boolean
 *               application:
 *                 type: object
 *                 properties:
 *                   appCreate:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                   appSettings:
 *                     type: object
 *                     properties:
 *                       read:
 *                         type: boolean
 *                       update:
 *                         type: boolean
 *                       admin:
 *                         type: boolean
 *                   appUsers:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                       read:
 *                         type: boolean
 *                       update:
 *                         type: boolean
 *                       delete:
 *                         type: boolean
 *                       admin:
 *                         type: boolean
 *                   appTokens:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                       read:
 *                         type: boolean
 *                       update:
 *                         type: boolean
 *                       admin:
 *                         type: boolean
 *                   appPush:
 *                     type: object
 *                     properties:
 *                       create:
 *                         type: boolean
 *                       read:
 *                         type: boolean
 *                       update:
 *                         type: boolean
 *                       admin:
 *                         type: boolean
 *                   appStats:
 *                     type: object
 *                     properties:
 *                       read:
 *                         type: boolean
 *                       admin:
 *                         type: boolean
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/exportData:
 *   get:
 *     description: get current user' data as JSON file
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/users/export/{appId}:
 *   get:
 *     description: export users
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: A successful response
 */

//create an app
/**
 * @swagger
 * /v1/apps:
 *   post:
 *     description: App creation
 *     tags:
 *       - Apps
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *             properties:
 *               displayName:
 *                 type: string
 *               domainName:
 *                 type: string
 *               appDescription:
 *                 type: string
 *               defaultAccessProfileOpen:
 *                 type: boolean
 *               defaultAccessAssetsOpen:
 *                 type: boolean
 *               usersCanFree:
 *                 type: boolean
 *               logoImage:
 *                 type: string
 *                 format: binary
 *               loginScreenBackgroundImage:
 *                 type: string
 *                 format: binary
 *               coinLogoImage:
 *                 type: string
 *                 format: binary
 *               bundleId:
 *                 type: string
 *               primaryColor:
 *                 type: string
 *               secondaryColor:
 *                 type: string
 *               coinSymbol:
 *                 type: string
 *               coinName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

//update an app with id
/**
 * @swagger
 * /v1/apps/{id}:
 *   put:
 *     description: App update
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - displayName
 *             properties:
 *               displayName:
 *                 type: string
 *               domainName:
 *                 type: string
 *               appDescription:
 *                 type: string
 *               defaultAccessProfileOpen:
 *                 type: boolean
 *               defaultAccessAssetsOpen:
 *                 type: boolean
 *               usersCanFree:
 *                 type: boolean
 *               logoImage:
 *                 type: string
 *                 format: binary
 *               loginScreenBackgroundImage:
 *                 type: string
 *                 format: binary
 *               coinLogoImage:
 *                 type: string
 *                 format: binary
 *               googleServicesJson:
 *                 type: string
 *                 format: binary
 *               GoogleServiceInfoPlist:
 *                 type: string
 *                 format: binary
 *               GoogleServiceInfoPlist2:
 *                 type: string
 *                 format: binary
 *               primaryColor:
 *                 type: string
 *               secondaryColor:
 *                 type: string
 *               coinSymbol:
 *                 type: string
 *               coinName:
 *                 type: string
 *               firebaseWebConfigString:
 *                 type: string
 *               loginBackgroundColor:
 *                 type: string
 *               defaultRooms:
 *                 type: array
 *                 items:
 *                   $ref: '#/definitions/DefaultRooms'
 *                    
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/apps/user-defaults/{id}:
 *   put:
 *     description: App update
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               defaultAccessProfileOpen:
 *                 type: boolean
 *               defaultAccessAssetsOpen:
 *                 type: boolean
 *               usersCanFree:
 *                 type: boolean
 *               defaultRooms:
 *                 type: array
 *                 items:
 *                   $ref: '#/definitions/DefaultRooms'
 *                    
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/apps/check-domain-name:
 *   post:
 *     description: check domain name
 *     tags:
 *       - Apps
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domainName
 *             properties:
 *               domainName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/apps/get-config:
 *   get:
 *     description: get app data config
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: query
 *         name: domainName
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/apps/get-default-rooms:
 *   get:
 *     description: returns default rooms for application, appJwt is required
 *     tags:
 *       - Apps
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/apps/get-default-rooms/app-id/{appId}:
 *   get:
 *     description: return default rooms for application, userJwt is required
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/apps/{id}:
 *   delete:
 *     description: App delete
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/apps/rotate-jwt/{id}:
 *   delete:
 *     description: rotate app jwt
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/apps/:
 *   get:
 *     description: Allows to get a list of all applications for which the user has reading permissions.
 *     tags:
 *       - Apps
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/explorer/transactions/:
 *   get:
 *     description: Get transactions
 *     tags:
 *       - Explorer
 *     parameters:
 *       - in: query
 *         name: limit
 *         type: number
 *         default: 10
 *       - in: query
 *         name: offset
 *         type: number
 *         default: 0
 *       - in: query
 *         name: tokenId
 *         type: string
 *       - in: query
 *         name: walletAddress
 *         type: string
 *       - in: query
 *         name: nftId
 *         type: string
 *       - in: query
 *         name: tokenName
 *         type: string
 *       - in: query
 *         name: _id
 *         type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/explorer/transactions/{transactionHash}:
 *   get:
 *     description: Get transaction by transactionHash
 *     tags:
 *       - Explorer
 *     parameters:
 *       - in: path
 *         name: transactionHash
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns blocks
/**
 * @swagger
 * /v1/explorer/blocks/:
 *   get:
 *     description: Get blocks
 *     tags:
 *       - Explorer
 *     parameters:
 *       - in: query
 *         name: limit
 *         type: number
 *         default: 10
 *       - in: query
 *         name: offset
 *         type: number
 *         default: 0
 *     responses:
 *       '200':
 *         description: A successful response
 */
/**
 * @swagger
 * /v1/explorer/blocks/{blockNumber}:
 *   get:
 *     description: Get block by blockNumber
 *     tags:
 *       - Explorer
 *     parameters:
 *       - in: path
 *         name: blockNumber
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns the last 14 days of transactions count (by day) (used in dashboard Explorer graph)
/**
 * @swagger
 * /v1/explorer/history:
 *   get:
 *     description: Get history
 *     tags:
 *       - Explorer
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns type of specific transaction by contract address
/**
 * @swagger
 * /v1/explorer/type/{address}:
 *   get:
 *     description: Returns type of specific transaction by contract address
 *     tags:
 *       - Explorer
 *     parameters:
 *       - in: path
 *         name: address
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns multiple params (difficult, blocknumer, transactions length) with one call
/**
 * @swagger
 * /v1/explorer/dashBlock:
 *   get:
 *     description: Returns type of specific transaction by contract address
 *     tags:
 *       - Explorer
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns latest 5 day transaction count by a particular Application
/**
 * @swagger
 * /v1/explorer/graph:
 *   get:
 *     description: returns latest 5 day transaction count by a particular Application
 *     tags:
 *       - Explorer
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns a count of all contracts (token issuances) by specific Application (from DB)
// (a token issuance counts as 1 contract)
/**
 * @swagger
 * /v1/explorer/count/contract:
 *   get:
 *     description: returns a count of all contracts (token issuances) by specific Application (from DB)
 *     tags:
 *       - Explorer
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns a count of all ERC20 tokens across platform/blockchain (from DB)
/**
 * @swagger
 * /v1/explorer/count:
 *   get:
 *     description: returns a count of all ERC20 tokens across platform/blockchain (from DB)
 *     tags:
 *       - Explorer
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns multiple blockchain parameters for dashboard (network health etc)
/**
 * @swagger
 * /v1/explorer/blockchain:
 *   get:
 *     description: returns multiple blockchain parameters for dashboard (network health etc)
 *     tags:
 *       - Explorer
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/files/:
 *   post:
 *     description: Files upload
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/files/encrypted/:
 *   post:
 *     description: Files upload
 *     tags:
 *       - Files
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/files/:
 *   get:
 *     description: get files created by user (JWT owner)
 *     tags:
 *       - Files
 *     parameters:
 *       - in: query
 *         name: limit
 *         type: number
 *         default: 10
 *       - in: query
 *         name: offset
 *         type: number
 *         default: 0
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/files/{id}:
 *   get:
 *     description: get file created by user (JWT owner) by id
 *     tags:
 *       - Files
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/files/{id}:
 *   delete:
 *     description: delete created by user (JWT owner) by id
 *     tags:
 *       - Files
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/items:
 *   post:
 *     description: Create ERC721 token (NFT)
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mediaId
 *               - rarity
 *             properties:
 *               name:
 *                 type: string
 *               mediaId:
 *                 type: string
 *               rarity:
 *                 type: number
 *     responses:
 *       '200':
 *         description: A successful response
 */

// transfers a token from one wallet to another
// (needs ACL to make sure app only owner level can do this and only transfer from wallets belonging to their app)

/**
 * @swagger
 * /v1/tokens/transfer:
 *   post:
 *     description: transfers a ERC20 token from one wallet to another
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenId:
 *                 type: string
 *                 default: ERC20
 *               tokenName:
 *                 type: string
 *               amount:
 *                 type: number
 *               toWallet:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/transfer/items:
 *   post:
 *     description: transfers a ERC721 token from one wallet to another
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nftId:
 *                 type: string
 *               receiverWallet:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/burn/items:
 *   post:
 *     description: Burn NFT
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nftId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: A successful response
 */

// This is used for extra issuance of a token type that already exists
/**
 * @swagger
 * /v1/tokens/mint:
 *   post:
 *     description: This is used for extra issuance of a token type that already exists
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenId:
 *                 type: string
 *                 default: ERC20
 *               tokenName:
 *                 type: string
 *               toWallet:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: A successful response
 */

// Burn feature to remove existing tokens (only allows to burn tokens in user's own wallet)
/**
 * @swagger
 * /v1/tokens/:
 *   delete:
 *     description: Burn feature to remove existing tokens (only allows to burn tokens in user's own wallet)
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenId:
 *                 type: string
 *                 default: ERC20
 *               tokenName:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: A successful response
 */

//API to supply issuance count
/**
 * @swagger
 * /v1/tokens/count:
 *   get:
 *     description: API to supply issuance count
 *     tags:
 *       - Tokens
 *     responses:
 *       '200':
 *         description: A successful response
 */

//provides token issuance history for a particular Application
/**
 * @swagger
 * /v1/tokens/history/:
 *   get:
 *     description: provides token issuance history for a particular Application
 *     tags:
 *       - Tokens
 *     responses:
 *       '200':
 *         description: A successful response
 */

// provides token distribution graph data across app wallet and other wallets
/**
 * @swagger
 * /v1/tokens/graph/:
 *   get:
 *     description: provides token distribution graph data across app wallet and other wallets
 *     tags:
 *       - Tokens
 *     responses:
 *       '200':
 *         description: A successful response
 */
/**
 * @swagger
 * /v1/tokens/graph/{tokenName}:
 *   get:
 *     description: provides token distribution graph data across app wallet and other wallets
 *     tags:
 *       - Tokens
 *     parameters:
 *       - in: path
 *         name: tokenName
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

// This is used for extra issuance of a token type that already exists
/**
 * @swagger
 * /v1/tokens/items/nfmt:
 *   post:
 *     description: create NFMT contract
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum:
 *                   - light
 *                   - normal
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 description: contract' name
 *               symbol:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 5
 *                 description: contract' symbol
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 512
 *                 description: contract' description for metadata
 *               owner:
 *                 type: string
 *                 description: owner Eth wallet address
 *               beneficiaries:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: array of beneficiaries' addresses
 *               splitPercents:
 *                 type: array
 *                 items:
 *                   type: number
 *                   description: array of percents values (50% == 500)
 *               maxSupplies:
 *                 type: array
 *                 items:
 *                   type: number
 *                   description: array of maxSupplies for tokenId
 *               costs:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: array of costs' for every tokenId in Wei
 *               attachmentId:
 *                 type: string
 *                 description: mongoId for image(file) for which NFMT will be created
 *     responses:
 *       '200':
 *         description: A successful response
 */

//API to supply issuance count
/**
 * @swagger
 * /v1/tokens/get:
 *   get:
 *     description: get all tokens
 *     tags:
 *       - Tokens
 *     responses:
 *       '200':
 *         description: A successful response
 */
/**
 * @swagger
 * /v1/tokens/get/{contractAddress}:
 *   get:
 *     description: get token by contractAddress
 *     tags:
 *       - Tokens
 *     parameters:
 *       - in: path
 *         name: contractAddress
 *         type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/items/nfmt/mint:
 *   post:
 *     description: mint NFMT contract
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractAddress:
 *                 type: string
 *               slot:
 *                 type: number
 *                 description: index number from arrays of maxSupplies and costs, tokenId - 1
 *               amount:
 *                 type: number
 *               target:
 *                 type: string
 *                 description: eth address
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/items/nfmt/transfer:
 *   post:
 *     description: transfer for NFMT contract
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Eth wallet address
 *               id:
 *                 type: number
 *                 description: tokeId
 *               amount:
 *                 type: number
 *               contractAddress:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/export:
 *   post:
 *     description: export for NFMT contract
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractAddress:
 *                 type: string
 *               to:
 *                 type: string
 *                 description: wallet address
 *               id:
 *                 type: number
 *                 description: tokenId
 *               amount:
 *                 type: number
 *                 description: amount of tokens for export
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/export-to-usdc:
 *   post:
 *     description: export coins to USDC L1
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *               l1Address:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/items/nfmt/transferOwnership:
 *   post:
 *     description: NFMT transferOwnership
 *     tags:
 *       - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toAddress:
 *                 type: string
 *               contractAddress:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/items/nfmt/burn/{contractAddress}/{tokenId}:
 *   post:
 *     description: NFMT burn
 *     tags:
 *       - Tokens
 *     parameters:
 *       - in: path
 *         name: contractAddress
 *         type: string
 *         required: true
 *       - in: path
 *         name: tokenId
 *         type: number
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/tokens/items/nfmt/collection-destroy/{contractAddress}:
 *   post:
 *     description: NFMT destroy collection
 *     tags:
 *       - Tokens
 *     parameters:
 *       - in: path
 *         name: contractAddress
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

//  creates a token (global across blockchain)
//  any authenticated user can do this (need to introduce ACL)
/**
 * @swagger
 * /v1/tokens/{appId}:
 *   post:
 *     description: Create ERC20 token for appId
 *     tags:
 *       - Tokens
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - tokenId
 *               - tokenName
 *               - tokenSymbol
 *               - amount
 *             properties:
 *               tokenName:
 *                 type: string
 *               tokenSymbol:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       '200':
 *         description: A successful response
 */

// returns specific token balance in specific wallet
// if token name is not supplied, all tokens within wallet will be shown
/**
 * @swagger
 * /v1/wallets/balance:
 *   get:
 *     description: Get balances by walletAddress
 *     tags:
 *       - Wallets
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/wallets/ext-wallet:
 *   post:
 *     description: Create external wallet
 *     tags:
 *       - Wallets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/wallets/ext-wallet/{l2Address}:
 *   get:
 *     description: get external wallet by id
 *     tags:
 *       - Wallets
 *     parameters:
 *       - in: path
 *         name: l2Address
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/wallets/ext-wallet/:
 *   put:
 *     description: update external wallet by id
 *     tags:
 *       - Wallets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/wallets/ext-wallet/{address}:
 *   delete:
 *     description: delete external wallet by id
 *     tags:
 *       - Wallets
 *     parameters:
 *       - in: path
 *         name: address
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

//get ether balance for a particular wallet using wallet address
/**
 * @swagger
 * /v1/wallets/balance/{walletAddress}/ethers:
 *   get:
 *     description: get ether balance for a particular wallet using wallet address
 *     tags:
 *       - Wallets
 *     parameters:
 *       - name: walletAddress
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

//update default token for particular wallet using user id of wallet
/**
 * @swagger
 * /v1/wallets/updateDefaultToken:
 *   patch:
 *     description: update default token for particular wallet using user id of wallet
 *     tags:
 *       - Wallets
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               defaultToken:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

//returns all application and app owner's wallet for a particular user if specifc user id of wallet not provided
//returns a specific app wallet and app's JWT if app id i.e user id of wallet is provided. (This also checks whether user is requesting wallet he has access to.)
/**
 * @swagger
 * /v1/wallets/:
 *   get:
 *     description: Get wallets
 *     tags:
 *       - Wallets
 *     responses:
 *       '200':
 *         description: A successful response
 */
/**
 * @swagger
 * /v1/wallets/{appId}:
 *   get:
 *     description: Get wallets
 *     tags:
 *       - Wallets
 *     parameters:
 *       - name: appId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/data:
 *   post:
 *     description: Object creation
 *     tags:
 *       - Data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: value
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/data/{id}:
 *   get:
 *     description: get object
 *     tags:
 *       - Data
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/data:
 *   get:
 *     description: Get objects by className
 *     tags:
 *       - Data
 *     parameters:
 *       - in: query
 *         name: where
 *         type: object
 *         additionalProperties:
 *           type: object
 *       - in: query
 *         name: limit
 *         type: number
 *         default: 10
 *       - in: query
 *         name: offset
 *         type: number
 *         default: 0
 *       - in: query
 *         name: sort
 *         type: string
 *         enum: [asc, desc]
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/data/{id}:
 *   patch:
 *     description: Object update
 *     tags:
 *       - Data
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/data/{id}:
 *   delete:
 *     description: Object delete
 *     tags:
 *       - Data
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/docs:
 *   post:
 *     description: Docs creation
 *     tags:
 *       - Docs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *               documentName:
 *                 type: string
 *               isBurnable:
 *                 type: boolean
 *               isTransferable:
 *                 type: boolean
 *               isFilesMutableByAdmin:
 *                 type: boolean
 *               isFilesMutableByOwner:
 *                 type: boolean
 *               isSignable:
 *                 type: boolean
 *               isSignatureRevocable:
 *                 type: boolean
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/docs/share/{accessToken}:
 *   get:
 *     description: get document file by accessToken (share link)
 *     tags:
 *       - Docs
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/docs/{walletAddress}:
 *   get:
 *     description: Docs get
 *     tags:
 *       - Docs
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */
/**
 * @swagger
 * /v1/docs/{walletAddress}/{docId}:
 *   get:
 *     description: Docs get
 *     tags:
 *       - Docs
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         type: string
 *         required: true
 *       - in: path
 *         name: docId
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/docs/{id}:
 *   delete:
 *     description: Docs delete
 *     tags:
 *       - Docs
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/room/:
 *   post:
 *     summary: create new room
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               roomJid:
 *                 type: string
 *               from:
 *                 type: object
 *                 properties:
 *                   direction:
 *                     type: string
 *                   roomJid:
 *                     type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/room/:
 *   get:
 *     summary: get all user' rooms
 *     tags:
 *       - Room
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/room/{roomJid}:
 *   delete:
 *     summary: delete room by roomJid
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: roomJid
 *         type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/room/join/{roomJid}:
 *   post:
 *     summary: join to room
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: roomJid
 *         type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/room/currentRoom:
 *   get:
 *     summary: get current room for the auth' user
 *     tags:
 *       - Room
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/room/getRoom/{roomJid}:
 *   get:
 *     summary: get room inf by roomJid
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: roomJid
 *         type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/room/{roomJid}:
 *   put:
 *     description: update room
 *     tags:
 *       - Room
 *     parameters:
 *       - in: path
 *         name: roomJid
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerNavLinks:
 *                 type: object
 *                 properties:
 *                   north:
 *                     type: string
 *                   east:
 *                     type: string
 *                   south:
 *                     type: string
 *                   west:
 *                     type: string
 *               userNavLinks:
 *                 type: object
 *                 properties:
 *                   north:
 *                     type: string
 *                   east:
 *                     type: string
 *                   south:
 *                     type: string
 *                   west:
 *                     type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/room/check-for-meta-room:
 *   post:
 *     description: get meta rooms by user room list
 *     tags:
 *       - Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/sharelink:
 *   post:
 *     description: sharelink creation
 *     tags:
 *       - Sharelink
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expiration:
 *                 type: number
 *               memo:
 *                 type: string
 *               resource:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/sharelink/:
 *   get:
 *     description: Docs get
 *     tags:
 *       - Sharelink
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/sharelink/{token}:
 *   delete:
 *     description: Docs get
 *     tags:
 *       - Sharelink
 *     parameters:
 *       - in: path
 *         name: token
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/mobile/get-custom-src/{appId}:
 *   get:
 *     description: get custom mobile src code by appId
 *     tags:
 *       - Mobile
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */

/**
 * @swagger
 * /v1/mobile/check-custom-src/{appId}:
 *   get:
 *     description: check if custom src exists, return file stats if it exists
 *     tags:
 *       - Mobile
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: A successful response
 */


/**
 * @swagger
 * /v1/mobile/src-builder/{appId}:
 *   post:
 *     description: creates new mobile scr code for appId
 *     tags:
 *       - Mobile
 *     parameters:
 *       - in: path
 *         name: appId
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logoImage:
 *                 type: string
 *                 format: binary
 *               loginScreenBackgroundImage:
 *                 type: string
 *                 format: binary
 *               coinLogoImage:
 *                 type: string
 *                 format: binary
 *               bundleId:
 *                 type: string
 *               appName:
 *                 type: string
 *               primaryColor:
 *                 type: string
 *               secondaryColor:
 *                 type: string
 *               coinSymbol:
 *                 type: string
 *               coinName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 */
