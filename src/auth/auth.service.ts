import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Constant } from 'src/constant';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  async handleGoogleLogin(user: any) {
    return this.usersService.upsert({
      email: user.email,
      fullname: user.name,
      avatarUrl: user.picture,
    });
  }
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterAuthDto) {
    const existUser = await this.usersService.findByEmail(registerDto.email);
    if (existUser)
      throw new ConflictException('An account with this email already exists');
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
    if (!isMatch) throw new UnauthorizedException('Current password is wrong');
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

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException('Your email or password is wrong');
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Your email or password is wrong');
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
    const data: CreateUserDto = {
      email: registerDto.email,
      fullname: registerDto.fullname,
      password: hashedPassword,
    };
    return data;
  }
}
