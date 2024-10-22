import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// This is a custom decorator that extracts the user object from the request object.
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
