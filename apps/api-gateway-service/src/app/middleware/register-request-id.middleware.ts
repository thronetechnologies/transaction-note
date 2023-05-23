import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterRequestId implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.startEpoch = Date.now();
    req.headers['requestId'] = uuidv4();
    next();
  }
}
