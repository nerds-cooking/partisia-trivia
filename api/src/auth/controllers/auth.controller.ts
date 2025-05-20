import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getMe(@Req() req: Request) {
    // Ensure the user is logged in
    if (!req.session || !req.session.user) {
      throw new UnauthorizedException('Not logged in');
    }

    // Return the user info from the session
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: req.session.user,
    };
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).send({ message: 'Failed to log out' });
      }

      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.send({ message: 'Logged out successfully' });
    });
  }

  @Get('nonce')
  async getNonce(@Query('pub') pub: string) {
    return this.authService.generateNonce(pub);
  }

  @Post('login')
  async verifySignature(
    @Body() body: { address: string; signature: string },
    @Req() req: Request,
  ) {
    return this.authService.verifySignature(
      {
        address: body.address,
        signature: body.signature,
      },
      req,
    );
  }
}
