# User API Spec

## Register User

**Endpoint:** `POST /api/users`

**Request Body:**

```json
{
  "name": "Tari",
  "email": "tari@gmail.com",
  "password": "password"
}
```

**Response Body (success):**

```json
{
  "data": {
    "id": "uuid",
    "name": "Tari",
    "email": "tari@gmail.com",
    "role": "APPLICANT"
  },
  "message": "User successfully registered"
}
```

**Response Body (failed):**

```json
{
  "errors": "Email is already taken."
}
```

## Login User

**Endpoint:** `POST /api/users/login`

**Request Body:**

```json
{
  "email": "tari@gmail.com",
  "password": "password"
}
```

**Response Body (success):**

```json
{
  "data": {
    "id": "uuid",
    "name": "Tari",
    "email": "tari@gmail.com",
    "role": "APPLICANT",
    "token": "uuid"
  },
  "message": "Login successful"
}
```

**Response Body (failed):**

```json
{
  "errors": "Invalid email or password."
}
```

## Get User

**Endpoint:** `GET /api/users/current`

**Request Header:**
X-API-TOKEN : token

**Response Body (success):**

```json
{
  "data": {
    "id": "uuid",
    "name": "Tari",
    "email": "tari@gmail.com",
    "role": "APPLICANT"
  }
}
```

**Response Body (failed):**

```json
{
  "errors": "Unauthorized."
}
```

## Update User

**Endpoint:** `PATCH /api/users/current`

**Request Header:**
X-API-TOKEN : token

**Request Body:**

```json
{
  "data": {
    "name": "New Name",
    "password": "newpassword",
    "email": "newemail@gmail.com"
  }
}
```

**Response Body (success):**

```json
{
  "data": {
    "id": "user-uuid",
    "email": "newemail@gmail.com",
    "name": "New Name",
    "role": "APPLICANT"
  }
}
```

**Response Body (failed):**

```json
{
  "errors": "Unauthorized. Token is missing."
}
```

## Logout User

**Endpoint:** `DELETE /api/users/current`

**Request Header:**
X-API-TOKEN : token

**Response Body (success):**

```json
{
  "data": "Successfully logged out."
}
```

**Response Body (failed):**

```json
{
  "errors": "Unauthorized."
}
```
