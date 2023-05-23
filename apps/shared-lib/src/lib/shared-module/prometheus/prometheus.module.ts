/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import {
  Registry,
  Histogram,
  Gauge,
  Counter,
  collectDefaultMetrics,
  Pushgateway,
} from 'prom-client';

import { PrometheusService } from './prometheus.service';
import {
  REGISTRY,
  HISTOGRAM,
  GUAGE,
  DEFAULT_METRICS,
  COLLECT_DEFAULT_METRIC,
  COUNTER,
  HISTOGRAM_HTTP_RESPONSE_TIME,
  PUSHGATEWAY,
} from '@shared-lib/lib/constants';
import {
  HistogramOptions,
  CommonOptions,
} from './interfaces/prometheus.interfaces';
import { PrometheusController } from './prometheus.controller';

@Module({})
export class PrometheusModule {
  static register({
    defaultMetric,
    histogramObj,
    url,
  }: {
    defaultMetric: object;
    histogramObj?: HistogramOptions;
    url?: string;
  }) {
    return {
      controllers: [PrometheusController],
      module: PrometheusModule,
      providers: [
        PrometheusService,
        {
          provide: REGISTRY,
          useFactory: () => {
            const register = new Registry();
            return register;
          },
        },
        { provide: COLLECT_DEFAULT_METRIC, useValue: collectDefaultMetrics },
        {
          provide: GUAGE,
          useFactory: () => (options: CommonOptions) => new Gauge(options),
        },
        { provide: DEFAULT_METRICS, useValue: defaultMetric },
        {
          provide: HISTOGRAM,
          useFactory: () => (options: HistogramOptions) =>
            new Histogram(options),
        },
        {
          provide: COUNTER,
          useFactory: () => (options: CommonOptions) => new Counter(options),
        },
        {
          provide: HISTOGRAM_HTTP_RESPONSE_TIME,
          useValue: histogramObj,
        },
        {
          provide: PUSHGATEWAY,
          useFactory: () => {
            const gateway = new Pushgateway(url);
            return gateway;
          },
        },
      ],
      exports: [PrometheusService],
    };
  }
}
