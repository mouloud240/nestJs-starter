import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';

import { AppModule } from './app.module';
async function bootstrap() {
  // the cors will be changed to the front end url  in production environnement
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ['http://localhost:3000', 'https://beta.portals.cam'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  //SECURITY
  // added a basic auth for the swagger docs
  // TODO: add those into .env
  // app.use(
  //   ['/api-docs', '/api-docs-json'],
  //   BasicAuth({
  //     users: { portals: 'Portals@2025' },
  //     challenge: true,
  //   }),
  // );
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        },
      },
    }),
  );

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.session());

  app.use(passport.initialize());

  //TODO configure with devops team later
  // const opts: DoubleCsrfConfigOptions = {
  //   getSecret: () => 'Secret', //TODO:generate a secret
  //   getSessionIdentifier: (req: extendedReq) => req.user.id.toString(), //TODO:figure this out    cookieName: '__Host-psifi.x-csrf-token', // The name of the cookie to be used, recommend using Host prefix.
  //   cookieOptions: {
  //     sameSite: 'lax', // Recommend you make this strict if posible
  //     path: '/',
  //     secure: false, //TODO:change in prod
  //     httpOnly: false,
  //   },
  //   size: 64, // The size of the generated tokens in bits
  //   ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // A list of request methods that will not be protected.
  //   getTokenFromRequest: (req) => req.headers['x-csrf-token'], // A function that returns the token from the request
  // };
  // const { doubleCsrfProtection } = doubleCsrf(opts);
  // //app.use(doubleCsrfProtection); //TODO:configure in prod
  //
  // app.useGlobalInterceptors(new LoggerInterceptor());
  // //PIPES
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  //FILTERS
  // app.useGlobalFilters(new PrismaExceptionFilter());
  // app.useGlobalFilters(new RedisExceptionFilter());
  // app.useGlobalFilters(new GlobalExceptionFilter());
  // app.useGlobalFilters(new CustomWsExceptionFilter());
  //
  //app.useGlobalFilters(new ElasticSearchExceptionFilter()); //TODO:figure out what error to catch
  //--
  app.enableShutdownHooks();
  //Those to are for handling the shutdown of the server
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    app
      .close()
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error while shutting down gracefully:', err);
      });
  });
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    app
      .close()
      .then(() => {
        process.exit(0);
      })
      .catch((e) => {
        console.log(e);
      });
  });
  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
  //SWAGGER DOCS BUILDER
  const config = new DocumentBuilder()
    .setTitle('Portals Core Api Documentation')
    .setDescription('The Portals Core Api Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Portals')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/api-docs',
    apiReference({
      theme: 'solarized',
      content: document,
    }),
  );

  //RUNNING THE APPLICATION
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
