# Auth Api Spec

## Register

Endpoint: POST /api/auth/register

Request Body:

```json
{
  "fullname": "Jane Doe",
  "email": "janedoe@gmail.com",
  "password": "secretkey"
}
```

Response Body (success) :

```json
{
  "message": "User registered successfully. Please login."
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Login

Endpoint: POST /api/auth/login

Request Body:

```json
{
  "email": "janedoe@gmail.com",
  "password": "secretkey"
}
```

Response Body (success) :

```json
{
  "message": "Login successfully",
  "data": {
    "id": 1,
    "fullname": "Jane Doe",
    "roles": ["employee"],
    "token": "uuid"
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Me

Endpoint: GET /api/auth/me

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": {
    "id": 1,
    "fullname": "Jane Doe",
    "roles": ["employee"]
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Update Profile

Endpoint: PATCH /api/auth/update-profile
Request Header:

- Authorization: token

Request Body:

```json
{
  "fullname": "Jane Doe update",
  "email": "janedoeupdate@gmail.com",
  "phone": "08999998812",
  "birth_date": "12-12-2012",
  "gender": "female"
}
```

Response Body (success) :

```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "fullname": "Jane Doe update",
    "email": "janedoeupdate@gmail.com",
    "phone": "08999998812",
    "birth_date": "12-12-2012",
    "gender": "female"
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Update Password

Endpoint: PATCH /api/auth/change-password
Request Header:

- Authorization: token

Request Body:

```json
{
  "old_password": "secretkey",
  "new_password": "NewSecretKey123"
}
```

Response Body (success) :

```json
{
  "message": "Password updated successfully. Please login again."
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Logout

Endpoint: DELETE /api/auth/logout

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "message": "Logged out successfully"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```
