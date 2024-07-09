const fs = require('fs');
const postcss = require('postcss');
const purgecss = require('@fullhuman/postcss-purgecss');

const cssFilePath = './themes/hugo-product-theme/assets/css/main.css'; // Path CSS file

// Read the CSS file
fs.readFile(cssFilePath, (err, css) => {
  if (err) throw err;

  // Define PurgeCSS options
  const purgecssOptions = {
    content: ['./hugo_stats.json'], // Paths HTML files or other content files
    defaultExtractor: content => {
      const els = JSON.parse(content).htmlElements;
      return [
        ...(els.tags || []),
        ...(els.classes || []),
        ...(els.ids || []),
      ];
    },
    safelist: {
      standard: [
        'active',
        'is-visible',
        'is-right-0',
        'fserv-field',
        'select2-container',
        'select2',
        'fs-webform-container',
        'placeholder',
        'fserv-button-submit',
        'single-result-item',
        'single-result-item h2',
        'search-content',
        'is-show',
      ],
      deep: [
        /^fserv-/, 
        /^fs-/,
        /^select2-/,
        /^formserv/,
        /^ss-/,
        /^owl-/,
        /^item/,
        /^headroom/,
      ],
      greedy: [
        // /^header-/,
      ],
      keyframes: true,
    }
  };

  // Process CSS with PostCSS and PurgeCSS
  postcss([purgecss(purgecssOptions)])
    .process(css, { from: cssFilePath })
    .then(result => {
      // Processed CSS back to the file
      fs.writeFile(cssFilePath, result.css, err => {
        if (err) throw err;
        console.error('CSS processed successfully!');
      });
    })
    .catch(error => {
      console.error(error);
    });
});
