import { SearchCategory } from './search-category.type';

export type SearchDataItem = {
  id: string;
  title: string;
  text: string;
  link: string;
  category: SearchCategory;
};
