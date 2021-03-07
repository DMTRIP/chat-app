import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService) => configService.mongoConfig,
    inject: [ConfigService],
  }),
];
