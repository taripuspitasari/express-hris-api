# Application API Spec

## Create Application

**Endpoint:** `POST /api/applications`

**Request Header:**

- X-API-TOKEN : token

**Request Body:**

```json
{
  "job_id": 1,
  "resume": "resume_abc123.pdf"
}
```

**Response Body (success):**

```json
{
  "data": {
    "id": 1,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "job_id": 1,
    "resume": "resume_abc123.pdf",
    "status": "PENDING",
    "created_at": "2025-02-24T12:30:00.000Z"
  },
  "message": "Application successfully created"
}
```

**Response Body (failed):**

```json
{
  "errors": "resume is required."
}
```

## Get Application

**Endpoint:** `GET /api/applications/:id`

**Request Header:**

- X-API-TOKEN : token

**Response Body (success):**

```json
{
  "data": {
    "id": 1,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "job_id": 1,
    "resume": "resume_abc123.pdf",
    "status": "PENDING",
    "created_at": "2025-02-24T12:30:00.000Z"
  }
}
```

**Response Body (failed):**

```json
{
  "errors": "Application is not found."
}
```

## Update Application

**Endpoint:** `PUT /api/applications/:id`

**Request Header:**
X-API-TOKEN : token

**Request Body:**

```json
{
  "status": "APPROVED"
}
```

**Response Body (success):**

```json
{
  "data": {
    "id": 1,
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "job_id": 1,
    "resume": "resume_abc123.pdf",
    "status": "APPROVED",
    "created_at": "2025-02-24T12:30:00.000Z"
  },
  "message": "Application successfully updated"
}
```

**Response Body (failed):**

```json
{
  "errors": "resume is required."
}
```

## Remove Application

**Endpoint:** `DELETE /api/applications/:id`

**Request Header:**
X-API-TOKEN : token

**Response Body (success):**

```json
{
  "message": "Application successfully deleted."
}
```

**Response Body (failed):**

```json
{
  "errors": "Application is not found."
}
```
