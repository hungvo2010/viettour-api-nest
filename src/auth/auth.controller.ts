import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
  UnprocessableEntityException,
  HttpStatus,
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
    const jwtToken = await this.authService.generateToken(req.user);
    response.status(HttpStatus.OK).cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: Constant.COOKIE_EXPIRES_IN,
    });
    response.json({
      item: req.user,
      timestamp: new Date().toISOString(),
    });
  }

  @Post('/register')
  async register(
    @Body() registerDto: RegisterAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new UnprocessableEntityException(
        'Password and confirm password are not the same',
      );
    }
    const user = await this.authService.register(registerDto);
    const jwtToken = await this.authService.generateToken(user);

    response.status(HttpStatus.CREATED).cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: Constant.COOKIE_EXPIRES_IN,
    });
    response.json({
      item: user,
      timestamp: new Date().toISOString(),
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
    response.status(HttpStatus.OK).clearCookie('jwt');
  }
}
