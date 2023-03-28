import {
  ConflictException,
  Injectable,
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
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterAuthDto) {
    const existUser = await this.usersService.findOne(registerDto.email);
    if (existUser) throw new ConflictException();
    const data = await this.prepareCreateUserDto(registerDto);
    const user = await this.usersService.create(data);
    return user;
  }

  async changePassword(
    { email, userId },
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findOne(email);
    const isMatch = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException();
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      Constant.SALT_ROUNDS,
    );
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
    const user = await this.usersService.findOne(email);
    if (!user) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async generateToken(user: User) {
    const payload = { email: user.email, userId: user.id };
    return this.jwtService.sign(payload);
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
