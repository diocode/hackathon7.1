require('dotenv').config();

console.log('Environment Variables Check:');
console.log('----------------------------');
console.log('AWS Region:', process.env.AWS_REGION);
console.log('Database Name:', process.env.AWS_DATABASE_NAME);
console.log('Database Endpoint:', process.env.AWS_DATABASE_ENDPOINT);
console.log('Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Not Set');
console.log('Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Not Set');
console.log('API Gateway URL:', process.env.AWS_API_GATEWAY_URL); 