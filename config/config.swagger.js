const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'Wallet-App API',
            version: '1.0.0',
            description: '# Documentation\n' +
                '\n' +
                'The Wallet-App API is a feature-rich application that allows users to manage their finances by recording income and expenses in various categories. It also provides user authentication and authorization to ensure data privacy and security.\n' +
                '\n' +
                '## Features\n' +
                '\n' +
                '- **User Authentication:** Users can register and log in to access their financial data securely.\n' +
                '\n' +
                '- **Transaction Management:** Users can add, update, and retrieve their financial transactions, including details like type, category, amount, date, and comments.\n' +
                '\n' +
                '- **User Balances:** The application keeps track of users\' balances, automatically adjusting them when new transactions are added.\n' +
                '\n' +
                '- **Statistics:** Users can retrieve financial statistics, including total income and expenses for a specific date range.\n' +
                '\n' +
                '## API Endpoints\n' +
                '\n' +
                '- `/user/register` (POST): Register a new user with a unique email and password.\n' +
                '- `/user/login` (POST): Log in to the application and receive an authentication token.\n' +
                '- `/user/logout` (GET): Log out the authenticated user.\n' +
                '- `/user/{userId}/transactions` (GET): Get a list of transactions for a specific user.\n' +
                '- `/user/current` (GET): Authenticates user, returns his data.\n' +
                '- `/user/{userId}/statistics` (GET): Get financial statistics for a specific user and date range.\n' +
                '- `/transaction` (POST, PATCH, GET, DELETE): Add a new transaction, update an existing transaction, get a specific transaction by ID, or delete transaction.\n' +
                '\n' +
                '## Server Information\n' +
                '\n' +
                'The API is hosted on the main (production) server at `https://wallet-app-18x3.onrender.com`.\n' +
                '\n' +
                '## Version\n' +
                '\n' +
                'API Version: 1.0.0\n' +
                '\n' +
                '## Security\n' +
                '\n' +
                'To access protected endpoints, users must include a valid JWT (JSON Web Token) in the `Authorization` header.\n' +
                '\n' +
                'Please refer to the specific endpoint documentation for more details on request and response formats.\n'
        },
        servers: [
            {
                url: 'https://wallet-app-18x3.onrender.com',
                description: 'Main (production) server',
            }
        ]
    },
    apis: ['./routes/*.js']
};

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization
 *   - name: User
 *     description: User operations
 *   - name: Transactions
 *     description: User transaction operations
 *   - name: Statistics
 *     description: User statistics operations
 */

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;