# Thesis Search System

This Senior project is a theses search system for Computer Science students. It provides functionalities like document indexing, TF-IDF-based search, and user account management. 

## System Scope

### 1. Searching
- **Simple Search**: String Matching.
- **Advanced Search**: TF-IDF (Term Frequency-Inverse Document Frequency) based search.

### 2. Indexing
- **Parsing**: Extracts text from document files.
- **Tokenization**: Splits text into tokens (words/phrases).
- **Stop Word Removal**: Removes unnecessary words and whitespace.

### 3. Scoring
- **Term Frequency (TF)**: Measures word frequency within a document.
- **Inverse Document Frequency (IDF)**: Measures word importance across all documents.
- **TF-IDF**: Calculates word importance for search.

### 4. Ranking
Results are ranked based on their TF-IDF scores to provide the most relevant results to the user.

### 5. User Account Management
- Sign-up
- Log-in/Log-out
- Edit Profile
- Change Password
- Reset Password

## Tech Stack - Frontend
[![Frontend](https://skillicons.dev/icons?i=angular,primeng)](https://github.com/mskerz/thesis-search-project)


## Installation 

Coming Soon...


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
