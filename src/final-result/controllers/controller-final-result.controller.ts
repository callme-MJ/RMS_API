import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from 'src/category/category.service';
import { InstituteService } from 'src/institute/institute.service';
import { Role } from 'src/login/interfaces/user-roles.enum';
import { Roles } from 'src/login/user/decorators/roles.decorators';
import { IProgramFilter, ProgramsService } from 'src/program/program.service';
import { SessionService } from 'src/session/session.service';
import { CreateCodeLetterDto } from '../dto/create-codeLetter.dto';
import { CreateFinalMarkDto } from '../dto/create-final-mark.dto';
import { CreateFinalResultDTO } from '../dto/create-final-result.dto';
import { FinalResultService } from '../final-result.service';

@Controller('user/final-result')
@UseGuards(AuthGuard('jwt-user'))
@Roles(Role.CONTROLLER)
export class ControllerFinalResultController {
  constructor(
    private readonly finalResultService: FinalResultService,
    private readonly programService: ProgramsService,
    private readonly categoryService: CategoryService,
    private readonly instituteService: InstituteService,
    private readonly sessionService: SessionService,
  ) {}
  @Get('categories')
  async findCategories(@Query() query: any) {
    const categories = await this.categoryService.findAll(query.sessionID);
    return categories;
  }

  @Get('institutes')
  async findInstitutes(@Query() query: any) {
    const institute = await this.instituteService.findAll(query.sessionID);
    return institute;
  }

  @Get('sessions')
  async findSessions() {
    const institute = await this.sessionService.getAllSessions();
    return institute;
  }

  @Get('/programs')
  async findAll(@Query() queryParams: IProgramFilter) {
    try {
      const programs = this.programService.findAll(queryParams);
      // console.log((await programs).length)
      return programs;
    } catch (error) {
      throw error;
    }
  }
 

  @Get('candidates/:code')
  async findOne(@Param('code') code: string) {
    const candidate = await this.finalResultService.findCandidatesOfProgram(
      code,
    );
    return candidate;
  }

  @Post('/marks/one')
  @UsePipes(ValidationPipe)
  create(@Body() createEliminationMarkDto: CreateFinalMarkDto) {
    return this.finalResultService.entryMarks(createEliminationMarkDto);
  }

  @Delete('/marks/one/:id')
  DeleteMarks(@Param('id') id: number) {
    return this.finalResultService.DeleteMarks(id);
  }

  @Get('/marks/all')
  findAllMarks() {
    return this.finalResultService.findAllMarks();
  }

  @Get('/marks/programs/:code')
  findAllMarksOfProgram(@Param('code') code: string) {
    return this.finalResultService.findAllMarksOfProgram(code);
  }

  @Post('/:id')
  @UsePipes(ValidationPipe)
  createResult(
    @Body() CreateFinalResultDTO: CreateFinalResultDTO,
    @Param('id') id: number,
  ) {
    return this.finalResultService.createResult(CreateFinalResultDTO, id);
  }

  @Delete('/:id')
  deleteResult(
    @Param('id') id: number,
    ) {
      return this.finalResultService.deleteResult(id);
    }
  @Post('/submit/:id')
  submitResult(
    @Param('id') id: number,
  ) {
    return this.finalResultService.submitResult( id);
  }
  @Delete('/submit/:id')
  unsubmitResult(
    @Param('id') id: number,
  ) {
    return this.finalResultService.unsubmitResult( id);
  }


  @Get('/:id')
  getResult(@Param('id') id: number) {
    return this.finalResultService.getResult(id);
  }

  @Get('/program/:code')
  getResultOfProgram(@Param('code') code: string) {
    return this.finalResultService.getResultOfProgram(code);
  }
  @Get('/program/pp/:code')
  getPrivatePublishedResultOfProgram(@Param('code') code: string) {
    return this.finalResultService.getPrivatePublishedResultOfProgram(code);
  }

  @Get('/institutions/published/all')
  getTotalOfInstitutionsPublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsPublished(queryParams);
  }
  @Get('/institutions/private-published/all')
  getTotalOfInstitutionsPrivatePublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsPrivatePublished(queryParams);
  }

  @Get('/institutions/entered/all')
  getTotalOfInstitutionsEntered(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsEntered(queryParams);
  }

  @Get('/institutions/published/category')
  getTotalOfInstitutionsByCategoryPublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsByCategoryPublished(queryParams);
  }
  @Get('/institutions/private-published/category')
  getTotalOfInstitutionsByCategoryPrivatePublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsByCategoryPrivatePublished(queryParams);
  }

  @Get('/institutions/entered/category')
  getTotalOfInstitutionsByCategoryEntered(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getTotalOfInstitutionsByCategoryEntered(queryParams);
  }

  @Get('/institutions/published/category/:id')
  getTotalOfInstitutionsCategoryPublished(@Param('id') id: number) {
    return this.finalResultService.getTotalOfInstitutionsCategoryPublished(id);
  }
  @Get('/institutions/private-published/category/:id')
  getTotalOfInstitutionsCategoryPrivatePublished(@Param('id') id: number) {
    return this.finalResultService.getTotalOfInstitutionsCategoryPrivatePublished(id);
  }

  @Get('/institutions/entered/category/:id')
  getTotalOfInstitutionsCategoryEntered(@Param('id') id: number) {
    return this.finalResultService.getTotalOfInstitutionsCategoryEntered(id);
  }

  
  @Get('/programs/status/published')
  getProgramStutusPublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getProgramStutusPublished(queryParams);
  }
  @Get('/programs/status/private-published')
  getProgramStutusprivatePublished(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getProgramStatusprivatePublished(queryParams);
  }

  @Get('/programs/status/entered')
  getProgramStatusEntered(@Query() queryParams: IProgramFilter) {
    return this.finalResultService.getProgramStatusEntered(queryParams);
  }

  @Get('/toppers/all')
  getToppers() {
    return this.finalResultService.getToppers();
  }

  @Post('/publish/:code')
  publishResult(@Param('code') code: string) {
    return this.finalResultService.publishResultOfFinal(code);
  }

  @Delete('/publish/:code')
  unPublishResult(@Param('code') code: string) {
    return this.finalResultService.unPublishResultOfFinal(code);
  }

  @Get("programs/published")
  getPublishedPrograms(@Query() queryParams: IProgramFilter){
    return this.finalResultService.getPublishedPrograms(queryParams)
  }

  @Post('/private-publish/:code')
  privatePublishResult(@Param('code') code: string) {
    return this.finalResultService.privatePublishResultOfFinal(code);
  }

  @Delete('/private-publish/:code')
  privateUnPublishResult(@Param('code') code: string) {
    return this.finalResultService.privateUnPublishResultOfFinal(code);
  }

  @Get("programs/private-published")
  getPrivagePublishedPrograms(@Query() queryParams: IProgramFilter){
    return this.finalResultService.getPrivatePublishedPrograms(queryParams)
  }

  @Get("programs/entered")
  getEnteredPrograms(@Query() queryParams: IProgramFilter){
    return this.finalResultService.getEnteredPrograms(queryParams)
  }

  @Get("/overview/all")
  getOverview(@Query() queryParams: IProgramFilter){
    console.log(queryParams)
    return this.finalResultService.getOverview(queryParams)
  }

  @Post("/candidate/codeLetter")
  addcodeLetter(@Body() createCodeLetterDto: CreateCodeLetterDto){
    return this.finalResultService.addCodeLetter(createCodeLetterDto)
  }

  @Post("/submitCodeLetter/:code")
  submitCodeLetter(@Param('code') code: string){
    return this.finalResultService.submitCodeLetter(code)
  }
  // @Get("scorecard/all")
  // getScoreCard(){
  //   return this.finalResultService.getScoreCard()
  // }
}
