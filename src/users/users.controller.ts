import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
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
    const { password, ...returnData } = user;
    return {
      item: returnData,
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

  @Post(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findByEmail(id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.delete(+id);
  // }
}
