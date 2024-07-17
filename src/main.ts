import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.use(
    cookieSession({
      keys: [configService.get<string>('COOKIE_SESSION')],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}....`);    
  });
}
bootstrap();
