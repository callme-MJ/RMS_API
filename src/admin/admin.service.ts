import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>
    ) { }

    public async findByID(id: number): Promise<Admin> {
        return this.adminRepository.findOneBy({id})
    }

    
    public async findByUsername(username: string): Promise<Admin> {
        try {
            return this.adminRepository.findOne({
                where: { username }
            });
        } catch (error) {
            throw error;
        }
    }

    public async findByColumn(column: string, value: string): Promise<Admin> {
        try {
            return this.adminRepository.findOne({
                where: {
                    [column]: value
                }
            });
        } catch (error) {
            throw error;
        }
    }
}
