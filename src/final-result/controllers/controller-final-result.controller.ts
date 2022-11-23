import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Query,
  } from '@nestjs/common';
  import { FinalResultService } from '../final-result.service';
  import { CreateFinalMarkDto } from '../dto/create-final-mark.dto';
  import { UpdateFinalMarkDto } from '../dto/update-final-mark.dto';
  import { AuthGuard } from '@nestjs/passport';
  import { IProgramFilter, ProgramsService } from 'src/program/program.service';
  import { CreateFinalResultDTO } from '../dto/create-final-result.dto';
  
  @Controller('user/final-result')
  @UseGuards(AuthGuard('jwt-user'))
  export class ControllerFinalResultController {
    constructor(
      private readonly finalResultService: FinalResultService,
      private readonly programService: ProgramsService,
    ) {}
  
    @Get("/programs")
    async findAll(@Query() queryParams: IProgramFilter) {
      try {
        const programs =  this.programService.findAll(queryParams);
        console.log((await programs).length)
        return programs;
      } catch (error) {
        throw error;
      }
    }
  
    @Get('candidates/:code')
    async findOne(@Param('code') code: string) {
      const candidate = await this.finalResultService.findCandidatesOfProgram(code);
      return candidate;
    }
    
    @Post("/marks")
    @UsePipes(ValidationPipe)
    create(@Body() createEliminationMarkDto: CreateFinalMarkDto) {
      return this.finalResultService.entryMarks(createEliminationMarkDto);
    }
  
    @Get("/marks")
    Get() {
      return this.finalResultService.findAllMarks();
    }
  
    @Post("/:id")
    @UsePipes(ValidationPipe)
    createResult(@Body() CreateFinalResultDTO: CreateFinalResultDTO, @Param('id') id: number) {
      return this.finalResultService.createResult(CreateFinalResultDTO,id);
    }
  
    @Get("/:id")
    getResult(@Param('id') id: number) {
      return this.finalResultService.getResult(id);
    }
  
    @Get("/program/:code")
    getResultOfProgram(@Param('code') code: string) {
      return this.finalResultService.getResultOfProgram(code);
    }
  
    @Get("/institutions/all")
    getTotalOfInstitutions(@Query() queryParams: IProgramFilter) {
      return this.finalResultService.getTotalOfInstitutions(queryParams);
    }
  
    @Get("/institutions/category/:id")
    getTotalOfInstitutionsByCategory(@Param('id') id: number) {
      return this.finalResultService.getTotalOfInstitutionsByCategory(id);
    }
  
    @Get("/programs/status")
    getProgramsStutus(@Query() queryParams: IProgramFilter) {
      console.log(queryParams)
      return this.finalResultService.getProgramsStutus(queryParams);
    }
  
    
  }
  