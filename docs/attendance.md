# Attendance Api Spec

## Current Attendance

Endpoint: GET /api/attendance

Request Header:

- Authorization: token

Response Body (success) :

Response Body (success) :

```json
{
  "id": 1,
  "check_in_time": "2025-08-05T02:29:34.830Z",
  "check_out_time": "2025-08-05T02:29:34.868Z",
  "date": "2025-08-05T00:00:00.000Z"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Check in user

Endpoint: POST /api/attendance/check-in

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "id": 1,
  "check_in_time": "2025-08-05T02:29:34.830Z",
  "check_out_time": "2025-08-05T02:29:34.868Z",
  "date": "2025-08-05T00:00:00.000Z"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Check out user

Endpoint: POST /api/attendance/check-out

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "id": 1,
  "check_in_time": "2025-08-05T02:29:34.830Z",
  "check_out_time": "2025-08-05T02:29:34.868Z",
  "date": "2025-08-05T00:00:00.000Z"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Attendance List

Endpoint: GET /api/attendance/history

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": [
    {
      "id": 1,
      "check_in_time": "2025-08-05T02:29:34.830Z",
      "check_out_time": "2025-08-05T02:29:34.868Z",
      "date": "2025-08-05T00:00:00.000Z"
    },
    {
      "id": 2,
      "check_in_time": "2025-08-05T02:29:34.830Z",
      "check_out_time": "2025-08-05T02:29:34.868Z",
      "date": "2025-08-05T00:00:00.000Z"
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```
