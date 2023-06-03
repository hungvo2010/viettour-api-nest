import { GoogleAuthGuard } from '../guards/google-auth.guard';
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
  UnprocessableEntityException,
  HttpStatus,
  Logger,
  HttpCode,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Response } from 'express';
import { Constant } from 'src/common/constant';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('/v1.0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const jwtToken = await this.authService.generateToken(req.user);
    response
      .status(HttpStatus.OK)
      .cookie('jwt', jwtToken, Constant.COOKIE_OPTIONS);
    const { password, ...user } = req.user;
    response.json({
      item: user,
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

    response
      .status(HttpStatus.CREATED)
      .cookie('jwt', jwtToken, Constant.COOKIE_OPTIONS);
    const { password, ...newUser } = user;
    response.json({
      item: newUser,
      timestamp: new Date().toISOString(),
    });
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return {};
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newUser = await this.authService.handleGoogleLogin(req.user._json);
    const jwtToken = await this.authService.generateToken(newUser);

    response
      .status(HttpStatus.CREATED)
      .cookie('jwt', jwtToken, Constant.COOKIE_OPTIONS);

    response.redirect(process.env.ALLLOWED_CROSS_ORIGIN);
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new UnprocessableEntityException(
        'Password and confirm password are not the same',
      );
    }
    await this.authService.changePassword(req.user, changePasswordDto);
    return {
      item: {},
      message: 'Password changed successfully',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt', Constant.COOKIE_OPTIONS);
  }
}
