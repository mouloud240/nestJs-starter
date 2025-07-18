import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSacrificeDto } from './dtos/create-sacrifice.dto';
import { UpdateSacrificeDto } from './dtos/update-sacrifice.dto';

@Injectable()
export class SacrificeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSacrificeDto: CreateSacrificeDto) {
    return this.prisma.sacrifice.create({ data: createSacrificeDto });
  }

  async findAll() {
    return this.prisma.sacrifice.findMany();
  }

  async findOne(id: string) {
    return this.prisma.sacrifice.findUnique({ where: { id } });
  }

  async update(id: string, updateSacrificeDto: UpdateSacrificeDto) {
    return this.prisma.sacrifice.update({
      where: { id },
      data: updateSacrificeDto,
    });
  }

  async remove(id: string) {
    return this.prisma.sacrifice.delete({ where: { id } });
  }
  //should be called when receiving kafka call on sacrifice

  async assignSacrificer(
    sacrificeId: string,
    sacrificerId: string,
    slayedAt: Date,
  ) {
    return this.prisma.sacrifice.update({
      where: { id: sacrificeId },
      data: { sacrificedById: sacrificerId, slayedAt: slayedAt },
    });
  }
}
