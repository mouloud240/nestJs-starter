import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SacrificerSacrificesCountService } from './sacrificer-sacrifices-count.service';
import { CreateSacrificerSacrificesCountDto } from './dtos/create-sacrificer-sacrifices-count.dto';
import { UpdateSacrificerSacrificesCountDto } from './dtos/update-sacrificer-sacrifices-count.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('sacrificer-sacrifices-count')
@Controller('sacrificer-sacrifices-count')
export class SacrificerSacrificesCountController {
  constructor(
    private readonly sacrificerSacrificesCountService: SacrificerSacrificesCountService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sacrificer sacrifices count' })
  @ApiResponse({
    status: 201,
    description:
      'The sacrificer sacrifices count has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(
    @Body()
    createSacrificerSacrificesCountDto: CreateSacrificerSacrificesCountDto,
  ) {
    return this.sacrificerSacrificesCountService.create(
      createSacrificerSacrificesCountDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all sacrificer sacrifices counts' })
  @ApiResponse({
    status: 200,
    description: 'Return all sacrificer sacrifices counts.',
  })
  findAll(@Query() query: any) {
    return this.sacrificerSacrificesCountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sacrificer sacrifices count by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the sacrificer sacrifices count.',
  })
  findOne(@Param('id') id: string) {
    return this.sacrificerSacrificesCountService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sacrificer sacrifices count' })
  @ApiResponse({
    status: 200,
    description:
      'The sacrificer sacrifices count has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body()
    updateSacrificerSacrificesCountDto: UpdateSacrificerSacrificesCountDto,
  ) {
    return this.sacrificerSacrificesCountService.update(
      id,
      updateSacrificerSacrificesCountDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sacrificer sacrifices count' })
  @ApiResponse({
    status: 200,
    description:
      'The sacrificer sacrifices count has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.sacrificerSacrificesCountService.remove(id);
  }
}
