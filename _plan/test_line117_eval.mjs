import fs from 'fs';
import path from 'path';

const root = process.cwd();
const EXP2 = { 'technical-seo-audit':'2026-01-05','programmatic-seo-saas':'2026-01-12','local-seo-domination':'2026-01-19','link-velocity-strategy':'2026-01-26','schema-markup-guide':'2026-02-02','google-ads-quality-score':'2026-02-09','linkedin-abm-targeting':'2026-02-16','meta-ads-scaling':'2026-02-23','retargeting-omnipresence':'2026-03-02','pinterest-ads-strategy':'2026-03-09','authority-assets-strategy':'2026-03-16','zero-click-content':'2026-03-23','video-marketing-hybrid':'2026-03-30','podcast-networking-strategy':'2026-04-06','linkedin-thought-leadership':'2026-04-13','headless-cms-roi':'2026-04-20','core-web-vitals-revenue':'2026-04-27','design-systems-scale':'2026-05-04','pricing-page-psychology':'2026-05-11','accessibility-growth-lever':'2026-05-18','saas-churn-reduction':'2026-05-25','b2b-enterprise-abm':'2026-06-01','d2c-ecommerce-funnels':'2026-06-08','healthcare-patient-acquisition':'2026-06-15','professional-services-authority':'2026-06-22' };

const res = Object.entries(EXP2).filter(([s, d]) => {
  const fp = path.join(root, 'blog', s, 'index.html');
  if (!fs.existsSync(fp)) return true;
  const t = fs.readFileSync(fp, 'utf8');
  const re = new RegExp('"datePublished"\\s*:\\s*"' + d);
  const match = re.test(t);
  return !match;
}).map(([s]) => s);

console.log('Failing slugs in test script:', res);
