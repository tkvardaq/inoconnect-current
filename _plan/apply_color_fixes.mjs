import fs from 'fs';

const STANDARD_ROOT = ':root { --primary: #4169E1; --primary-dark: #3152B3; --accent: #FF7518; --heading: #1e293b; --secondary: #44D7A8; }';

function transformFile(filePath, config) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Standardize :root in <head>
  content = content.replace(/:root\s*\{[^}]+\}/, STANDARD_ROOT);
  
  // 2. Body selection class
  if (config.fromToken && config.toToken) {
    content = content.replace(
      new RegExp(`(<body[^>]*class="[^"]*)selection:bg-${config.fromToken}([^"]*")`, 'i'),
      `$1selection:bg-${config.toToken}$2`
    );
  }
  
  // 3. Extract <main>...</main>
  const mainStartTag = content.indexOf('<main');
  const mainEndTag = content.indexOf('</main>');
  if (mainStartTag === -1 || mainEndTag === -1) {
    console.error(`ERROR: <main> not found in ${filePath}`);
    return;
  }
  
  let headAndNav = content.slice(0, mainStartTag);
  let mainContent = content.slice(mainStartTag, mainEndTag + 7);
  let footerAndScripts = content.slice(mainEndTag + 7);
  
  // Special gradients replacements
  if (config.specialReplacements) {
    for (const [target, replacement] of config.specialReplacements) {
      mainContent = mainContent.split(target).join(replacement);
    }
  }
  
  // Token replacements in mainContent
  if (config.fromToken && config.toToken) {
    const fromT = config.fromToken;
    const toT = config.toToken;
    
    // Replace class prefixes: bg-, text-, border-, shadow-, from-, to-, via-
    // hover:border-, group-hover:border-, group-hover:text-, group-hover:bg-
    const classPrefixes = [
      'bg-', 'text-', 'border-', 'shadow-', 'from-', 'to-', 'via-',
      'hover:border-', 'hover:bg-', 'hover:text-',
      'group-hover:border-', 'group-hover:text-', 'group-hover:bg-',
      'focus:ring-', 'ring-'
    ];
    
    for (const prefix of classPrefixes) {
      // e.g. bg-secondary -> bg-primary, bg-secondary/10 -> bg-primary/10
      // Use regex that matches prefix + fromT followed by end of class or slash or dash
      const regex = new RegExp(`(${prefix.replace(':', '\\:')})${fromT}(?=[\\s"'/])`, 'g');
      mainContent = mainContent.replace(regex, `$1${toT}`);
    }
  }
  
  // Hex replacements in mainContent
  if (config.fromHex && config.toHex) {
    mainContent = mainContent.split(config.fromHex).join(config.toHex);
  }
  
  const updated = headAndNav + mainContent + footerAndScripts;
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Successfully updated ${filePath}`);
}

// 1. services/seo/index.html
transformFile('services/seo/index.html', {
  fromToken: 'secondary',
  toToken: 'primary',
  fromHex: '#44D7A8',
  toHex: '#4169E1',
  specialReplacements: [
    ['from-secondary to-primary', 'from-primary to-accent'],
    ['to-[#44D7A8]/10/30', 'to-blue-50/30']
  ]
});

// 2. services/ppc/index.html
transformFile('services/ppc/index.html', {
  fromToken: 'primary',
  toToken: 'accent',
  fromHex: '#4169E1',
  toHex: '#FF7518',
  specialReplacements: [
    ['to-blue-50/30', 'to-orange-50/30']
  ]
});

// 3. services/content-marketing/index.html
transformFile('services/content-marketing/index.html', {
  fromToken: 'accent',
  toToken: 'primary',
  fromHex: '#FF7518',
  toHex: '#4169E1',
  specialReplacements: [
    ['to-orange-50/30', 'to-blue-50/30'],
    ['to-orange-500', 'to-blue-500']
  ]
});

// 4. services/web-development/index.html
transformFile('services/web-development/index.html', {
  fromToken: 'primary',
  toToken: 'accent',
  fromHex: '#4169E1',
  toHex: '#FF7518',
  specialReplacements: [
    ['to-blue-50/30', 'to-orange-50/30']
  ]
});

// 5. services/digital-strategy/index.html
transformFile('services/digital-strategy/index.html', {
  fromToken: 'accent',
  toToken: 'secondary',
  fromHex: '#FF7518',
  toHex: '#44D7A8',
  specialReplacements: [
    ['to-orange-50/30', 'to-[#44D7A8]/10/30']
  ]
});

// 6. industries/b2b/index.html
transformFile('industries/b2b/index.html', {
  fromToken: 'secondary',
  toToken: 'accent',
  fromHex: '#44D7A8',
  toHex: '#FF7518',
  specialReplacements: [
    ['to-[#44D7A8]/10/30', 'to-orange-50/30']
  ]
});

// 7. industries/healthcare/index.html
transformFile('industries/healthcare/index.html', {
  fromToken: 'primary',
  toToken: 'secondary',
  fromHex: '#4169E1',
  toHex: '#44D7A8',
  specialReplacements: [
    ['to-blue-50/30', 'to-[#44D7A8]/10/30']
  ]
});

// 8. industries/startups/index.html
transformFile('industries/startups/index.html', {
  fromToken: 'accent',
  toToken: 'secondary',
  fromHex: '#FF7518',
  toHex: '#44D7A8',
  specialReplacements: [
    ['to-orange-50/30', 'to-[#44D7A8]/10/30']
  ]
});

// 9. industries/professional-services/index.html
transformFile('industries/professional-services/index.html', {
  fromToken: 'secondary',
  toToken: 'primary',
  fromHex: '#44D7A8',
  toHex: '#4169E1',
  specialReplacements: [
    ['from-secondary to-primary', 'from-primary to-accent'],
    ['to-[#44D7A8]/10/30', 'to-blue-50/30']
  ]
});
