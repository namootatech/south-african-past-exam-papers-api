const express = require('express');
const {
  getSubjectConfig,
  getPaperConfig,
  getPaperFile,
  getPaperFileConfig,
  getPaperId,
  getAllPaperIds,
  getPaperById,
  getPaperFileConfigById,
  getTotalFileSizeInMB,
  getTotalFileSizeInGB,
  getPaperInLanguage,
  getAllPapersForSubject,
  getAllPapers,
  getAllPapersForYear,
  getAllPapersForMonth,
  getAllLanguageExamPapers,
  getAllPapersInLanguage,
  getAllPapersInLanguageForYear,
  getAllExtraPapers,
  getAllExtraPapersForYear,
} = require('./config');

const app = express();
const port = 3000;

app.use(express.json());

/**
 * @route GET /subject-config/:grade/:year/:month/:subjectId
 * @description Get the configuration for a specific subject
 * @param {number} grade - The grade level
 * @param {number} year - The year of the exam
 * @param {string} month - The full month of the exam
 * @param {string} subjectId - The ID of the subject, the name of the subject in kebab case e.g mathematical-literacy
 */
app.get('/subject-config/:grade/:year/:month/:subjectId', (req, res) => {
  const { grade, year, month, subjectId } = req.params;
  const result = getSubjectConfig(
    Number(grade),
    Number(year),
    month,
    subjectId
  );
  res.json(result);
});

/**
 * @route GET /paper-config/:grade/:year/:month/:subjectId/:paperNumber
 * @description Get the configuration for a specific paper
 * @param {number} grade - The grade level
 * @param {number} year - The year of the exam
 * @param {string} month - The full month of the exam
 * @param {string} subjectId - The ID of the subject, the name of the subject in kebab case e.g mathematical-literacy
 * @param {number} paperNumber - The paper number
 */
app.get(
  '/paper-config/:grade/:year/:month/:subjectId/:paperNumber',
  (req, res) => {
    const { grade, year, month, subjectId, paperNumber } = req.params;
    const result = getPaperConfig(
      Number(grade),
      Number(year),
      month,
      subjectId,
      Number(paperNumber)
    );
    res.json(result);
  }
);

/**
 * @route GET /paper-file/:grade/:year/:month/:subjectId/:paperNumber
 * @description Get the file for a specific paper
 * @param {number} grade - The grade level
 * @param {number} year - The year of the exam
 * @param {string} month - The full month of the exam
 * @param {string} subjectId - The ID of the subject, the name of the subject in kebab case e.g mathematical-literacy format
 * @param {number} paperNumber - The paper number
 */
app.get(
  '/paper-file/:grade/:year/:month/:subjectId/:paperNumber',
  (req, res) => {
    const { grade, year, month, subjectId, paperNumber } = req.params;
    const file = getPaperFile(
      Number(grade),
      Number(year),
      month,
      subjectId,
      Number(paperNumber)
    );
    res.send(file);
  }
);

/**
 * @route GET /paper-id/:grade/:year/:month/:subjectId/:paperNumber
 * @description Get the ID for a specific paper
 * @param {number} grade - The grade level
 * @param {number} year - The year of the exam
 * @param {string} month - The full month of the exam
 * @param {string} subjectId - The ID of the subject, the name of the subject in kebab case e.g mathematical-literacy
 * @param {number} paperNumber - The paper number
 */
app.get('/paper-id/:grade/:year/:month/:subjectId/:paperNumber', (req, res) => {
  const { grade, year, month, subjectId, paperNumber } = req.params;
  const result = getPaperId(
    Number(grade),
    Number(year),
    month,
    subjectId,
    Number(paperNumber)
  );
  res.json(result);
});

/**
 * @route GET /all-paper-ids
 * @description Get all paper IDs
 */
app.get('/all-paper-ids', (req, res) => {
  const result = getAllPaperIds();
  res.json(result);
});

/**
 * @route GET /paper-by-id/:paperId
 * @description Get a paper by its ID
 * @param {string} paperId - The ID of the paper
 */
app.get('/paper-by-id/:paperId', (req, res) => {
  const { paperId } = req.params;
  const result = getPaperById(paperId);
  res.json(result);
});

/**
 * @route GET /total-file-size-mb
 * @description Get the total file size in MB
 */
app.get('/total-file-size-mb', (req, res) => {
  const result = getTotalFileSizeInMB();
  res.json(result);
});

/**
 * @route GET /total-file-size-gb
 * @description Get the total file size in GB
 */
app.get('/total-file-size-gb', (req, res) => {
  const result = getTotalFileSizeInGB();
  res.json(result);
});

/**
 * @route GET /paper-in-language/:grade/:year/:month/:subjectId/:paperNumber/:language
 * @description Get a paper in a specific language
 * @param {number} grade - The grade level
 * @param {number} year - The year of the exam
 * @param {string} month - The full month of the exam
 * @param {string} subjectId - The ID of the subject, the name of the subject in kebab case e.g mathematical-literacy
 * @param {number} paperNumber - The paper number
 * @param {string} language - The language of the paper
 */
app.get(
  '/paper-in-language/:grade/:year/:month/:subjectId/:paperNumber/:language',
  (req, res) => {
    const { grade, year, month, subjectId, paperNumber, language } = req.params;
    const result = getPaperInLanguage(
      Number(grade),
      Number(year),
      month,
      subjectId,
      Number(paperNumber),
      language
    );
    res.json(result);
  }
);

/**
 * @route GET /all-papers-for-subject/:subjectId
 * @description Get all papers for a specific subject
 * @param {string} subjectId - The ID of the subject, the name of the subject in kebab case e.g mathematical-literacy
 */
app.get('/all-papers-for-subject/:subjectId', (req, res) => {
  const { subjectId } = req.params;
  const result = getAllPapersForSubject(subjectId);
  res.json(result);
});

/**
 * @route GET /all-papers
 * @description Get all papers
 */
app.get('/all-papers', (req, res) => {
  const result = getAllPapers();
  res.json(result);
});

/**
 * @route GET /all-papers-for-year/:year
 * @description Get all papers for a specific year
 * @param {number} year - The year of the exams
 */
app.get('/all-papers-for-year/:year', (req, res) => {
  const { year } = req.params;
  const result = getAllPapersForYear(Number(year));
  res.json(result);
});

/**
 * @route GET /all-papers-for-month/:month
 * @description Get all papers for a specific month
 * @param {string} month - The full month of the exams
 */
app.get('/all-papers-for-month/:month', (req, res) => {
  const { month } = req.params;
  const result = getAllPapersForMonth(month);
  res.json(result);
});

/**
 * @route GET /all-language-exam-papers
 * @description Get all language exam papers
 */
app.get('/all-language-exam-papers', (req, res) => {
  const result = getAllLanguageExamPapers();
  res.json(result);
});

/**
 * @route GET /all-papers-in-language/:language
 * @description Get all papers in a specific language
 * @param {string} language - The language of the papers
 */
app.get('/all-papers-in-language/:language', (req, res) => {
  const { language } = req.params;
  const result = getAllPapersInLanguage(language);
  res.json(result);
});

/**
 * @route GET /all-papers-in-language-for-year/:year/:language
 * @description Get all papers in a specific language for a specific year
 * @param {number} year - The year of the exams
 * @param {string} language - The language of the papers
 */
app.get('/all-papers-in-language-for-year/:year/:language', (req, res) => {
  const { year, language } = req.params;
  const result = getAllPapersInLanguageForYear(Number(year), language);
  res.json(result);
});

/**
 * @route GET /all-extra-papers
 * @description Get all extra papers
 */
app.get('/all-extra-papers', (req, res) => {
  const result = getAllExtraPapers();
  res.json(result);
});

/**
 * @route GET /all-extra-papers-for-year/:year
 * @description Get all extra papers for a specific year
 * @param {number} year - The year of the extra papers
 */
app.get('/all-extra-papers-for-year/:year', (req, res) => {
  const { year } = req.params;
  const result = getAllExtraPapersForYear(Number(year));
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
