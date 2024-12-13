const {
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
} = require('ramda');
const axios = require('axios');

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

const download = async (
  grade,
  year,
  month,
  paperName,
  url,
  paperNumber,
  canonicalName
) => {
  const fs = require('fs');
  const path = `./files/${grade}/${year}/${month}`;
  const filePath = `${path}/${paperName}-${paperNumber}-${canonicalName}.pdf`;

  // Ensure the directory exists
  fs.mkdirSync(path, { recursive: true });

  // Check if the file already exists
  if (fs.existsSync(filePath)) {
    console.log(`File exists: ${filePath}. Skipping download.`);
    return filePath;
  }

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const totalLength = response.headers['content-length'];
    console.log(`\n\nDownloading ${filePath} (${totalLength} bytes)`);

    const writer = fs.createWriteStream(filePath);
    let downloadedLength = 0;

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
          resolve(filePath);
        }
      });
    });
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    throw error;
  }
};

const downloadAndSaveUrlAndReturnPath = async (
  grade,
  year,
  month,
  paperName,
  url,
  paperNumber,
  canonicalName
) => {
  // Directly await the download to ensure sequential execution
  await download(
    grade,
    year,
    month,
    paperName,
    url,
    paperNumber,
    canonicalName
  );
  return `./files/${grade}/${year}/${month}/${paperName}-${paperNumber}-${canonicalName}.pdf`;
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
  const fs = require('fs');
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
        `\n\nDownloading paper ${currentPaper} of ${totalPapers} for subject ${subject}`
      );

      const number = getPaperNumber(canonicalName);
      const type = canonicalName.includes('Memo') ? 'memo' : 'paper';
      const language = canonicalName.includes('Afrikaans')
        ? 'Afrikaans'
        : 'English';
      const hasAddendum = canonicalName.includes('Addendum');
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
      '-' + '-paper-' + number + '-' + language;
      const filePath = await downloadAndSaveUrlAndReturnPath(
        grade,
        year,
        month,
        id,
        `${url}&forcedownload=true`,
        number,
        toKebab(canonicalName)
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
        type,
        language,
        grade,
        id,
        file: filePath,
      });
    }

    newData.push({
      subject,
      papers,
    });
  }

  const path =
    './generated/' + year + '-' + month + '-grade-' + grade + '.json';
  fs.writeFileSync(path, JSON.stringify(newData, null, 2));
};

buildPapers(12, 2022, 'June', './scrapedData/2022-june-grade-12.json');
