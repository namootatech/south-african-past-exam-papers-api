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
