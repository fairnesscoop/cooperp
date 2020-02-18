import {
  Controller,
  Inject,
  UseGuards,
  Get,
  Param,
  NotFoundException
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiUseTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {CustomerView} from 'src/Application/Customer/View/CustomerView';
import {GetCustomerByIdQuery} from 'src/Application/Customer/Query/GetCustomerByIdQuery';
import {IQueryBus} from 'src/Application/IQueryBus';
import {CustomerIdDTO} from './DTO/CustomerIdDTO';

@Controller('customers')
@ApiUseTags('Customer')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
export class GetCustomerAction {
  constructor(
    @Inject('IQueryBus')
    private readonly queryBus: IQueryBus
  ) {}

  @Get(':id')
  @ApiOperation({title: 'Get customer'})
  public async index(
    @Param() customerIdDto: CustomerIdDTO
  ): Promise<CustomerView> {
    try {
      return await this.queryBus.execute(
        new GetCustomerByIdQuery(customerIdDto.id)
      );
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
