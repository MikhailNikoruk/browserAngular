import { GoogleBookItemDto } from "./google-book-item.dto";

export type GoogleBooksResponseDto = {
    kind: string;
    totalItems: number;
    items: GoogleBookItemDto[];
};
