import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from '../schemas/user.schema';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

/**
 * CRUD משתמשים: רק ‎`role: 'admin'` (עם ‎`RolesGuard` + JWT). מחיקה/עריכה/הוספה — אותה רמה.
 */
@Controller('users')
@UseGuards(RolesGuard)
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto, @Req() req: Request) {
    const actor = req.user as UserDocument;
    return this.usersService.create(dto, actor);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: Request) {
    const actor = req.user as UserDocument;
    return this.usersService.update(id, dto, actor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const u = req.user as UserDocument;
    const uid = (u as UserDocument & { _id: { toString: () => string } })._id.toString();
    return this.usersService.remove(id, uid, u);
  }
}
