import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { CreateBulkAvailabilityDto } from './dto/create-bulk-availability.dto';
import { FilterAvailabilityDto } from './dto/filter-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorateurs/role.decorateur';
import { Role } from '@prisma/client';

@Controller('availabilities')
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  create(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.availabilitiesService.create(createAvailabilityDto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  createBulk(@Body() createBulkDto: CreateBulkAvailabilityDto) {
    return this.availabilitiesService.createBulk(createBulkDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterAvailabilityDto) {
    if (
      filterDto.doctorId !== undefined ||
      filterDto.startDate !== undefined ||
      filterDto.endDate !== undefined ||
      filterDto.isBooked !== undefined
    ) {
      return this.availabilitiesService.findFiltered(filterDto);
    }
    return this.availabilitiesService.findAll();
  }

  @Get('doctor/:doctorId')
  findByDoctorId(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.availabilitiesService.findByDoctorId(doctorId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.availabilitiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.availabilitiesService.update(id, updateAvailabilityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.availabilitiesService.remove(id);
  }
}
