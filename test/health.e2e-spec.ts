import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

// Use the real AppModule so DI and global config match production
import { AppModule } from '../src/app.module';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health/liveness -> 200 and status ok', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/liveness')
      .expect(200);

    // Terminus contract
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('info');
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('details');

    // Our liveness indicates the service is up
    expect(res.body.info?.service?.status).toBe('up');
  });

  it('GET /health/readiness -> 200 and includes core checks', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/readiness')
      .expect(200);

    expect(res.body.status).toBe('ok');

    // With current implementation, these indicators are present
    expect(res.body.details).toHaveProperty('disk');
  });
});
