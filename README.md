# WeddingChime Biodata Platform

This repository scaffolds a Marriage Biodata Form web app. Stage 2 adds backend APIs for dropdown data, candidate submission, and file-upload stubs. Stage 3 introduces a polished React + Tailwind frontend that walks candidates through the 12-step biodata journey.

## Project Structure

```
/project-root
  /backend
    /src
      index.js              # Express app with health, dropdowns, candidates, uploads
      /controllers          # Route controllers
      /routes               # Route definitions
      /middleware           # Multer setup for uploads
      /utils                # Validation helpers
      /types                # Example payload typedef
      prismaClient.js       # Prisma client instance
    /prisma
      schema.prisma         # MySQL schema for candidates, relations, dropdown tables
      seed.js               # Sample seed data for dropdowns
    package.json
    .env.example
  /frontend
    package.json            # Vite + React + Tailwind config
    index.html
    /src
      App.jsx               # Stepper layout and routing
      /context              # Form provider and shared state
      /components           # Stepper + layout shell
      /steps                # 12-step form components (3 fully implemented with validation)
```

## Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env
   # edit .env to include DATABASE_URL and PORT if needed
   ```

3. Run Prisma migrations (after configuring your MySQL database):
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed dropdown sample data:
   ```bash
   npm run prisma:seed
   ```

5. Run automated checks:
   ```bash
   npm test
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The API enables CORS for both `http://localhost:3000` and the Vite default `http://localhost:5173` so the new frontend can talk to it directly.

> **Dropdown datasets:** swap out the lightweight seed data in `backend/prisma/seed.js` with your full country/city/occupation lists, then rerun `npm run prisma:seed`.

## Frontend Setup (Stage 3)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite dev server:
   ```bash
   npm run dev
   ```

3. Access the UI at `http://localhost:5173`. The React app features a top stepper, modern cards, Tailwind styling, and three fully validated steps (Personal Info, Religious & Marital, Education) with skeletons for the remaining steps.

## Health Check

With the server running, verify readiness:
```bash
curl http://localhost:4000/api/health
# => {"status":"ok"}
```

## Dropdown API

- Endpoint: `GET /api/dropdowns/:type`
- Supported types: `countries`, `cities` (`?countryId=` filter), `occupations`, `incomeRanges`, `religions`, `castes` (`?religionId=` filter), `religiousPracticeLevels`, `familyFinancialStatuses`, `familyTypes`, `smokingHabits`, `drinkingHabits`, `educationLevels`, `residencyStatuses`, `maritalStatuses`, `bloodGroups`, `hobbies`.
- Response: `[{ id, label }]` where label combines English/Bangla when available.

Example:
```bash
curl "http://localhost:4000/api/dropdowns/cities?countryId=1"
```

## Candidate Submission API

- Endpoint: `POST /api/candidates`
- Payload: a single JSON document containing candidate core fields plus nested arrays for children, siblings, relatives, educationEntries, hobbies, partnerExpectation, and optional files.
- Validation: requires `fullName`, `gender`, `dateOfBirth`, `religionId`, `maritalStatusId`, `highestEducationLevelId`, `occupationType`, `residencyStatusId`, `currentCountryId`, `currentCityId`, and `primaryContactNumber`. Returns HTTP 400 with error list if missing.
- Transactional persistence: creates the candidate and all nested relations atomically.

Sample request:
```bash
curl -X POST http://localhost:4000/api/candidates \
  -H 'Content-Type: application/json' \
  -d '{
    "fullName": "John Doe",
    "gender": "Male",
    "dateOfBirth": "1992-05-10",
    "religionId": 1,
    "maritalStatusId": 1,
    "highestEducationLevelId": 4,
    "occupationType": "Service",
    "occupationId": 2,
    "residencyStatusId": 1,
    "currentCountryId": 1,
    "currentCityId": 1,
    "primaryContactNumber": "+8801XXXXXXXXX",
    "educationEntries": [{"educationLevelId":4,"institution":"University of Dhaka","passingYear":2015}],
    "partnerExpectation": {"preferredMinAge":22,"preferredMaxAge":28},
    "children": [],
    "siblings": [],
    "maternalRelatives": [],
    "paternalRelatives": [],
    "hobbies": []
  }'
```

An example JSDoc typedef and payload lives in `backend/src/types/candidatePayload.js`.

## File Upload Stubs

- Endpoints:
  - `POST /api/uploads/profile-photo`
  - `POST /api/uploads/nid-passport`
  - `POST /api/uploads/biodata-doc`
- Each accepts `multipart/form-data` with a `file` field and stores uploads under `backend/uploads`, returning metadata. Include optional `candidateId` + `fileType` in the body to immediately attach a `CandidateFile` row; on DB errors the file is cleaned up.

## Notes
- CORS is enabled for `http://localhost:3000` and `http://localhost:5173`.
- Prisma schema models candidates, their family/education details, partner expectations, file uploads, and reference tables for dropdown fields.
- The React/Tailwind frontend lives in `/frontend` with a 12-step flow, shared context, dropdown integration, and polished UI components.
