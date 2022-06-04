import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    // super calls the constructor of PrismaClient
    // PrismaClient needs the following properties:
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
    console.log(config.get('DATABASE_URL'));
  }

  // Delete bookmarks THEN users
  // $transaction ensures execution order is followed, top to bottom
  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
