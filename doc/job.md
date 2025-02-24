# Job API Spec

## Create Job

**Endpoint:** `POST /api/jobs`

**Request Header:**

- X-API-TOKEN : token

**Request Body:**

```json
{
  "title": "Software Engineer",
  "description": "Responsible for developing web applications using JavaScript and TypeScript.",
  "status": "OPEN",
  "job_type": "FULL_TIME",
  "workplace_type": "REMOTE",
  "experience_level": "JUNIOR",
  "location": "Jakarta, Indonesia",
  "salary_range": "Rp10.000.000 - Rp15.000.000",
  "expiry_date": "2025-03-15T23:59:59.999Z"
}
```

**Response Body (success):**

```json
{
  "data": {
    "id": 1,
    "title": "Software Engineer",
    "description": "Responsible for developing web applications using JavaScript and TypeScript.",
    "status": "OPEN",
    "job_type": "FULL_TIME",
    "workplace_type": "REMOTE",
    "experience_level": "JUNIOR",
    "location": "Jakarta, Indonesia",
    "salarary_range": "Rp10.000.000 - Rp15.000.000",
    "expiry_date": "2025-03-15T23:59:59.999Z",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "applications_count": 0,
    "created_at": "2025-02-24T12:30:00.000Z"
  },
  "message": "Job successfully created"
}
```

**Response Body (failed):**

```json
{
  "errors": "title is required."
}
```

## Get Job

**Endpoint:** `GET /api/jobs/:id`

**Request Header:**

- X-API-TOKEN : token

**Response Body (success):**

```json
{
  "data": {
    "id": 1,
    "title": "Software Engineer",
    "description": "Responsible for developing web applications using JavaScript and TypeScript.",
    "status": "OPEN",
    "job_type": "FULL_TIME",
    "workplace_type": "REMOTE",
    "experience_level": "JUNIOR",
    "location": "Jakarta, Indonesia",
    "salarary_range": "Rp10.000.000 - Rp15.000.000",
    "expiry_date": "2025-03-15T23:59:59.999Z",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "applications_count": 0,
    "created_at": "2025-02-24T12:30:00.000Z"
  }
}
```

**Response Body (failed):**

```json
{
  "errors": "Job is not found."
}
```

## Update Job

**Endpoint:** `PUT /api/jobs/:id`

**Request Header:**
X-API-TOKEN : token

**Request Body:**

```json
{
  "title": "Software Engineer",
  "description": "Responsible for developing web applications using JavaScript and TypeScript.",
  "status": "OPEN",
  "job_type": "FULL_TIME",
  "workplace_type": "REMOTE",
  "experience_level": "JUNIOR",
  "location": "Jakarta, Indonesia",
  "salarary_range": "Rp10.000.000 - Rp15.000.000",
  "expiry_date": "2025-03-15T23:59:59.999Z"
}
```

**Response Body (success):**

```json
{
  "data": {
    "id": 1,
    "title": "Software Engineer",
    "description": "Responsible for developing web applications using JavaScript and TypeScript.",
    "status": "OPEN",
    "job_type": "FULL_TIME",
    "workplace_type": "REMOTE",
    "experience_level": "JUNIOR",
    "location": "Jakarta, Indonesia",
    "salarary_range": "Rp10.000.000 - Rp15.000.000",
    "expiry_date": "2025-03-15T23:59:59.999Z",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "applications_count": 0,
    "created_at": "2025-02-24T12:30:00.000Z"
  },
  "message": "Job successfully updated"
}
```

**Response Body (failed):**

```json
{
  "errors": "title is required."
}
```

## Remove Job

**Endpoint:** `DELETE /api/jobs/:id`

**Request Header:**
X-API-TOKEN : token

**Response Body (success):**

```json
{
  "data": "Job successfully deleted."
}
```

**Response Body (failed):**

```json
{
  "errors": "Job is not found"
}
```

## Search Job

**Endpoint:** `GET /api/jobs/`

**Query Parameter:**

- title: string
- job type: string
- workplace type: string
- experience level: string
- location: string
- page: number, default 1
- size: number, default 10

**Request Header:**
X-API-TOKEN : token

**Response Body (success):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Software Engineer",
      "description": "Responsible for developing web applications using JavaScript and TypeScript.",
      "status": "OPEN",
      "job_type": "FULL_TIME",
      "workplace_type": "REMOTE",
      "experience_level": "JUNIOR",
      "location": "Jakarta, Indonesia",
      "salary_range": "Rp10.000.000 - Rp15.000.000",
      "expiry_date": "2025-03-15T23:59:59.999Z",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "applications_count": 3,
      "created_at": "2025-02-24T12:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Frontend Developer",
      "description": "Develop and maintain user-facing features using React and Next.js.",
      "status": "CLOSED",
      "job_type": "PART_TIME",
      "workplace_type": "ONSITE",
      "experience_level": "MID",
      "location": "Bandung, Indonesia",
      "salary_range": "Rp7.000.000 - Rp10.000.000",
      "expiry_date": "2025-04-01T23:59:59.999Z",
      "user_id": "e1a1b2c3-d4e5-6789-abcd-ef0123456789",
      "applications_count": 10,
      "created_at": "2025-01-15T08:45:00.000Z"
    },
    {
      "id": 3,
      "title": "Backend Engineer",
      "description": "Design, implement, and maintain scalable APIs using Node.js and Express.",
      "status": "OPEN",
      "job_type": "CONTRACT",
      "workplace_type": "HYBRID",
      "experience_level": "SENIOR",
      "location": "Surabaya, Indonesia",
      "salary_range": "Rp15.000.000 - Rp20.000.000",
      "expiry_date": "2025-03-10T23:59:59.999Z",
      "user_id": "9f8e7d6c-5b4a-3210-abcd-9876543210ef",
      "applications_count": 7,
      "created_at": "2025-02-10T14:20:00.000Z"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

**Response Body (failed):**

```json
{
  "errors": "Unauthorized. Token is missing."
}
```
