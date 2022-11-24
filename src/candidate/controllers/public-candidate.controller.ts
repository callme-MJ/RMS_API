import { Controller, Get, Param, ParseIntPipe, Query, SerializeOptions } from '@nestjs/common';
import { CandidateService, ICandidateFilter } from '../services/candidate.service';

@Controller('public/candidate')
export class publicCandidatesController {
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

    @Get('details/:chestNO')
    async findCandidateDetails(@Param('chestNO', ParseIntPipe) chestNO: number,) {
        return this.candidateService.findCandidateDetails(+chestNO)
    }
}
