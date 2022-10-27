import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CreateSessionDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  year: string;

  @IsNotEmpty()
  chestNOPrefix: string;

  @Expose({ groups: ['single'], name: 'created_at' })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: ['single'], name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt: Date;
}
