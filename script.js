document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('accordion-container');

    // --- i18n Translations ---
    const translations = {
        en: {
            mainTitle: 'An Overview of Recent Insights in Health Science',
            footerText: 'Generated with the help of AI.',
            noData: 'No data found.',
            loadError: 'An error occurred while loading the content.',
            searchPlaceholder: 'Search',
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
            noData: 'Geen data gevonden.',
            loadError: 'Er is een fout opgetreden bij het laden van de content.',
            searchPlaceholder: 'Zoek',
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
        // 1. Check localStorage for saved preference
        const saved = localStorage.getItem('lfh-lang');
        if (saved && translations[saved]) return saved;

        // 2. Check browser language
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        if (browserLang.startsWith('nl')) return 'nl';

        // 3. Default fallback
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
        document.title = translations[lang].mainTitle;

        // Reload accordion data
        loadAccordionData();
    }

    function t(key, replacements = {}) {
        let text = translations[currentLang][key] || translations['en'][key] || key;
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(`{${placeholder}}`, value);
        }
        return text;
    }

    // --- Accordion Logic ---
    let manifest = [];
    let manifestFetched = false;

    const fetchManifest = async () => {
        if (manifestFetched) return manifest;
        try {
            const response = await fetch(`content-manifest.${currentLang}.json`);
            if (!response.ok) throw new Error('Manifest fetch failed');
            manifest = await response.json();
            manifestFetched = true;
            return manifest;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    async function loadAccordionData() {
        container.innerHTML = '';
        manifest = [];
        manifestFetched = false;

        try {
            const response = await fetch(`data.${currentLang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.length > 0) {
                buildAccordion(data, container);

                // Open the first (root) node by simulating a click
                const firstButton = container.querySelector('.accordion-button');
                if (firstButton) {
                    firstButton.click();
                }
            } else {
                container.innerHTML = `<p>${t('noData')}</p>`;
            }
        } catch (error) {
            container.innerHTML = `<p>${t('loadError')}</p>`;
            console.error('Error loading data.json:', error);
        }
    }

    function buildAccordion(items, parentElement, currentPath = []) {
        if (!items || items.length === 0) {
            return;
        }
        items.forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            const button = document.createElement('button');
            button.className = 'accordion-button';

            const newPath = [...currentPath, item.title];
            const pathString = newPath.join(' > ');
            const urlEncodedPath = encodeURIComponent(pathString);

            const link = document.createElement('a');
            link.textContent = item.title;
            link.href = `topic.html?path=${urlEncodedPath}&lang=${currentLang}`;
            link.dataset.path = pathString;

            button.appendChild(link);

            const searchButton = document.createElement('span');
            searchButton.className = 'search-button';
            searchButton.textContent = '>';
            button.appendChild(searchButton);

            const panel = document.createElement('div');
            panel.className = 'accordion-panel';
            accordionItem.appendChild(button);
            accordionItem.appendChild(panel);
            parentElement.appendChild(accordionItem);

            if (item.children && item.children.length > 0) {
                buildAccordion(item.children, panel, newPath);
            } else {
                button.classList.add('no-children');
            }
        });
    }

    function attachEventListeners() {
        async function handleSearchOrNavigate(link) {
            const path = link.dataset.path;
            const manifest = await fetchManifest();

            if (manifest.includes(path)) {
                window.location.href = link.href;
            } else {
                const keywords = path.replace(/ > /g, ', ');
                const searchQuery = encodeURIComponent(keywords);
                const searchUrl = `https://duckduckgo.com/?q=${searchQuery}`;
                window.open(searchUrl, '_blank');
            }
        }

        container.addEventListener('click', async function(event) {
            event.preventDefault();
            const searchButton = event.target.closest('.search-button');
            const button = event.target.closest('.accordion-button');

            if (searchButton) {
                event.stopPropagation();
                const link = button.querySelector('a');
                if (link) {
                    handleSearchOrNavigate(link);
                }
            } else if (button) {
                if (button.classList.contains('no-children')) {
                    const link = button.querySelector('a');
                    if (link) {
                        handleSearchOrNavigate(link);
                    }
                } else {
                    event.preventDefault();
                    button.classList.toggle('active');
                    const panel = button.nextElementSibling;
                    panel.classList.toggle('is-open');
                }
            }
        });
    }

    // --- Language Switcher ---
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-nl').addEventListener('click', () => setLanguage('nl'));

    // --- Event Listeners (register once, not per language switch) ---
    attachEventListeners();

    // --- Dynamic Style ---
    const style = document.createElement('style');
    style.textContent = `
        .accordion-button a {
            text-decoration: none;
            color: inherit;
            display: block;
            flex-grow: 1;
        }
        .accordion-button.no-children::after {
            content: "";
        }
    `;
    document.head.appendChild(style);

    // --- Initialize ---
    currentLang = detectLanguage();
    setLanguage(currentLang);
});
