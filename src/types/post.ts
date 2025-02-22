type Posts = {
    page: string;
    size: number;
    previous: number;
    next: number;
    posts: CardItemData[];
};

type Post = {
    _id?: string;
    author: Author;
    title: string;
    thumbnail: string;
    content: string;
    status: string;
    type: string;
    category: string;
    createdAt: string;
    typeAction?: 'none' | 'register' | 'unregister' | 'expired' | 'full' | 'already';
    event?: string;
    slug?: string;
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
    _id: string;
};

type CardItemData = {
    _id: number;
    title: string;
    createdAt: string;
    thumbnail?: string;
    type?: string;
};

type PostsParams = {
    page?: number;
    size?: number;
    type?: 'news' | 'activity';
    search?: string;
};
type Author = {
    _id: string;
    email: string;
    fullName: string;
};
