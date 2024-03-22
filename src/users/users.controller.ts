import {
  Controller,
  Get,
  Body,
  Request,
  Param,
  UseGuards,
  Logger,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('/v1.0/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.usersService.getProfile(req.user.userId);
    return {
      item: user,
    };
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    const user = await this.usersService.findByUserId(userId);
    return {
      item: user,
    };
  }

  @Get(':userId/tours')
  @UseGuards(JwtAuthGuard)
  async getUserTours(@Param('userId') userId: string, @Request() req) {
    this.logger.log(req.user);
    const tours = await this.usersService.getUserTours(userId, req?.user?.userId);
    return {
      values: tours,
    };
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    await this.usersService.checkUserPermission(req.user.userId, userId);
    await this.usersService.updateUser(userId, updateUserDto);
    return {
      message: 'Update user successfully',
    };
  }
}
