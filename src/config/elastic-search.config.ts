import { registerAs } from '@nestjs/config';

export default registerAs('elasticSearch', () => ({
  node: process.env.ELASTICSEARCH_NODE || 'https://localhost:9200',

  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
  },
}));
