# Employee Api Spec

## Get employee

Endpoint: GET /api/hr/employee/:employeeId

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "id": 1,
  "join_date": "2022-08-01T00:00:00.000Z",
  "position": "Junior",
  "status": "probation",
  "department": {
    "id": 1,
    "name": "IT",
    "description": "Information Technology"
  },
  "user": {
    "email": "jennytan@gmail.com",
    "id": 1,
    "is_active": true,
    "name": "Jenny Tan",
    "role": "employee"
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Update employee

Endpoint: PUT /api/hr/employee/:employeeId

Request Header:

- Authorization: token

```json
{
  "id": 1,
  "join_date": "2022-08-01T00:00:00.000Z",
  "position": "Junior",
  "status": "probation",
  "department_id": 1
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Search employee

Endpoint: GET /api/employees

- name: string, employee name, optional
- page: number, default 1
- size: number, default 10

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": [
    {
      "id": 1,
      "join_date": "2022-08-01T00:00:00.000Z",
      "position": "Junior",
      "status": "probation",
      "department": {
        "id": 1,
        "name": "IT",
        "description": "Information Technology"
      },
      "user": {
        "email": "jennytan@gmail.com",
        "id": 1,
        "is_active": true,
        "name": "Jenny Tan",
        "role": "employee"
      }
    }
  ],
  "paging": {
    "current_page": 1,
    "total_page": 10,
    "size": 10
  }
}
```
