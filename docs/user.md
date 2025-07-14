# User Api Spect

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
  "email": "janedoe@gmail.com",
  "password": "secretkey",
  "name": "Jane Doe"
}
```

Response Body (success) :

```json
{
  "id": 1,
  "email": "janedoe@gmail.com",
  "name": "Jane Doe",
  "role": "employee"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Login User

Endpoint: POST /api/users/login

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
  "id": 1,
  "email": "janedoe@gmail.com",
  "name": "Jane Doe",
  "role": "employee",
  "token": "uuid"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Get User

Endpoint: GET /api/users/current

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "id": 1,
  "email": "janedoe@gmail.com",
  "name": "Jane Doe",
  "role": "employee"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Update User

Endpoint: PATCH /api/users/current
Request Header:

- Authorization: token

Request Body:

```json
{
  "email": "janedoeupdate@gmail.com",
  "password": "secretkeyupdate",
  "name": "Jane Doe update",
  "role": "applicant"
}
```

Response Body (success) :

```json
{
  "id": 1,
  "email": "janedoeupdate@gmail.com",
  "name": "Jane Doe update",
  "role": "applicant"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Logout User

Endpoint: DELETE /api/users/current

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "message": "Succesfully logout"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```
