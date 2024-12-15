import {
  toPairs,
  omit,
  values,
  zip,
  zipObj,
  keys,
  partition,
  isEmpty,
  pipe,
  splitEvery,
  head,
  map,
} from 'ramda';
import axios from 'axios';
import fs from 'fs';
const kebabToSentenceCase = (str) =>
  str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const toKB = (bytes) => (bytes / 1024).toFixed(2) + ' KB';
const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';

const randomChars = (length) =>
  Array.from({ length }, () =>
    String.fromCharCode(Math.floor(Math.random() * 26) + 97)
  ).join('');

const languages = [
  'Afrikaans',
  'Sepedi',
  'Sesoth',
  'Setswana',
  'Siswati',
  'Tshivenda',
  'IsiXhosa',
  'IsiZulu',
  'IsiNdebele',
  'English',
  'South African Sign Language',
  'Xitsonga',
];

const isLanguagePaper = (longDescrptivePaperName) =>
  longDescrptivePaperName.includes('FAL') ||
  longDescrptivePaperName.includes('HL') ||
  longDescrptivePaperName.includes('SAL');

const download = async (
  grade,
  year,
  month,
  paperName,
  url,
  paperNumber,
  canonicalName,
  type
) => {
  const path = `../files/${grade}/${year}/${month}`;
  const filePath = `${path}/${paperName}-${paperNumber}-${canonicalName}-${type}.pdf`;

  // Ensure the directory exists
  fs.mkdirSync(path, { recursive: true });

  // Check if the file already exists
  if (fs.existsSync(filePath)) {
    console.log(`File exists: ${filePath}. Skipping download.`);
    const fileSize = fs.statSync(filePath).size;
    const totalLength = fileSize;
    return [filePath, `${toMB(totalLength)}`];
  }

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const totalLength = response.headers['content-length'];

    const writer = fs.createWriteStream(filePath);
    let downloadedLength = 0;
    console.log(`\n\nDownloading ${filePath} (${totalLength} bytes)`);
    response.data.on('data', (chunk) => {
      downloadedLength += chunk.length;
      process.stdout.write(
        `Downloaded ${toKB(downloadedLength)} of ${toMB(totalLength)} bytes\r`
      );
    });

    // Return a promise that resolves when the file is fully written
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', () => {
        if (!error) {
          console.log(`\nDownload complete: ${filePath}`);
          return resolve([filePath, `${toMB(totalLength)}`]);
        }
      });
    });
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
  }
};

const downloadAndSaveUrlAndReturnPath = async (
  grade,
  year,
  month,
  paperName,
  url,
  paperNumber,
  canonicalName,
  type
) => {
  // Directly await the download to ensure sequential execution
  const resp = await download(
    grade,
    year,
    month,
    paperName,
    url,
    paperNumber,
    canonicalName,
    type
  );
  console.log('Response: ', resp);
  const [filePath, fileSize] = resp || [
    'error-downloading',
    'error-downloading',
  ];

  console.log('Path: ', filePath, 'Size: ', fileSize);
  return [filePath, fileSize];
};

const provinces = [
  'Eastern Cape',
  'Northern Cape',
  'Western Cape',
  'Mpumalanga',
  'North West',
  'Limpopo',
  'KwaZulu-Natal',
  'Free State',
  'Gauteng',
];

const toKebab = (str) =>
  str.replace(/([a-z])([A-Z])|[\s]+/g, '$1-$2').toLowerCase();
const getPaperNumber = (cn) =>
  cn.includes('P1') || cn.includes('1')
    ? 1
    : cn.includes('P2') || cn.includes('2')
    ? 2
    : cn.includes('P3') || cn.includes('3')
    ? 3
    : 0;
const getPaperName = (subject, number, type, language, hasAddendum) =>
  subject +
  (hasAddendum ? ' - Extra Paper ' : ' - Paper ') +
  number +
  ' ' +
  (type === 'memo' ? kebabToSentenceCase(type) : '') +
  ' in ' +
  language;

const containsProvinceWords = (text) =>
  provinces.some((province) =>
    text.toLowerCase().includes(province.toLowerCase())
  );

const getProvinceFromName = (text) => {
  const province = provinces.find((province) =>
    text.toLowerCase().includes(province.toLowerCase())
  );
  return province ? province : 'not-specified';
};

const buildPapers = async (grade, year, month, file) => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  const newData = [];
  let totalPapers = 0;

  // Calculate the total number of papers
  for (const subjectArea of data) {
    const paperEntries = pipe(
      omit(['Field1']),
      values,
      partition((i) => !isEmpty(i)),
      head,
      splitEvery(2)
    )(subjectArea);
    totalPapers += paperEntries.length;
  }

  let currentPaper = 0;

  for (const subjectArea of data) {
    const subject = subjectArea.Field1;
    const papers = [];

    const paperEntries = pipe(
      omit(['Field1']),
      values,
      partition((i) => !isEmpty(i)),
      head,
      splitEvery(2)
    )(subjectArea);

    for (const [canonicalName, url] of paperEntries) {
      currentPaper++;
      console.log(
        `\n\nDownloading paper ${currentPaper} of ${totalPapers} for subject ${subject} (${canonicalName})`
      );

      const number = getPaperNumber(canonicalName);

      const language = canonicalName.includes('Afrikaans')
        ? 'Afrikaans'
        : canonicalName.includes('English')
        ? 'English'
        : 'not-specified';
      const languageLevel = canonicalName.includes('HL')
        ? 'home-language'
        : canonicalName.includes('FAL')
        ? 'first-additional-language'
        : canonicalName.includes('SAL')
        ? 'seconda-additional-language'
        : 'not-applicable';
      const hasAddendum = canonicalName.includes('Addendum');
      const type =
        hasAddendum && canonicalName.includes('Memo')
          ? 'extra-paper-memo'
          : hasAddendum
          ? 'extra-paper'
          : canonicalName.includes('Memo')
          ? 'memo'
          : 'exam';
      const name = getPaperName(subject, number, type, language, hasAddendum);
      const id =
        toKebab(subject) +
        '-' +
        grade +
        '-' +
        number +
        '-' +
        month +
        '-' +
        year;
      const uniqueId =
        toKebab(subject) +
        '-' +
        grade +
        '-' +
        month +
        '-' +
        year +
        '-' +
        toKebab(canonicalName) +
        '-' +
        '-paper-' +
        number +
        '-' +
        language;
      const [filePath, fileSize] = await downloadAndSaveUrlAndReturnPath(
        grade,
        year,
        month,
        id,
        `${url}&forcedownload=true`,
        number,
        toKebab(canonicalName),
        type
      );
      papers.push({
        canonicalName,
        viewUrl: url,
        downloadUrl: `${url}&forcedownload=true`,
        name,
        number,
        province: containsProvinceWords(canonicalName)
          ? getProvinceFromName(canonicalName)
          : 'not-specified',
        subject: subject,
        isLanguageExam: isLanguagePaper(canonicalName),
        languageLevel,
        isExtraPaper: hasAddendum,
        type,
        language: isLanguagePaper(canonicalName) ? subject : language,
        year,
        grade,
        month,
        id: uniqueId,
        file: {
          path: filePath,
          size: fileSize,
        },
      });
    }

    newData.push({
      id: toKebab(subject),
      subject,
      count: papers.length,
      languagesPapersArewrittenIn:
        papers.length > 0 &&
        papers.reduce((acc, paper) => {
          if (paper.language !== 'not-specified') {
            acc[paper.language] = (acc[paper.language] || 0) + 1;
          }
          return acc;
        }, {}),
      papers,
    });
  }

  const path =
    '../generated/' + year + '-' + month + '-grade-' + grade + '.json';
  console.log('Writting to ' + path);
  fs.writeFileSync(path, JSON.stringify(newData, null, 2));
};

const run = async () => {
  await buildPapers(12, 2020, 'June', './2020-nov-grade-12.json');
  await buildPapers(12, 2021, 'June', './2021-june-grade-12.json');
  await buildPapers(12, 2022, 'June', './2022-june-grade-12.json');
  await buildPapers(12, 2023, 'June', './2023-june-grade-12.json');
  await buildPapers(12, 2021, 'November', './2021-nov-grade-12.json');
  await buildPapers(12, 2022, 'November', './2022-nov-grade-12.json');
  await buildPapers(12, 2023, 'November', './2023-nov-grade-12.json');
};

run();
