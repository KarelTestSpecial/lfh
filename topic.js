document.addEventListener('DOMContentLoaded', () => {
    // --- i18n Translations ---
    const translations = {
        en: {
            mainTitle: 'An Overview of Recent Insights in Health Science',
            footerText: 'Generated with the help of AI.',
            backToOverview: '← Back to overview',
            pathLabel: 'Path:',
            topicNotFound: 'Error: Topic not found',
            topicNotFoundMsg: 'No topic path was provided in the URL.',
            topicPlaceholder: 'The content for this specific topic will be added soon.',
            topicFuture: 'In a future version, AI-generated information about <strong>{title}</strong> will appear here.',
            langEn: 'English',
            langNl: 'Nederlands'
        },
        nl: {
            mainTitle: 'Een overzicht van recente inzichten in de gezondheidsleer',
            footerText: 'Gegenereerd met behulp van AI.',
            backToOverview: '← Terug naar overzicht',
            pathLabel: 'Pad:',
            topicNotFound: 'Fout: Onderwerp niet gevonden',
            topicNotFoundMsg: 'Er is geen onderwerp-pad meegestuurd in de URL.',
            topicPlaceholder: 'De content voor dit specifieke onderwerp wordt binnenkort toegevoegd.',
            topicFuture: 'In een toekomstige versie zal hier door AI-gegenereerde informatie verschijnen over <strong>{title}</strong>.',
            langEn: 'English',
            langNl: 'Nederlands'
        }
    };

    // --- Language Management ---
    let currentLang = 'en';

    function detectLanguage() {
        const saved = localStorage.getItem('lfh-lang');
        if (saved && translations[saved]) return saved;

        const browserLang = navigator.language || navigator.userLanguage || 'en';
        if (browserLang.startsWith('nl')) return 'nl';

        return 'en';
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem('lfh-lang', lang);
        document.documentElement.lang = lang;

        // Update lang switcher buttons
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        document.getElementById('lang-nl').classList.toggle('active', lang === 'nl');

        // Update all translated elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update page title
        const params = new URLSearchParams(window.location.search);
        const pathString = params.get('path');
        if (pathString) {
            const decodedPath = decodeURIComponent(pathString);
            const pathSegments = decodedPath.split(' > ');
            document.title = pathSegments[pathSegments.length - 1];
        }

        // Update topic content
        updateTopicContent();
    }

    function t(key, replacements = {}) {
        let text = translations[currentLang][key] || translations['en'][key] || key;
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(`{${placeholder}}`, value);
        }
        return text;
    }

    // --- Topic Content ---
    function updateTopicContent() {
        const params = new URLSearchParams(window.location.search);
        const pathString = params.get('path');
        const breadcrumbContainer = document.getElementById('breadcrumb-container');
        const topicTitleElement = document.getElementById('topic-title');
        const topicContentElement = document.getElementById('topic-content');

        if (pathString) {
            const decodedPath = decodeURIComponent(pathString);
            const pathSegments = decodedPath.split(' > ');
            const topicTitle = pathSegments[pathSegments.length - 1];

            document.title = topicTitle;
            topicTitleElement.textContent = topicTitle;
            breadcrumbContainer.textContent = `${t('pathLabel')} ${decodedPath}`;
            topicContentElement.innerHTML = `
                <p>${t('topicPlaceholder')}</p>
                <p>${t('topicFuture', { title: topicTitle })}</p>
            `;
        } else {
            document.title = t('topicNotFound');
            topicTitleElement.textContent = t('topicNotFound');
            topicContentElement.textContent = t('topicNotFoundMsg');
        }
    }

    // --- Language Switcher ---
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-nl').addEventListener('click', () => setLanguage('nl'));

    // --- Initialize ---
    currentLang = detectLanguage();
    setLanguage(currentLang);
});
