import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSacrificerSacrificesCountDto } from './dtos/create-sacrificer-sacrifices-count.dto';
import { UpdateSacrificerSacrificesCountDto } from './dtos/update-sacrificer-sacrifices-count.dto';

@Injectable()
export class SacrificerSacrificesCountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createSacrificerSacrificesCountDto: CreateSacrificerSacrificesCountDto,
  ) {
    return this.prisma.sacrificerSacrificesCount.create({
      data: createSacrificerSacrificesCountDto,
    });
  }

  async findAll() {
    return this.prisma.sacrificerSacrificesCount.findMany();
  }

  async findOne(id: string) {
    return this.prisma.sacrificerSacrificesCount.findUnique({ where: { id } });
  }

  async update(
    id: string,
    updateSacrificerSacrificesCountDto: UpdateSacrificerSacrificesCountDto,
  ) {
    return this.prisma.sacrificerSacrificesCount.update({
      where: { id },
      data: updateSacrificerSacrificesCountDto,
    });
  }

  async remove(id: string) {
    return this.prisma.sacrificerSacrificesCount.delete({ where: { id } });
  }
}
