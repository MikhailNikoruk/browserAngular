export type GoogleBookItemDto = {
    id: string;
    selfLink: string;
    volumeInfo: {
        title: string;
        description: string;
    }
};
