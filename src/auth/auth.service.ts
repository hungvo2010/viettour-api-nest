import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as firebaseAdmin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';

import { RegisterAuthDto } from './dto/register-auth.dto';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Constant } from 'src/common/constant';
import { ChangePasswordDto } from './dto/change-password.dto';
import ResponseMessage from './auth.constant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterAuthDto) {
    const existUser = await this.usersService.findByEmail(registerDto.email);
    if (existUser)
      throw new ConflictException(ResponseMessage.ACCOUNT_ALREADY_EXIST);
    const data = await this.prepareCreateUserDto(registerDto);
    const user = await this.usersService.create(data);
    return user;
  }

  async changePassword(
    { email, userId },
    { currentPassword, newPassword }: ChangePasswordDto,
  ) {
    const user = await this.usersService.findByEmail(email);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch)
      throw new UnauthorizedException(ResponseMessage.CURRENT_PASSWORD_WRONG);

    const hashedPassword = await bcrypt.hash(newPassword, Constant.SALT_ROUNDS);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  async handleGoogleLogin({ idToken }) {
    const userProfile = await this.getGoogleUserProfile(idToken);
    return await this.usersService.updateOrCreate(userProfile);
  }

  async handleFacebookLogin({ idToken }) {
    const userProfile = await this.getFacebookUserProfile(idToken);
    return await this.usersService.updateOrCreate(userProfile);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user)
      throw new UnauthorizedException(ResponseMessage.WRONG_CREDENTIALS);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }

    throw new UnauthorizedException(ResponseMessage.WRONG_CREDENTIALS);
  }

  async generateToken(user: User) {
    const payload = { email: user.email, userId: user.id };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: Constant.JWT_EXPIRES_IN,
    });
  }

  async prepareCreateUserDto(registerDto: RegisterAuthDto) {
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      Constant.SALT_ROUNDS,
    );
    return {
      email: registerDto.email,
      fullname: registerDto.fullname,
      password: hashedPassword,
    };
  }

  async getGoogleUserProfile(idToken: string): Promise<any> {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
      const userRecord = await firebaseAdmin.auth().getUser(userId);
      const { displayName, email, photoURL } = userRecord;
      this.logger.log('Login with Google: email = ' + email);
      return { fullname: displayName, email, avatarUrl: photoURL };
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      throw error;
    }
  }

  async getFacebookUserProfile(idToken: string): Promise<any> {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;
      const userRecord = await firebaseAdmin.auth().getUser(userId);
      const { displayName, email, photoURL } = userRecord;
      this.logger.log('Login with Google: email = ' + email);
      return { fullname: displayName, email, avatarUrl: photoURL };
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      throw error;
    }
  }
}
