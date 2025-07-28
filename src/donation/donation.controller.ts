import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { USER } from 'src/authentication/decorators/user.decorartor';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { DonationResponseDto } from './dto/donation-response.dto';

@ApiTags('Donation')
@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new donation' })
  @ApiResponse({
    status: 201,
    description: 'The donation has been successfully created.',
    type: DonationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(
    @Body() createDonationDto: CreateDonationDto,
    @USER('id') userId: string,
  ) {
    return this.donationService.create(createDonationDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all donations for a specific year' })
  @ApiQuery({
    name: 'year',
    type: Number,
    description: 'The year to filter donations by',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of donations for the specified year.',
    type: [DonationResponseDto],
  })
  findAll(@Query('year', ParseIntPipe) year: number) {
    return this.donationService.findAll(year);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a donation by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the donation' })
  @ApiResponse({
    status: 200,
    description: 'Returns the donation with the specified ID.',
    type: DonationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Donation not found.' })
  findOne(@Param('id') id: string) {
    return this.donationService.findOne(id);
  }
}
