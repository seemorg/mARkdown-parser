import { Page } from './Page';

export type Chapter = Partial<Page> & {
  title: string;
  level: number;
};
