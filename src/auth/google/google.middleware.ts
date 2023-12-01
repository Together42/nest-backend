import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class GoogleMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GoogleMiddleware.name);
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const rawCookies = req.headers.cookie?.split(';');
    const parsedCookies: any = {};
    rawCookies?.forEach((rawCookie) => {
      const parsedCookie = rawCookie.split('=');
      parsedCookies[parsedCookie[0].trim()] = parsedCookie[1];
    });
    const token = parsedCookies.google_token;

    if (token) {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/oauth2/v3/tokeninfo',
          {
            params: {
              access_token: token,
            },
          },
        );
        const userInfo = response.data;
        if (!userInfo) {
          throw new Error('Invalid token');
        }
        req['user'] = userInfo;
        console.log('userInfo', userInfo);
        next();
      } catch (error) {
        this.logger.error(error);
        res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      this.logger.error('Token not found');
      res.status(401).json({ message: 'Token not found' });
    }
  }
}
