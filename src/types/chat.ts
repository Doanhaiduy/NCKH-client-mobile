type Message = {
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp?: string;
    mode?: 'data' | 'conversation';
};
