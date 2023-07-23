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
    this.logger.log('user: ' + JSON.stringify(req.user));
    const user = await this.usersService.getProfile(req.user);
    const { password, ...profile } = user;
    return {
      item: profile,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    const user = await this.usersService.findByUserId(userId);
    const { password, ...returnData } = user;
    return {
      item: returnData,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':userId/tours')
  async getUserTours(@Param('userId') userId: string, @Request() req) {
    const tours = await this.usersService.getUserTours(
      userId,
      req.user?.userId,
    );
    return {
      values: tours,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    await this.usersService.update(userId, req.user.userId, updateUserDto);
    return {
      message: 'Update user successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
