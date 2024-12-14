const june2020grade12 = require('./generated/2020-June-grade-12.json');
const june2021grade12 = require('./generated/2021-June-grade-12.json');
const november2021grade12 = require('./generated/2021-November-grade-12.json');
const june2022grade12 = require('./generated/2022-June-grade-12.json');
const november2022grade12 = require('./generated/2022-November-grade-12.json');
const june2023grade12 = require('./generated/2023-June-grade-12.json');
const november2023grade12 = require('./generated/2023-November-grade-12.json');
const { tail, path, flatten } = require('ramda');
const fs = require('fs');

const grade12 = {
  2020: {
    june: june2020grade12,
  },
  2021: {
    june: june2021grade12,
    november: november2021grade12,
  },
  2022: {
    june: june2022grade12,
    november: november2022grade12,
  },
  2023: {
    june: june2023grade12,
    november: november2023grade12,
  },
};

const allPapersConfig = flatten([
  ...june2020grade12.map((subject) => subject.papers),
  ...june2021grade12.map((subject) => subject.papers),
  ...november2021grade12.map((subject) => subject.papers),
  ...june2022grade12.map((subject) => subject.papers),
  ...november2022grade12.map((subject) => subject.papers),
  ...june2023grade12.map((subject) => subject.papers),
  ...november2023grade12.map((subject) => subject.papers),
]);

const configs = {
  12: grade12,
};

/**
 * Gets the IDs of all subjects for a given grade, year, and month.
 * @param {number} grade - The grade (e.g., 12).
 * @param {number} year - The year (e.g., 2020).
 * @param {string} month - The month (e.g., 'june').
 * @returns {Array} - The IDs of all subjects.
 */
const getSubjectIds = (grade, year, month) => {
  const config = path([grade, year, month], configs);
  return tail(config).map((subject) => subject.id);
};

/**
 * Gets the configuration for all subjects for a given grade, year, and month.
 * @param {number} grade - The grade (e.g., 12).
 * @param {number} year - The year (e.g., 2020).
 * @param {string} month - The month (e.g., 'june').
 * @returns {Array} - The configuration for all subjects.
 */
const getSubjectConfigs = (grade, year, month) => {
  const config = path([grade, year, month], configs);
  return tail(config);
};

/**
 * Gets the configuration for a specific subject for a given grade, year, month, and subject ID.
 * @param {number} grade - The grade (e.g., 12).
 * @param {number} year - The year (e.g., 2020).
 * @param {string} month - The month (e.g., 'june').
 * @param {string} subjectId - The ID of the subject.
 * @returns {Object} - The configuration for the specific subject.
 */
const getSubjectConfig = (grade, year, month, subjectId) => {
  const config = path([grade, year, month], configs);
  return config.find((subject) => subject.id === subjectId);
};

/**
 * Gets the configuration for a specific paper for a given grade, year, month, subject ID, and paper number.
 * @param {number} grade - The grade (e.g., 12).
 * @param {number} year - The year (e.g., 2020).
 * @param {string} month - The month (e.g., 'june').
 * @param {string} subjectId - The ID of the subject.
 * @param {number} paperNumber - The number of the paper.
 * @returns {Object} - The configuration for the specific paper.
 */
const getPaperConfig = (grade, year, month, subjectId, paperNumber) => {
  const config = path([grade, year, month], configs);
  return config
    .find((subject) => subject.id === subjectId)
    .papers.find((paper) => paper.number === paperNumber);
};

/**
 * Gets the file for a specific paper for a given grade, year, month, subject ID, and paper number.
 * @param {number} grade - The grade (e.g., 12).
 * @param {number} year - The year (e.g., 2020).
 * @param {string} month - The month (e.g., 'june').
 * @param {string} subjectId - The ID of the subject.
 * @param {number} paperNumber - The number of the paper.
 * @returns {Buffer} - The file for the specific paper.
 */
const getPaperFile = (grade, year, month, subjectId, paperNumber) => {
  const config = path([grade, year, month], configs);
  const filePath = config
    .find((subject) => subject.id === subjectId)
    .papers.find((paper) => paper.number === paperNumber).file.path;
  const relativeFilePath = ['.', ...tail(filePath.split('/'))].join('/');
  const file = fs.readFileSync(relativeFilePath);
  return file;
};

/**
 * Gets the configuration for a specific paper file for a given grade, year, month, subject ID, and paper number.
 * @param {number} grade - The grade (e.g., 12).
 * @param {number} year - The year (e.g., 2020).
 * @param {string} month - The month (e.g., 'june').
 * @param {string} subjectId - The ID of the subject.
 * @param {number} paperNumber - The number of the paper.
 * @returns {Object} - The configuration for the specific paper file.
 */
const getPaperFileConfig = (grade, year, month, subjectId, paperNumber) => {
  const config = path([grade, year, month], configs);
  return config
    .find((subject) => subject.id === subjectId)
    .papers.find((paper) => paper.number === paperNumber).file;
};

/**
 * Gets the ID for a specific paper for a given grade, year, month, subject ID, and paper number.
 * @param {number} grade - The grade (e.g., 12).
 * @param {number} year - The year (e.g., 2020).
 * @param {string} month - The month (e.g., 'june').
 * @param {string} subjectId - The ID of the subject.
 * @param {number} paperNumber - The number of the paper.
 * @returns {string} - The ID for the specific paper.
 */
const getPaperId = (grade, year, month, subjectId, paperNumber) => {
  const config = path([grade, year, month], configs);
  return config
    .find((subject) => subject.id === subjectId)
    .papers.find((paper) => paper.number === paperNumber).id;
};

/**
 * Gets the IDs for all papers.
 * @returns {Array} - The IDs for all papers.
 */
const getAllPaperIds = () => {
  console.log(allPapersConfig);
  return allPapersConfig.map((paper) => paper.id);
};

/**
 * Gets the configuration for a specific paper for a given paper ID.
 * @param {string} paperId - The ID of the paper.
 * @returns {Object} - The configuration for the specific paper.
 */
const getPaperById = (paperId) => {
  return allPapersConfig.find((subject) =>
    subject.papers.find((paper) => paper.id === paperId)
  );
};

/**
 * Gets the configuration for a specific paper file for a given paper ID.
 * @param {string} paperId - The ID of the paper.
 * @returns {Object} - The configuration for the specific paper file.
 */
const getPaperFileConfigById = (paperId) => {
  return allPapersConfig.find((subject) =>
    subject.papers.find((paper) => paper.id === paperId)
  ).file;
};

/**
 * Gets the total file size for all papers in MB.
 * @returns {string} - The total file size in MB.
 */
const getTotalFileSizeInMB = () => {
  return (
    allPapersConfig.reduce(
      (totalSize, subject) =>
        totalSize +
        parseFloat(
          isNaN(subject.file.size.split(' ')[0])
            ? 0
            : subject.file.size.split(' ')[0] || 0
        ),
      0
    ) + ' MB'
  );
};

/**
 * Gets the total file size for all papers in GB.
 * @returns {string} - The total file size in GB.
 */
const getTotalFileSizeInGB = () => {
  return (
    allPapersConfig.reduce(
      (totalSize, subject) =>
        totalSize +
        parseFloat(
          isNaN(subject.file.size.split(' ')[0])
            ? 0
            : subject.file.size.split(' ')[0] || 0
        ) /
          1024,
      0
    ) + ' GB'
  );
};

/**
 * Gets the paper in a specific language for a given grade, year, month, subject ID, paper number, and language.
 * @param {number} grade - The grade (e.g., 12).
 * @param {number} year - The year (e.g., 2020).
 * @param {string} month - The month (e.g., 'june').
 * @param {string} subjectId - The ID of the subject.
 * @param {number} paperNumber - The number of the paper.
 * @param {string} language - The language of the paper.
 * @returns {Object} - The paper in the specific language.
 */
const getPaperInLanguage = (
  grade,
  year,
  month,
  subjectId,
  paperNumber,
  language
) => {
  const config = path([grade, year, month], configs);
  return config
    .find((subject) => subject.id === subjectId)
    .papers.find(
      (paper) =>
        paper.number === paperNumber &&
        paper.language.toLowerCase() === language.toLowerCase()
    );
};

/**
 * Gets all papers for a specific subject.
 * @param {string} subjectId - The ID of the subject.
 * @returns {Array} - The papers for the specific subject.
 */
const getAllPapersForSubject = (subjectId) => {
  return allPapersConfig.filter((subject) => subject.id === subjectId);
};

/**
 * Gets all papers.
 * @returns {Array} - All papers.
 */
const getAllPapers = () => {
  return allPapersConfig;
};

/**
 * Gets all papers for a specific year.
 * @param {number} year - The year (e.g., 2020).
 * @returns {Array} - The papers for the specific year.
 */
const getAllPapersForYear = (year) => {
  return allPapersConfig.filter((subject) => subject.year === year);
};

/**
 * Gets all papers for a specific month.
 * @param {string} month - The month (e.g., 'june').
 * @returns {Array} - The papers for the specific month.
 */
const getAllPapersForMonth = (month) => {
  return allPapersConfig.filter((subject) => subject.month === month);
};

/**
 * Gets all language exam papers.
 * @returns {Array} - The language exam papers.
 */
const getAllLanguageExamPapers = () => {
  return allPapersConfig.filter((subject) => subject.isLanguageExam);
};

/**
 * Gets all papers in a specific language.
 * @param {string} language - The language of the papers.
 * @returns {Array} - The papers in the specific language.
 */
const getAllPapersInLanguage = (language) => {
  return allPapersConfig.filter(
    (subject) => subject.language.toLowerCase() === language.toLowerCase()
  );
};

/**
 * Gets all papers in a specific language for a specific year.
 * @param {number} year - The year (e.g., 2020).
 * @param {string} language - The language of the papers.
 * @returns {Array} - The papers in the specific language for the specific year.
 */
const getAllPapersInLanguageForYear = (year, language) => {
  return allPapersConfig.filter(
    (subject) =>
      subject.year === year &&
      subject.language.toLowerCase().trim() === language.toLowerCase().trim()
  );
};

/**
 * Gets all extra papers.
 * @returns {Array} - The extra papers.
 */
const getAllExtraPapers = () => {
  return allPapersConfig.filter((subject) => subject.isExtraPaper);
};

/**
 * Gets all extra papers for a specific year.
 * @param {number} year - The year (e.g., 2020).
 * @returns {Array} - The extra papers for the specific year.
 */
const getAllExtraPapersForYear = (year) => {
  return allPapersConfig.filter(
    (subject) => subject.year === year && subject.isExtraPaper
  );
};

module.exports = {
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
};
