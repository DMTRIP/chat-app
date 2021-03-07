import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

interface AuthOptions {
  jwtSecret: string;
  signOptions: { expiresIn: string },
}

@Injectable()
export class ConfigService {
  get mongoConfig() {
    return {
      uri: process.env.MONGO_CONNECTION_URL,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };
  }

  get authOptions(): AuthOptions {
    return {
      jwtSecret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '1d' },
    };
  }
}
