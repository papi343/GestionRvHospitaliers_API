import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MedicalsRecordsService } from './medicals-records.service';
import { CreateMedicalsRecordDto } from './dto/create-medicals-record.dto';
import { UpdateMedicalsRecordDto } from './dto/update-medicals-record.dto';

@Controller('medicals-records')
export class MedicalsRecordsController {
  constructor(private readonly medicalsRecordsService: MedicalsRecordsService) {}

  @Post()
  create(@Body() createDto: CreateMedicalsRecordDto) {
    return this.medicalsRecordsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.medicalsRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicalsRecordsService.findOne(id);
  }

  @Get('appointment/:appointmentId')
  findByAppointmentId(@Param('appointmentId', ParseIntPipe) appointmentId: number) {
    return this.medicalsRecordsService.findByAppointmentId(appointmentId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMedicalsRecordDto,
  ) {
    return this.medicalsRecordsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.medicalsRecordsService.remove(id);
  }
}
