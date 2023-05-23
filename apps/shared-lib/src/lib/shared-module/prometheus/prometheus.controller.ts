import { Controller, Get, Inject, Optional, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { Registry } from 'prom-client';

import {
  REGISTRY,
  HISTOGRAM_HTTP_RESPONSE_TIME,
} from '@shared-lib/lib/constants';
import { PrometheusService } from './prometheus.service';
import { HistogramOptions } from './interfaces/prometheus.interfaces';

@Controller('metrics')
export class PrometheusController {
  constructor(
    private prometheusService: PrometheusService,
    @Inject(REGISTRY) private register: Registry,
    @Optional()
    @Inject(HISTOGRAM_HTTP_RESPONSE_TIME)
    private httpHistogram: HistogramOptions
  ) {}
  @Get()
  async getMetric(@Res() res: Response, @Req() req: Request) {
    const httpRequestStarter = this.prometheusService.registerHistogram();
    const end = httpRequestStarter.startTimer();
    res.setHeader('Content-Type', this.register.contentType);
    res.send(await this.register.metrics());
    end({
      route: req.route.path,
      code: res.statusCode,
      method: req.method,
      requestid: req.headers['requestId'] as string,
    });
  }
}
