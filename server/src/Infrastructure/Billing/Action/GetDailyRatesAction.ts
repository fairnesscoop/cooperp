import {Controller, Inject, UseGuards, Get} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiUseTags, ApiBearerAuth, ApiOperation} from '@nestjs/swagger';
import {IQueryBus} from 'src/Application/IQueryBus';
import {DailyRateView} from 'src/Application/Billing/View/DailyRate/DailyRateView';
import {GetDailyRatesQuery} from 'src/Application/Billing/Query/DailyRate/GetDailyRatesQuery';

@Controller('daily_rates')
@ApiUseTags('Billing')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
export class GetDailyRatesAction {
  constructor(
    @Inject('IQueryBus')
    private readonly queryBus: IQueryBus
  ) {}

  @Get()
  @ApiOperation({title: 'Get all daily rates'})
  public async index(): Promise<DailyRateView[]> {
    return await this.queryBus.execute(new GetDailyRatesQuery());
  }
}
