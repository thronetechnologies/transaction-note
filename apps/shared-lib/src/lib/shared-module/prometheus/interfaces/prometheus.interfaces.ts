import { Histogram } from 'prom-client';

export interface CommonOptions {
  name: string;
  help: string;
}
export interface HistogramOptions extends CommonOptions {
  labelNames: string[];
  buckets: number[];
}
export interface HistoMap {
  [key: string]: Histogram;
}
export interface HistogramEndFunction {
  [key: string]: (val: unknown) => void;
}
