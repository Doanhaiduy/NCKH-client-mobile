type Posts = {
    page: string;
    size: number;
    previous: number;
    next: number;
    posts: CardItemData[];
};

type PostDetails = {
    author: Author;
    title: string;
    thumbnail: string;
    content: string;
    status: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    id: string;
};

type CardItemData = {
    id: number;
    title: string;
    createdAt: string;
    thumbnail?: string;
    type?: string;
};

type PostsParams = {
    page?: number;
    size?: number;
    category?: 'news' | 'activity';
};
type Author = {
    id: string;
    email: string;
    fullName: string;
};
