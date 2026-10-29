import { designers } from './mock/designers';
import { looks } from './mock/looks';
import { products } from './mock/products';
import { trends } from './mock/trends';
import type { Category, Designer, Look, Product, Trend } from './types';

// The app only talks to this interface; swapping mocks for the CMS/API happens here.
export const content = {
  getTrends: async (): Promise<Trend[]> => trends,
  getTrend: async (id: string): Promise<Trend | undefined> => trends.find((t) => t.id === id),
  getDesigners: async (): Promise<Designer[]> => designers,
  getDesigner: async (id: string): Promise<Designer | undefined> => designers.find((d) => d.id === id),
  getProducts: async (filter?: { category?: Category; designerId?: string; ids?: string[] }): Promise<Product[]> =>
    products.filter((p) =>
      (!filter?.category || p.category === filter.category) &&
      (!filter?.designerId || p.designerId === filter.designerId) &&
      (!filter?.ids || filter.ids.includes(p.id))),
  getProduct: async (id: string): Promise<Product | undefined> => products.find((p) => p.id === id),
  getLooks: async (): Promise<Look[]> => looks,
  getLook: async (id: string): Promise<Look | undefined> => looks.find((l) => l.id === id),
};
