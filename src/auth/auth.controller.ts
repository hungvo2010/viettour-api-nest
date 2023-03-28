import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Response } from 'express';
import { Constant } from 'src/constant';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('/v1.0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const jwtToken = this.authService.generateToken(req.user);
    response.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: Constant.COOKIE_EXPIRES_IN,
    });
  }

  @Post('/register')
  async register(
    @Body() registerDto: RegisterAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(registerDto);

    const user = await this.authService.register(registerDto);
    const jwtToken = this.authService.generateToken(user);
    response.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: Constant.COOKIE_EXPIRES_IN,
    });
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(req.user, changePasswordDto);
  }

  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }
}
