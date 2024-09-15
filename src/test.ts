import { parseMarkdown } from './parser';
import fs from 'fs';

const url =
  'https://raw.githubusercontent.com/OpenITI/RELEASE/master/data/0256Bukhari/0256Bukhari.Sahih/0256Bukhari.Sahih.JK000110-ara1.completed';

const main = async () => {
  const response = await fetch(url);
  const text = await response.text();

  const result = parseMarkdown(text);
  fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
};

main();
