import { PartialType } from "@nestjs/mapped-types";
import { CandidateDTO } from "./candidate.dto";

export class UpdateCandidateDTO extends PartialType(CandidateDTO) {}