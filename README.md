# Health and Longevity Knowledge Base

**Live Application URL:** https://kareltestspecial.github.io/lfh/index.html

A comprehensive, hierarchical overview of topics related to health and longevity, available in **English** and **Nederlands**. The information is displayed in an interactive, collapsible accordion format.

## Features

- **Language Selection**: Choose between English (EN) and Nederlands (NL)
  - Automatic browser language detection
  - Manual override via language switcher
  - Preference saved in localStorage
- **Interactive Accordion**: Expand/collapse topics hierarchically
- **Search Integration**: Click topics to search via DuckDuckGo or view dedicated pages

## Usage

Open `index.html` in a web browser or visit the live URL above.

- **Language Switch**: Click `EN` or `NL` in the header
- **Expand/Collapse**: Click on a topic's bar to expand or collapse sub-topics
- **View/Search Topics**:
  - Click the `>` button to search or navigate
  - Topics with dedicated content pages navigate directly
  - Other topics open a DuckDuckGo search in a new tab

## Project Structure

```
lfh/
├── index.html              # Main page with language switcher
├── script.js               # i18n logic + accordion functionality
├── style.css               # Unified styling (green theme)
├── data.en.json            # English content data
├── data.nl.json            # Dutch content data
├── content-manifest.en.json # English content pages manifest
├── content-manifest.nl.json # Dutch content pages manifest
├── topic.html              # Topic detail page template
├── topic.js                # Topic page logic with i18n
├── LFHoutline.txt          # English source outline
├── LFHoutline_nl.txt       # Dutch source outline
├── parse_outline.py        # Generates data JSON files from outlines
└── README.md               # This file
```

## Updating the Content

Content is sourced from the outline text files. To update:

1. **Edit the outline**: Modify `LFHoutline.txt` (English) or `LFHoutline_nl.txt` (Dutch)
   - Hierarchy is defined by indentation (8 spaces per level)
2. **Regenerate data files**:

```bash
python parse_outline.py
```

This generates both `data.en.json` and `data.nl.json`.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Data Processing**: Python
- **Hosting**: GitHub Pages

## Language Implementation

- Browser language detection via `navigator.language`
- User preference stored in `localStorage('lfh-lang')`
- Dynamic data loading based on selected language
- Translations embedded in JavaScript for UI elements

## Note on AI Generation

The content outline and the code for this project were generated with the assistance of AI.
