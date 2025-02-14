# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "name": "Tari",
  "email": "tari@gmail.com",
  "password": "password"
}
```

Response Body (success):

```json
{
  "data": {
    "name": "Tari",
    "email": "tari@gmail.com"
  }
}
```

Response Body (failed):

```json
{
  "errors": "Name is required."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "email": "tari@gmail.com",
  "password": "password"
}
```

Response Body (success):

```json
{
  "data": {
    "name": "Tari",
    "email": "tari@gmail.com",
    "token": "uuid"
  }
}
```

Response Body (failed):

```json
{
  "errors": "Invalid email or password."
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :
-X-API-TOKEN : token

Response Body (success):

```json
{
  "data": {
    "name": "Tari",
    "email": "tari@gmail.com"
  }
}
```

Response Body (failed):

```json
{
  "errors": "Unauthorized."
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :
-X-API-TOKEN : token

Response Body (success):

```json
{
  "data": {
    "name": "Tari",
    "email": "tari@gmail.com"
  }
}
```

Response Body (failed):

```json
{
  "errors": "Unauthorized."
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :
-X-API-TOKEN : token

Response Body (success):

```json
{
  "data": "OK"
}
```

Response Body (failed):

```json
{
  "errors": "Unauthorized."
}
```
