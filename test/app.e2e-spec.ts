import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/auth/isdataexists (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/isdataexists')
      .send({
        username: 'test',
        email: 'test@example.com',
      })
      .expect(200)
      .expect({
        is_email_exists: false,
        is_username_exists: false,
      });
  });
});
