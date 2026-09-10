import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MedecinsService } from './medecins.service';
import { CreateMedecinDto } from './dto/create-medecin.dto';
import { UpdateMedecinDto } from './dto/update-medecin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('medecins')
export class MedecinsController {
  constructor(private readonly medecinsService: MedecinsService) {}

  @Post()
  create(@Body() createMedecinDto: CreateMedecinDto) {
    return this.medecinsService.create(createMedecinDto);
  }

  @Get()
  findAll() {
    return this.medecinsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medecinsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMedecinDto: UpdateMedecinDto) {
    return this.medecinsService.update(id, updateMedecinDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medecinsService.remove(id);
  }

  @Post(':id/specialties')
  setSpecialties(
    @Param('id', ParseIntPipe) id: number,
    @Body('specialtyIds') specialtyIds: number[],
  ) {
    return this.medecinsService.setSpecialties(id, specialtyIds);
  }
}
