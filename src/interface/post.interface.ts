export interface PostInterface {
    id: number;
    title: string;
    content?: string | null;
    published?: boolean;
    authorId?: number | null;
  }
  