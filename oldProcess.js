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
