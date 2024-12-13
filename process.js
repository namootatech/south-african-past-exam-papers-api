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

const download = async (grade, year, month, paperName, url) => {
  const fs = require('fs');
  const path = `./files/${grade}/${year}/${month}`;
  const filePath = `${path}/${paperName}.pdf`;

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
  url
) => {
  // Directly await the download to ensure sequential execution
  await download(grade, year, month, paperName, url);
  return `./files/${grade}/${year}/${month}/${paperName}.pdf`;
};

// const newData = data.map(async (subject) => {
//   return await Promise.all(
//     subject.papers.map(async (paper) => {
// const number =
//   paper.name.includes('P1') || paper.name.includes('1')
//     ? 1
//     : paper.name.includes('P2') || paper.name.includes('2')
//     ? 2
//     : paper.name.includes('P3') || paper.name.includes('3')
//     ? 3
//     : 0;
// const type = paper.name.includes('Memo') ? 'memo' : 'paper';
// const language = paper.name.includes('Afrikaans')
//   ? 'Afrikaans'
//   : 'English';
// console.log(grade, year, month, paper.name, paper.url);
// const name =
//   kebabToSentenceCase(subject.id) +
//   ' - Paper ' +
//   number +
//   ' ' +
//   (type === 'memo' ? kebabToSentenceCase(type) : '') +
//   ' in ' +
//   language;
// const id =
//   subject.id + '-' + grade + '-' + number + '-' + month + '-' + year;
// const filePath = downloadAndSaveUrlAndReturnPath(
//   grade,
//   year,
//   month,
//   id,
//   paper.url
// );
//       return {
//         ...paper,
//         number,
//         subject: kebabToSentenceCase(subject.id),
//         name,
//         canonicalName: paper.name,
//         year,
//         month,
//         file: filePath,
//         type,
//         examType: month === 'november' ? 'Final' : 'Midterm',
//         language,
//         grade,
//         id,
//       };
//     })
//   );
// });

//writeoutNewDataToFile();

//console.log(newData);
// imagine if you could pair this with open data to get metrics on how many people passed this paper
// use that metric to determine paper difficulty
// if the data could have infor on which sections were passed more and which ones were passed less
// we could use that to suggest which sections for the student to focus on

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
const getPaperName = (subject, number, type, language) =>
  subject +
  ' - Paper ' +
  number +
  ' ' +
  (type === 'memo' ? kebabToSentenceCase(type) : '') +
  ' in ' +
  language;
// const buildPapers = async (grade, year, month, file) => {
//   const fs = require('fs');
//   const data = JSON.parse(fs.readFileSync(file, 'utf8'));

//   const newData = data.map(async (subjectArea) => {
//     const subject = subjectArea.Field1;
//     const papers = await pipe(
//       omit(['Field1']),
//       values,
//       partition((i) => !isEmpty(i)),
//       head,
//       splitEvery(2),
//       map(async ([canonicalName, url]) => {
//         const number = getPaperNumber(canonicalName);
//         const type = canonicalName.includes('Memo') ? 'memo' : 'paper';
//         const language = canonicalName.includes('Afrikaans')
//           ? 'Afrikaans'
//           : 'English';
//         console.log(grade, year, month, canonicalName, url);
//         const name = getPaperName(subject, number, type, language);
//         const id =
//           toKebab(subject) +
//           '-' +
//           grade +
//           '-' +
//           number +
//           '-' +
//           month +
//           '-' +
//           year;
//         const filePath = await downloadAndSaveUrlAndReturnPath(
//           grade,
//           year,
//           month,
//           id,
//           `${url}&forcedownload=true`
//         );
//         return {
//           canonicalName,
//           viewUrl: url,
//           downloadUrl: `${url}&forcedownload=true`,
//           name,
//           number,
//           subject: subject,
//           type,
//           language,
//           grade,
//           id,
//           file: filePath,
//         };
//       })
//     )(subjectArea);

//     return {
//       subject,
//       papers,
//     };
//   });
//   const paperdata = await Promise.all(newData);
//   const path = './2021-11.json';
//   fs.writeFileSync(path, JSON.stringify(paperdata, null, 2));
// };

// buildPapers(12, 2023, 'November', './scrapedData/2023-nov-grade-12.json');

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
      const name = getPaperName(subject, number, type, language);
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
      const filePath = await downloadAndSaveUrlAndReturnPath(
        grade,
        year,
        month,
        id,
        `${url}&forcedownload=true`
      );
      papers.push({
        canonicalName,
        viewUrl: url,
        downloadUrl: `${url}&forcedownload=true`,
        name,
        number,
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

buildPapers(12, 2023, 'November', './scrapedData/2023-nov-grade-12.json');
