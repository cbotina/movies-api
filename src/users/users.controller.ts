import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from './entities/user.entity';
import { Role } from 'src/common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/interfaces/request-with-user';
import { UserGuard } from 'src/common/guards/user-id.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(UserGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @Role(Roles.ADMIN)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @HttpCode(200)
  @Patch(':id/change-password')
  @UseGuards(UserGuard)
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(changePasswordDto, id);
  }
}
