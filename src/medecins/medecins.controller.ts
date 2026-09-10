import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MedecinsService } from './medecins.service';
import { CreateMedecinDto } from './dto/create-medecin.dto';
import { UpdateMedecinDto } from './dto/update-medecin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorateurs/role.decorateur';
import { Role } from '@prisma/client';

@Controller('medecins')

export class MedecinsController {
  constructor(private readonly medecinsService: MedecinsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createMedecinDto: CreateMedecinDto) {
    return this.medecinsService.create(createMedecinDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.medecinsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medecinsService.findOne(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMedecinDto: UpdateMedecinDto) {
    return this.medecinsService.update(id, updateMedecinDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medecinsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/specialties')
  setSpecialties(
    @Param('id', ParseIntPipe) id: number,
    @Body('specialtyIds') specialtyIds: number[],
  ) {
    return this.medecinsService.setSpecialties(id, specialtyIds);
  }
}
