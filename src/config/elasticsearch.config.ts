import { registerAs } from '@nestjs/config';

export default registerAs('elasticSearch', () => ({
  node: process.env.ELASTICSEARCH_NODE || 'https://localhost:9200',
  timeout: parseInt(process.env.ELASTICSEARCH_TIMEOUT || '3000', 10),
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
}));
