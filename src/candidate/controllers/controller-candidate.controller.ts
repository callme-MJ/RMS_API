import {
  Body,
  Controller,
  Delete,
  Get, Param,
  ParseIntPipe, Patch, Post,
  Query,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/login/interfaces/user-roles.enum';
import { Roles } from 'src/login/user/decorators/roles.decorators';
import { RolesGuard } from 'src/login/user/guards/roles.guard';
import { CandidateDTO } from '../dtos/candidate.dto';
import { UpdateCandidateDTO } from '../dtos/update-candidate.dto';
import { CandidateService, ICandidateFilter } from '../services/candidate.service';

@UseGuards(AuthGuard('jwt-user'), RolesGuard)
@Roles(Role.CONTROLLER)
@Controller('controller/candidates')
export class ControllerCandidatesController {
  constructor(
    private readonly candidateService: CandidateService
  ) { }

  @Get()
  async getCandidates(@Query() queryParams: ICandidateFilter) {
    try {
      return await this.candidateService.findAllCandidates(queryParams)
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createCandidate(
    @Body() payload: CandidateDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.candidateService.createCandidate(payload, photo,);
  }

  @SerializeOptions({ groups: ['single'] })
  @Get(':chestNO')
  async findCandidateBychestNO(
    @Param('chestNO', ParseIntPipe) chestNO: number,
  ) {
    return await this.candidateService.findCandidateBychestNO(+chestNO);
  }

  @Delete(':id')
  async deleteCandidateByID(@Param('id', ParseIntPipe) id: number) {
    return this.candidateService.deleteCandidate(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(ValidationPipe)
  async updateCandidate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCandidateDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.candidateService.updateCandidate(+id, body, photo);
  }
}
