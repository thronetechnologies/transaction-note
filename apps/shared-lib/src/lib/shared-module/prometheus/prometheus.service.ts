/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable, Inject, Optional } from '@nestjs/common';
import {
  Registry,
  Histogram as PrometheusHistogram,
  Gauge as PrometheusGuage,
  Counter as PrometheusCounter,
  Pushgateway,
} from 'prom-client';
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
  HistogramEndFunction,
  HistogramOptions,
  CommonOptions,
  HistoMap,
} from './interfaces/prometheus.interfaces';

@Injectable()
export class PrometheusService {
  private histogramMap: HistoMap = {};
  private endFunc: HistogramEndFunction = {};
  private registeredHistogram: PrometheusHistogram;
  private endRegisteredHistogram: any;
  constructor(
    @Inject(REGISTRY) private register: Registry,
    @Optional()
    @Inject(HISTOGRAM)
    private histogram: (val: HistogramOptions) => PrometheusHistogram,
    @Optional()
    @Inject(GUAGE)
    private guage: (val: CommonOptions) => PrometheusGuage,
    @Optional()
    @Inject(COUNTER)
    private counter: (val: CommonOptions) => PrometheusCounter,
    @Inject(COLLECT_DEFAULT_METRIC)
    private collectDefaultMetric: (val: object) => void,
    @Inject(DEFAULT_METRICS) private defaultMetrics: object,
    @Optional()
    @Inject(HISTOGRAM_HTTP_RESPONSE_TIME)
    private httpResHistOpt: HistogramOptions,
    @Optional() @Inject(PUSHGATEWAY) private gateway: Pushgateway
  ) {
    this.registerDefaultMetrics();
  }

  registerDefaultMetrics() {
    this.collectDefaultMetric({
      ...this.defaultMetrics,
      register: this.register,
    });
  }

  startRisgeteredHistogramTimer(name?: string) {
    if (name) {
      this.endRegisteredHistogram = this.histogramMap[name].startTimer();
      this.endFunc[name] = this.endRegisteredHistogram;
    } else {
      this.endRegisteredHistogram = this.registeredHistogram.startTimer();
    }
  }

  endRegisteredHistogramTimer(name?: string) {
    if (name) {
      return this.endFunc[name];
    }
    return this.endRegisteredHistogram;
  }

  registerHistogram(histogramObj?: HistogramOptions) {
    if (this.histogram) {
      let options;
      let histo;
      if (histogramObj) {
        options = histogramObj;
      } else if (this.httpResHistOpt) {
        options = this.httpResHistOpt;
      } else throw new Error('Missing Histogram Object');
      if (this.histogramMap[options.name] === undefined) {
        histo = this.histogram(options);
        this.histogramMap[options.name] = histo;
        this.register.registerMetric(this.histogramMap[options.name]);
      }
      this.registeredHistogram = this.histogramMap[options.name];
      return this.histogramMap[options.name];
    }
    throw new Error('Missing Histogram Initializer');
  }

  registerGuage(guageObj: CommonOptions) {
    if (typeof this.guage === 'function') {
      const gua = this.guage(guageObj);
      this.register.registerMetric(gua);
      return gua;
    }
  }

  registerCounter(counterObj: CommonOptions) {
    if (this.counter) {
      const count = this.counter(counterObj);
      this.register.registerMetric(count);
      return count;
    }
  }

  async pushgatewayAdd(jobName: string) {
    if (this.gateway) {
      this.gateway
        .pushAdd({ jobName })
        .then(({ resp, body }) => {
          console.log(resp, 'line 94');
          console.log(body, 'line 95');
        })
        .catch((err) => {
          console.log(err, 'line 98');
        });
    }
    throw new Error('Missing gateway initializer');
  }
}
