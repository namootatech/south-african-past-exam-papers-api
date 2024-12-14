# South African Past High School Exam Papers Open Data and API Repository

This repository is a collection of South African high school exam papers, memorandums, and a Node.js Express server for developers to build websites or applications around these resources.

Currently, it includes Grade 12 papers for the years 2020 to 2023, which amount to approximately 20GB. Be prepared for a large repository size when cloning.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/matric-past-papers.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

This project is a work in progress.

## Repository Structure

- `scrape`: Contains the scraped JSON data from the South African Department of Education website, using the Octoparse app.
- `generated`: Contains the generated JSON files for the papers and memorandums.
- `files`: Contains the downloaded question papers from the DOE website.

## Contributing

1. Fork the repository:
   ```bash
   https://github.com/your-username/matric-past-papers.git
   ```
2. Create a new branch:
   ```bash
   git checkout -b your-branch-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Your commit message"
   ```
4. Push your changes to your fork:
   ```bash
   git push origin your-branch-name
   ```
5. Create a pull request on the original repository.

## Node.js Express API Server

This API server provides endpoints to access and manage high school exam papers and related configurations. It is built using Node.js and Express.

### Getting Started

To run the server, ensure you have Node.js installed, then execute the following commands:

```bash
npm install
node server.js
```

The server will start on `http://localhost:3000`.

### API Endpoints

#### Subject and Paper Configuration

- **GET /subject-config/:grade/:year/:month/:subjectId**

  - Retrieves the configuration for a specific subject.
  - Parameters: `grade`, `year`, `month`, `subjectId`

- **GET /paper-config/:grade/:year/:month/:subjectId/:paperNumber**
  - Retrieves the configuration for a specific paper.
  - Parameters: `grade`, `year`, `month`, `subjectId`, `paperNumber`

#### Paper Files and IDs

- **GET /paper-file/:grade/:year/:month/:subjectId/:paperNumber**

  - Retrieves the file for a specific paper.
  - Parameters: `grade`, `year`, `month`, `subjectId`, `paperNumber`

- **GET /paper-id/:grade/:year/:month/:subjectId/:paperNumber**

  - Retrieves the ID for a specific paper.
  - Parameters: `grade`, `year`, `month`, `subjectId`, `paperNumber`

- **GET /all-paper-ids**

  - Retrieves all paper IDs.

- **GET /paper-by-id/:paperId**
  - Retrieves a paper by its ID.
  - Parameter: `paperId`

#### File Size Information

- **GET /total-file-size-mb**

  - Retrieves the total file size in MB.

- **GET /total-file-size-gb**
  - Retrieves the total file size in GB.

#### Language-Specific Papers

- **GET /paper-in-language/:grade/:year/:month/:subjectId/:paperNumber/:language**

  - Retrieves a paper in a specific language.
  - Parameters: `grade`, `year`, `month`, `subjectId`, `paperNumber`, `language`

- **GET /all-papers-in-language/:language**

  - Retrieves all papers in a specific language.
  - Parameter: `language`

- **GET /all-papers-in-language-for-year/:year/:language**
  - Retrieves all papers in a specific language for a specific year.
  - Parameters: `year`, `language`

#### Papers by Subject, Year, and Month

- **GET /all-papers-for-subject/:subjectId**

  - Retrieves all papers for a specific subject.
  - Parameter: `subjectId`

- **GET /all-papers**

  - Retrieves all papers.

- **GET /all-papers-for-year/:year**

  - Retrieves all papers for a specific year.
  - Parameter: `year`

- **GET /all-papers-for-month/:month**
  - Retrieves all papers for a specific month.
  - Parameter: `month`

#### Extra Papers

- **GET /all-extra-papers**

  - Retrieves all extra papers.

- **GET /all-extra-papers-for-year/:year**
  - Retrieves all extra papers for a specific year.
  - Parameter: `year`

## Conclusion

This API server provides a comprehensive set of endpoints to access and manage exam papers and their configurations. It is designed to be easily extendable and maintainable.
