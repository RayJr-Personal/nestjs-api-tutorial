import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';

// Using Pactum and Jest
describe('App e2e', () => {
  // Abstraction(?) of app
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Compiles a module. Useful for integration testing
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Emulates a Nest app for testing
    app = moduleRef.createNestApplication();

    // Pipes, used for DTO and validation testing
    // Setup needs to be similar to real server
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    // Starts server, then adds port
    await app.init();
    await app.listen(3333);

    // Resets the test DB (initialized above)
    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    // Sets base URL
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  // it.todo('should pass');

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('Should signin', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {});
  });
  describe('Bookmark', () => {
    describe('Create bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Edit bookmark by id', () => {});
    describe('Delete bookmark by id', () => {});
  });
});
