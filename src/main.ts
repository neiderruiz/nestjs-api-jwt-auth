import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //exlude routes

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // useContainer

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // implement pipes validation

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const response = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: {},
          error: HttpStatus[HttpStatus.BAD_REQUEST],
        };

        errors.forEach((error: ValidationError) => {
          const field = error.property;
          const errorsList = Object.values(error.constraints);
          response.message[field] = errorsList;
        });

        return response;
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
