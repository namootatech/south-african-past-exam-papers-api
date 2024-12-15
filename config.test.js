import { describe, it } from 'mocha';
import { expect } from 'chai';
import {
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
  getSubjectConfigs,
  getSubjectIds,
} from './config.js';
import june2020grade12 from './generated/2020-June-grade-12.json' assert { type: 'json' };
import june2021grade12 from './generated/2021-June-grade-12.json' assert { type: 'json' };
import november2021grade12 from './generated/2021-November-grade-12.json' assert { type: 'json' };
import june2022grade12 from './generated/2022-June-grade-12.json' assert { type: 'json' };
import november2022grade12 from './generated/2022-November-grade-12.json' assert { type: 'json' };
import june2023grade12 from './generated/2023-June-grade-12.json' assert { type: 'json' };
import november2023grade12 from './generated/2023-November-grade-12.json' assert { type: 'json' };
import { tail, flatten } from 'ramda';

const allPapersConfig = flatten([
  ...june2020grade12.map((subject) => subject.papers),
  ...june2021grade12.map((subject) => subject.papers),
  ...november2021grade12.map((subject) => subject.papers),
  ...june2022grade12.map((subject) => subject.papers),
  ...november2022grade12.map((subject) => subject.papers),
  ...june2023grade12.map((subject) => subject.papers),
  ...november2023grade12.map((subject) => subject.papers),
]);

describe('Config Module', () => {
  it('should export the expected functions', () => {
    expect(getSubjectConfig).to.be.a('function');
    expect(getPaperConfig).to.be.a('function');
    // Add more tests here for the other exported functions
    expect(getPaperFile).to.be.a('function');
    expect(getPaperFileConfig).to.be.a('function');
    expect(getPaperId).to.be.a('function');
    expect(getAllPaperIds).to.be.a('function');
    expect(getPaperById).to.be.a('function');
    expect(getPaperFileConfigById).to.be.a('function');
    expect(getTotalFileSizeInMB).to.be.a('function');
    expect(getTotalFileSizeInGB).to.be.a('function');
    expect(getPaperInLanguage).to.be.a('function');
    expect(getAllPapersForSubject).to.be.a('function');
    expect(getAllPapers).to.be.a('function');
    expect(getAllPapersForYear).to.be.a('function');
    expect(getAllPapersForMonth).to.be.a('function');
    expect(getAllLanguageExamPapers).to.be.a('function');
    expect(getAllPapersInLanguage).to.be.a('function');
    expect(getAllPapersInLanguageForYear).to.be.a('function');
    expect(getAllExtraPapers).to.be.a('function');
    expect(getAllExtraPapersForYear).to.be.a('function');
    // Add more tests here for the other exported functions
  });
  it('should retrieve subject IDs for a valid grade, year, and month combination', () => {
    const subjectIds = getSubjectIds(12, 2021, 'june');
    const expectedSubjectIds = tail(
      june2021grade12.map((subject) => subject.id)
    );
    expect(subjectIds).to.deep.equal(expectedSubjectIds);
  });
  it('should retrieve subject configurations for a valid grade, year, and month combination', () => {
    const grade = 12;
    const year = 2022;
    const month = 'november';

    const expectedConfigs = [...tail(november2022grade12)];
    const result = getSubjectConfigs(grade, year, month);

    expect(result).to.deep.equal(expectedConfigs);
  });
  it('should get subject configuration with valid inputs', () => {
    const grade = 12;
    const year = 2020;
    const month = 'june';
    const subjectId = 'mathematics';

    const subjectConfig = getSubjectConfig(grade, year, month, subjectId);
    expect(subjectConfig).to.exist;
    expect(subjectConfig.id).to.equal(subjectId);
    expect(subjectConfig.count).to.equal(subjectConfig.papers.length);
    expect(subjectConfig.papers.some((paper) => paper.year !== year)).to.be
      .false;
    expect(
      subjectConfig.papers.some(
        (paper) => paper.month.toLowerCase() !== month.toLowerCase()
      )
    ).to.be.false;
  });
  it('should retrieve a specific paper configuration', () => {
    const grade = 12;
    const year = 2023;
    const month = 'november';
    const subjectId = 'mathematics';
    const paperNumber = 1;

    const paperConfig = getPaperConfig(
      grade,
      year,
      month,
      subjectId,
      paperNumber
    );

    expect(paperConfig).to.be.an('object');
    expect(paperConfig.number).to.equal(paperNumber);
    expect(paperConfig.year).to.equal(year);
    expect(paperConfig.month.toLowerCase()).to.equal(month.toLowerCase());
    // Add more expectations based on the expected paper details
  });
  it('should retrieve a paper file for a valid grade, year, month, subject ID, and paper number', () => {
    const grade = 12;
    const year = 2021;
    const month = 'june';
    const subjectId = 'history';
    const paperNumber = 2;

    const file = getPaperFile(grade, year, month, subjectId, paperNumber);
    expect(file).to.be.an.instanceOf(Buffer);
    expect(file.length).to.be.greaterThan(0);
  });
  it('should retrieve all paper IDs and verify that the list contains all expected paper IDs', () => {
    const expectedPaperIds = [
      ...new Set(allPapersConfig.map((paper) => paper.id)),
    ];
    const actualPaperIds = getAllPaperIds();
    const paperCount = expectedPaperIds.length;
    expect(actualPaperIds).to.have.length(paperCount);
    expect(actualPaperIds).to.deep.equal(expectedPaperIds);
  });
});

describe('getPaperById', () => {
  it('should return the correct paper configuration for a given paper ID', () => {
    // Arrange
    const paperId =
      'accounting-12-November-2023-paper-1-answer-book-(english)--paper-1-English';
    const expectedPaperConfig = {
      canonicalName: 'Paper 1 Answer Book (English)',
      viewUrl:
        'https://www.education.gov.za/LinkClick.aspx?fileticket=sQW7jjG56Sk%3d&tabid=4682&portalid=0&mid=12660',
      downloadUrl:
        'https://www.education.gov.za/LinkClick.aspx?fileticket=sQW7jjG56Sk%3d&tabid=4682&portalid=0&mid=12660&forcedownload=true',
      name: 'Accounting - Paper 1  in English',
      number: 1,
      province: 'not-specified',
      subject: 'Accounting',
      isLanguageExam: false,
      languageLevel: 'not-applicable',
      isExtraPaper: false,
      type: 'exam',
      language: 'English',
      year: 2023,
      grade: 12,
      month: 'November',
      id: 'accounting-12-November-2023-paper-1-answer-book-(english)--paper-1-English',
      file: {
        path: '../files/12/2023/November/accounting-12-1-November-2023-1-paper-1-answer-book-(english)-exam.pdf',
        size: '0.24 MB',
      },
    };

    // Act
    const result = getPaperById(paperId);

    // Assert
    expect(result).to.deep.equal(expectedPaperConfig);
  });
});
it('calculates the total file size in MB for all papers', () => {
  const totalFileSizeInMB = getTotalFileSizeInMB();
  const expectedTotalFileSizeInMB = allPapersConfig.reduce(
    (totalSize, subject) =>
      totalSize +
      parseFloat(
        isNaN(subject.file.size.split(' ')[0])
          ? 0
          : subject.file.size.split(' ')[0] || 0
      ),
    0
  );
  expect(totalFileSizeInMB).to.equal(`${expectedTotalFileSizeInMB} MB`);
});
it('should return only papers in the specified language', () => {
  const language = 'english';
  const papers = getAllPapersInLanguage(language);

  papers.forEach((paper) => {
    expect(paper.language.toLowerCase()).to.equal(language);
  });
});
it('should retrieve only extra papers for a specific year', () => {
  const year = 2022;
  const extraPapersForYear = getAllExtraPapersForYear(year);

  extraPapersForYear.forEach((paper) => {
    expect(paper.year).to.equal(year);
    expect(paper.isExtraPaper).to.be.true;
  });
});
