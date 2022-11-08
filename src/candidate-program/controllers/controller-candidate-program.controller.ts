import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/login/interfaces/user-roles.enum';
import { Roles } from 'src/login/user/decorators/roles.decorators';
import { RolesGuard } from 'src/login/user/guards/roles.guard';
import {
  CandidateProgramService,
  ICandidateProgramFIilter
} from '../candidate-program.service';
import { CreateCandidateProgramDTO } from '../dto/create-candidate-program.dto';

@UseGuards(AuthGuard('jwt-user'),RolesGuard)
@Roles(Role.CONTROLLER)
@Controller('user/candidate-programs')
export class ControllerCandidateProgramController {
  constructor(
    private readonly candidateProgramService: CandidateProgramService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCandidateProgramDto: CreateCandidateProgramDTO) {
    return this.candidateProgramService.create(createCandidateProgramDto);
  }

  @Get()
  findAll(@Query() queryParams: ICandidateProgramFIilter) {
    return this.candidateProgramService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.candidateProgramService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidateProgramDto: CreateCandidateProgramDTO,
  ) {
    return this.candidateProgramService.update(+id, updateCandidateProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.candidateProgramService.remove(+id);
  }
}
