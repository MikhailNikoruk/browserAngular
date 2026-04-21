import { SearchCategory, SearchDataItem } from '../types';

const SEARCH_ITEM_CATEGORIES: Record<string, SearchCategory> = {
  'news-001': 'architecture',
  'news-002': 'javascript',
  'news-003': 'performance',
  'news-004': 'browser',
  'news-005': 'browser',
  'news-006': 'browser',
  'news-007': 'javascript',
  'news-008': 'css',
  'news-009': 'css',
  'news-010': 'css',
  'news-011': 'frontend',
  'news-012': 'frontend',
  'news-013': 'architecture',
  'news-014': 'javascript',
  'news-015': 'frontend',
  'news-016': 'architecture',
  'news-017': 'browser',
  'news-018': 'performance',
  'news-019': 'testing',
  'news-020': 'css',
  'news-021': 'browser',
  'news-022': 'performance',
  'news-023': 'browser',
  'news-024': 'architecture',
  'news-025': 'frontend',
  'news-026': 'testing',
  'news-027': 'architecture',
  'news-028': 'performance',
  'news-029': 'browser',
  'news-030': 'architecture',
};

const RAW_SEARCH_DATA_LIST: Omit<SearchDataItem, 'category'>[] = [
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
    },
    {
        id: 'news-006',
        title: 'Что такое CORS и почему запрос “не проходит”',
        text: 'Политика безопасности браузера, preflight и типичные решения на фронте и бэке.',
        link: 'https://example.com/frontend/cors-explained'
    },
    {
        id: 'news-007',
        title: 'Модули в JavaScript: import/export на практике',
        text: 'ESM, named/default exports и как структурировать код по папкам и слоям.',
        link: 'https://example.com/frontend/js-modules'
    },
    {
        id: 'news-008',
        title: 'CSS-специфичность без боли',
        text: 'Почему “не применился стиль”, как работает каскад и как избегать !important.',
        link: 'https://example.com/frontend/css-specificity'
    },
    {
        id: 'news-009',
        title: 'Flexbox vs Grid: когда что выбирать',
        text: 'Flex для одномерных раскладок, Grid для сеток. Пара типовых макетов из жизни.',
        link: 'https://example.com/frontend/flex-grid'
    },
    {
        id: 'news-010',
        title: 'Адаптивная верстка: mobile-first и breakpoints',
        text: 'Как проектировать интерфейс под разные экраны и не делать “кашу” из медиазапросов.',
        link: 'https://example.com/frontend/responsive-design'
    },
    {
        id: 'news-011',
        title: 'Доступность (a11y): минимальный чеклист для UI',
        text: 'Фокус, клавиатура, роли, контраст и почему это важно даже в учебных проектах.',
        link: 'https://example.com/frontend/a11y-checklist'
    },
    {
        id: 'news-012',
        title: 'Формы в вебе: валидация и UX',
        text: 'Ошибки рядом с полями, подсказки, disabled кнопки и полезные HTML-атрибуты.',
        link: 'https://example.com/frontend/forms-ux'
    },
    {
        id: 'news-013',
        title: 'State management: когда достаточно “просто в компоненте”',
        text: 'Как понять момент, когда пора выносить состояние в сервис/стор.',
        link: 'https://example.com/frontend/state-basics'
    },
    {
        id: 'news-014',
        title: 'RxJS на пальцах: поток событий вместо колбэков',
        text: 'Observable как источник данных, операторы и типовые сценарии UI: debounce, switchMap.',
        link: 'https://example.com/frontend/rxjs-intro'
    },
    {
        id: 'news-015',
        title: 'Signals: реактивность без лишнего шума',
        text: 'Зачем signals, как они помогают UI и чем отличаются от Observable в повседневных задачах.',
        link: 'https://example.com/frontend/signals-intro'
    },
    {
        id: 'news-016',
        title: 'Чистые компоненты: входы/выходы и однонаправленный поток данных',
        text: 'Как разделить “умный” контейнер и “тупые” компоненты через Input/Output.',
        link: 'https://example.com/frontend/unidirectional-dataflow'
    },
    {
        id: 'news-017',
        title: 'Роутинг в SPA: страницы без перезагрузки',
        text: 'Что такое client-side routing, параметры маршрутов и понятие “страница как компонент”.',
        link: 'https://example.com/frontend/spa-routing'
    },
    {
        id: 'news-018',
        title: 'Lazy loading: ускоряем старт приложения',
        text: 'Почему бандл не должен быть огромным и как лениво подгружать фичи.',
        link: 'https://example.com/frontend/lazy-loading'
    },
    {
        id: 'news-019',
        title: 'Ошибка в проде: как дебажить без паники',
        text: 'Source maps, devtools, network tab и стратегия “сначала воспроизвести”.',
        link: 'https://example.com/frontend/debugging'
    },
    {
        id: 'news-020',
        title: 'Компонентные стили: изоляция и масштабирование',
        text: 'Почему лучше меньше глобальных стилей и как жить с компонентными scss.',
        link: 'https://example.com/frontend/component-styles'
    },
    {
        id: 'news-021',
        title: 'Работа с датами: timezone, форматирование, сравнения',
        text: 'Типовые ошибки с часовыми поясами и почему ISO строка не всегда спасает.',
        link: 'https://example.com/frontend/dates-timezones'
    },
    {
        id: 'news-022',
        title: 'Кеширование на фронте: storage, memory, http cache',
        text: 'Когда использовать localStorage, когда sessionStorage, и где лучше вообще не кешировать.',
        link: 'https://example.com/frontend/caching'
    },
    {
        id: 'news-023',
        title: 'Безопасность фронтенда: XSS простыми словами',
        text: 'Откуда берётся XSS, почему опасен innerHTML и базовые правила защиты.',
        link: 'https://example.com/frontend/xss-basics'
    },
    {
        id: 'news-024',
        title: 'Архитектура папок: feature-first против layer-first',
        text: 'Как раскладывать код, чтобы проект пережил рост и смену людей.',
        link: 'https://example.com/frontend/folder-architecture'
    },
    {
        id: 'news-025',
        title: 'UI-состояния: loading/empty/error как обязательный стандарт',
        text: 'Почему нельзя показывать только “успех” и как сделать поведение интерфейса предсказуемым.',
        link: 'https://example.com/frontend/ui-states'
    },
    {
        id: 'news-026',
        title: 'Тестирование фронтенда: что проверять в первую очередь',
        text: 'Юнит для логики, компонентные тесты для сценариев, e2e для критических путей.',
        link: 'https://example.com/frontend/testing-overview'
    },
    {
        id: 'news-027',
        title: 'Линтинг и форматирование: зачем это команде',
        text: 'ESLint/Prettier как единый стиль, меньше споров и меньше случайных багов.',
        link: 'https://example.com/frontend/linting-formatting'
    },
    {
        id: 'news-028',
        title: 'Оптимизация изображений: размер, форматы, lazy loading',
        text: 'Как улучшить скорость загрузки: responsive images, WebP/AVIF, правильные размеры.',
        link: 'https://example.com/frontend/images-optimization'
    },
    {
        id: 'news-029',
        title: 'Web Components: где они реально полезны',
        text: 'Инкапсуляция, кастомные элементы и сценарии интеграции в разные фреймворки.',
        link: 'https://example.com/frontend/web-components'
    },
    {
        id: 'news-030',
        title: 'Дизайн-система на минималках: кнопки, поля, токены',
        text: 'Как начать с маленького UI-kit и не утонуть: базовые компоненты и правила использования.',
        link: 'https://example.com/frontend/design-system-basics'
    }
];

export const SEARCH_DATA_LIST: SearchDataItem[] = RAW_SEARCH_DATA_LIST.map((item) => ({
  ...item,
  category: SEARCH_ITEM_CATEGORIES[item.id] ?? 'frontend',
}));
