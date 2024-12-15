import june2020grade12 from './generated/2020-June-grade-12.json' assert { type: 'json' };
import june2021grade12 from './generated/2021-June-grade-12.json' assert { type: 'json' };
import november2021grade12 from './generated/2021-November-grade-12.json' assert { type: 'json' };
import june2022grade12 from './generated/2022-June-grade-12.json' assert { type: 'json' };
import november2022grade12 from './generated/2022-November-grade-12.json' assert { type: 'json' };
import june2023grade12 from './generated/2023-June-grade-12.json' assert { type: 'json' };
import november2023grade12 from './generated/2023-November-grade-12.json' assert { type: 'json' };
import { tail, path, flatten } from 'ramda';
import fs from 'fs';

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
export const getSubjectIds = (grade, year, month) => {
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
export const getSubjectConfigs = (grade, year, month) => {
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
export const getSubjectConfig = (grade, year, month, subjectId) => {
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
export const getPaperConfig = (grade, year, month, subjectId, paperNumber) => {
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
export const getPaperFile = (grade, year, month, subjectId, paperNumber) => {
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
export const getPaperFileConfig = (
  grade,
  year,
  month,
  subjectId,
  paperNumber
) => {
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
export const getPaperId = (grade, year, month, subjectId, paperNumber) => {
  const config = path([grade, year, month], configs);
  return config
    .find((subject) => subject.id === subjectId)
    .papers.find((paper) => paper.number === paperNumber).id;
};

/**
 * Gets the IDs for all papers.
 * @returns {Array} - The IDs for all papers.
 */
export const getAllPaperIds = () => {
  return [...new Set(allPapersConfig.map((paper) => paper.id))];
};

/**
 * Gets the configuration for a specific paper for a given paper ID.
 * @param {string} paperId - The ID of the paper.
 * @returns {Object} - The configuration for the specific paper.
 */
export const getPaperById = (paperId) => {
  return allPapersConfig.find((paper) => paper.id === paperId);
};

/**
 * Gets the configuration for a specific paper file for a given paper ID.
 * @param {string} paperId - The ID of the paper.
 * @returns {Object} - The configuration for the specific paper file.
 */
export const getPaperFileConfigById = (paperId) => {
  return allPapersConfig.find((paper) => paper.id === paperId).file;
};

/**
 * Gets the total file size for all papers in MB.
 * @returns {string} - The total file size in MB.
 */
export const getTotalFileSizeInMB = () => {
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
export const getTotalFileSizeInGB = () => {
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
export const getPaperInLanguage = (
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
export const getAllPapersForSubject = (subjectId) => {
  return allPapersConfig.filter((subject) => subject.id === subjectId);
};

/**
 * Gets all papers.
 * @returns {Array} - All papers.
 */
export const getAllPapers = () => {
  return allPapersConfig;
};

/**
 * Gets all papers for a specific year.
 * @param {number} year - The year (e.g., 2020).
 * @returns {Array} - The papers for the specific year.
 */
export const getAllPapersForYear = (year) => {
  return allPapersConfig.filter((subject) => subject.year === year);
};

/**
 * Gets all papers for a specific month.
 * @param {string} month - The month (e.g., 'june').
 * @returns {Array} - The papers for the specific month.
 */
export const getAllPapersForMonth = (month) => {
  return allPapersConfig.filter((subject) => subject.month === month);
};

/**
 * Gets all language exam papers.
 * @returns {Array} - The language exam papers.
 */
export const getAllLanguageExamPapers = () => {
  return allPapersConfig.filter((subject) => subject.isLanguageExam);
};

/**
 * Gets all papers in a specific language.
 * @param {string} language - The language of the papers.
 * @returns {Array} - The papers in the specific language.
 */
export const getAllPapersInLanguage = (language) => {
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
export const getAllPapersInLanguageForYear = (year, language) => {
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
export const getAllExtraPapers = () => {
  return allPapersConfig.filter((subject) => subject.isExtraPaper);
};

/**
 * Gets all extra papers for a specific year.
 * @param {number} year - The year (e.g., 2020).
 * @returns {Array} - The extra papers for the specific year.
 */
export const getAllExtraPapersForYear = (year) => {
  return allPapersConfig.filter(
    (subject) => subject.year === year && subject.isExtraPaper
  );
};
