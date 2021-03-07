import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = () =>
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService) => {
      mongod = new MongoMemoryServer();
      const mongoUri = await mongod.getUri();
      return {
        ...configService.mongoConfig,
        uri: mongoUri,
      };
    },
    inject: [ConfigService],
  });

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
};
