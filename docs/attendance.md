# Attendance Api Spec

## Check in user

Endpoint: POST /api/attendance/check-in

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "id": 1,
  "check_in_time": "",
  "date": ""
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
  "check_in_time": "",
  "check_out_time": "",
  "date": ""
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Check in user

Endpoint: GET /api/attendance/history

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": [
    {
      "id": 1,
      "check_in_time": "",
      "check_out_time": "",
      "date": ""
    },
    {
      "id": 2,
      "check_in_time": "",
      "check_out_time": "",
      "date": ""
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
