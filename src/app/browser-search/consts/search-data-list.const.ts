import { SearchDataItem } from "../types"

export const SEARCH_DATA_LIST: SearchDataItem[] = [
    {
        id: 'news-001',
        title: 'Зачем нужен bundler и что он делает',
        text: 'Разбираем сборку: модули, tree-shaking, минификация, dev-server и почему без bundler в реальных проектах тяжело.',
        link: 'https://example.com/frontend/bundlers'
    },
    {
        id: 'news-002',
        title: 'TypeScript в фронтенде: базовые причины использовать',
        text: 'Типы помогают ловить ошибки раньше, документируют API и улучшают автодополнение в IDE.',
        link: 'https://example.com/frontend/typescript-basics'
    },
    {
        id: 'news-003',
        title: 'Как работает DOM и почему он может тормозить',
        text: 'Что такое reflow/repaint, как влияют стили и размеры, и как писать UI без лишних перерисовок.',
        link: 'https://example.com/frontend/dom-performance'
    },
    {
        id: 'news-004',
        title: 'События в браузере: bubbling и capturing',
        text: 'Понимаем распространение событий и делегирование на списках и таблицах.',
        link: 'https://example.com/frontend/events-bubbling'
    },
    {
        id: 'news-005',
        title: 'HTTP для фронтенда: GET/POST, коды и кеширование',
        text: 'Короткий разбор запросов, ответов, статусов и того, как браузер кеширует ресурсы.',
        link: 'https://example.com/frontend/http-basics'
    }
];
