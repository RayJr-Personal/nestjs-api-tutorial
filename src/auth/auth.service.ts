import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Gets "injected" to whatever called it in the controller file
// Don't worry about specifying what data type to return!

@Injectable()
export class AuthService {
  // Doesn't actually work even if PrismaModule is imported in AuthModule
  // Because PrismaModule isn't actually exporting PrismaService
  // This also means you have to do it in all other modules (User, Bookmark, etc.)
  // Solution is @Global in PrismaModule
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  test() {
    console.log('hello!');
  }

  async signup(dto: AuthDto) {
    try {
      // - generate pwd hash
      const hash = await argon.hash(dto.password);

      // - save new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // - return user token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Error with Request
        if (error.code === 'P2002') {
          // Violated unique constraint (see docs)

          // ForbiddenException is from NestJS (see docs)
          throw new ForbiddenException('Credentials taken');
        }
      }
      // If it's not an error from Prisma
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user doesn't exist, throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare pwd
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if pwd wrong, throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    // send user back
    return this.signToken(user.id, user.email);
  }

  // Token
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    // "sub" is standard JWT naming convention - unique id for subfields
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
