import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Constant } from 'src/common/constant';
import { excludeField } from 'src/common/utils';
import { ResponseUtils } from 'src/common/utils/ResponseUtils';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import ResponseMessage from './auth.constant';
import { AuthService } from './auth.service';
import { IdTokenDto } from './dto/IdToken.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

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
    return ResponseUtils.response(0, 'Login successfully', {
      item: req.user,
    });
  }

  @Post('/register')
  async register(
    @Body() registerDto: RegisterAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException(
        ResponseMessage.CONFIRM_PASSWORD_DOES_NOT_WORK,
      );
    }
    const user = await this.authService.register(registerDto);
    const jwtToken = await this.authService.generateToken(user);

    response
      .status(HttpStatus.CREATED)
      .cookie('jwt', jwtToken, Constant.COOKIE_OPTIONS);
    return {
      item: excludeField(user, ['password']),
    };
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return {};
  }

  @Post('/google/redirect')
  async handleGoogleRedirect(
    @Body() idTokenDto: IdTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newUser = await this.authService.handleGoogleLogin(idTokenDto);
    const jwtToken = await this.authService.generateToken(newUser);

    response
      .status(HttpStatus.OK)
      .cookie('jwt', jwtToken, Constant.COOKIE_OPTIONS);
    return {
      item: newUser,
    };
  }

  @Post('/facebook/redirect')
  async handleFacebookRedirect(
    @Body() idTokenDto: IdTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const newUser = await this.authService.handleFacebookLogin(idTokenDto);
    const jwtToken = await this.authService.generateToken(newUser);

    response
      .status(HttpStatus.OK)
      .cookie('jwt', jwtToken, Constant.COOKIE_OPTIONS);
    return {
      item: excludeField(newUser, ['password']),
    };
  }

  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        ResponseMessage.CONFIRM_PASSWORD_DOES_NOT_WORK,
      );
    }
    await this.authService.changePassword(req.user, changePasswordDto);
    return {
      item: {},
      message: ResponseMessage.PASSWORD_CHANGE_SUCCESS,
    };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt', Constant.COOKIE_OPTIONS);
  }
}
