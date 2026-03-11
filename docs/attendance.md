# Attendance Api Spec

## Current Attendance

Endpoint: GET /api/attendance

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "id": 1,
  "date": "2025-08-05T00:00:00.000Z",
  "check_in_time": "2025-08-05T02:29:34.830Z",
  "check_out_time": "2025-08-05T02:29:34.868Z",
  "status": "present",
  "is_late": false,
  "late_duration": 0
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Check-in Employee

Endpoint: POST /api/attendance/check-in

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": {
    "id": 1,
    "date": "2025-08-05T00:00:00.000Z",
    "check_in_time": "2025-08-05T02:29:34.830Z",
    "check_out_time": null,
    "status": "present",
    "is_late": false,
    "late_duration": 0
  },
  "message": "Check-in successful"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Check-out Employee

Endpoint: POST /api/attendance/check-out

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": {
    "id": 1,
    "date": "2025-08-05T00:00:00.000Z",
    "check_in_time": "2025-08-05T02:29:34.830Z",
    "check_out_time": "2025-08-05T02:29:34.868Z",
    "status": "present",
    "is_late": false,
    "late_duration": 0
  },
  "message": "Check-out successful"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Get Personal Attendance History

Endpoint: GET /api/attendance/history

- user_id: number, optional
- start_date: date, optional
- end_date: date, optional
- status: string, optional
- is_late: bool, optional
- page: number, default 1
- size: number, default 8

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": [
    {
      "id": 1,
      "date": "2025-08-05T00:00:00.000Z",
      "check_in_time": "2025-08-05T02:29:34.830Z",
      "check_out_time": "2025-08-05T02:29:34.868Z",
      "status": "present",
      "is_late": false,
      "late_duration": 0
    },
    {
      "id": 2,
      "date": "2025-08-05T00:00:00.000Z",
      "check_in_time": "2025-08-05T02:29:34.830Z",
      "check_out_time": "2025-08-05T02:29:34.868Z",
      "status": "present",
      "is_late": false,
      "late_duration": 0
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

## Search Attendance (Admin/HR)

Endpoint: GET /api/hr/attendance/report

- employee_number: string, optional
- start_date: date, optional
- end_date: date, optional
- status: string, optional
- is_late: bool, optional
- page: number, default 1
- size: number, default 8

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": [
    {
      "id": 1,
      "date": "2025-08-05T00:00:00.000Z",
      "check_in_time": "2025-08-05T02:29:34.830Z",
      "check_out_time": "2025-08-05T02:29:34.868Z",
      "status": "present",
      "is_late": false,
      "late_duration": 0
    },
    {
      "id": 2,
      "date": "2025-08-05T00:00:00.000Z",
      "check_in_time": "2025-08-05T02:29:34.830Z",
      "check_out_time": "2025-08-05T02:29:34.868Z",
      "status": "present",
      "is_late": false,
      "late_duration": 0
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
