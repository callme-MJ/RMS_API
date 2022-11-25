import { Gender } from "aws-sdk/clients/polly";
import { Photo } from "../interfaces/photo.entitiy";

export class Details {
  
    name: string;
  
    chestNO: number;
  
    photo: Photo;
  
    gender: Gender;
  
    institute: string;
  
    category: string;

    program: string[];

    }
  