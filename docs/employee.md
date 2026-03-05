# Employee Api Spec

## Promote Employee

Endpoint: POST /api/employees/promote

Request Header:

- Authorization: token

```json
{
  "person_id": 1,
  "position_id": 2,
  "department_id": 3,
  "join_date": "2022-08-01T00:00:00.000Z",
  "status": "active"
}
```

Response Body (success):

```json
{
  "message": "Employee created successfully.",
  "data": {
    "id": 1,
    "employee_number": "EMP-00001",
    "join_date": "2022-08-01T00:00:00.000Z",
    "status": "active",
    "profile": {
      "id": 1,
      "email": "jennytan@gmail.com",
      "fullname": "Jenny Tan",
      "phone": "08900987708",
      "gender": "female",
      "birthdate": "2022-08-01"
    },
    "position": {
      "id": 1,
      "name": "Junior"
    },
    "department": {
      "id": 1,
      "name": "IT"
    }
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Get employee

Endpoint: GET /api/employees/:employeeId

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": {
    "id": 1,
    "employee_number": "EMP-00001",
    "join_date": "2022-08-01T00:00:00.000Z",
    "status": "active",
    "profile": {
      "id": 1,
      "email": "jennytan@gmail.com",
      "fullname": "Jenny Tan",
      "phone": "08900987708",
      "gender": "female",
      "birthdate": "2022-08-01"
    },
    "position": {
      "id": 1,
      "name": "Junior"
    },
    "department": {
      "id": 1,
      "name": "IT"
    }
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

Endpoint: PUT /api/employees/:employeeId

Request Header:

- Authorization: token

```json
{
  "id": 1,
  "position_id": 2,
  "department_id": 3,
  "join_date": "2022-08-01T00:00:00.000Z",
  "status": "active"
}
```

Response Body (success) :

```json
{
  "message": "Employee updated successfully.",
  "data": {
    "id": 1,
    "employee_number": "EMP-00001",
    "join_date": "2022-08-01T00:00:00.000Z",
    "status": "active",
    "profile": {
      "id": 1,
      "email": "jennytan@gmail.com",
      "fullname": "Jenny Tan",
      "phone": "08900987708",
      "gender": "female",
      "birthdate": "2022-08-01"
    },
    "position": {
      "id": 1,
      "name": "Junior"
    },
    "department": {
      "id": 1,
      "name": "IT"
    }
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Offboard Employee

Endpoint: DELETE /api/employees/:employeeId

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "message": "Employee offboarded and access revoked successfully."
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

- fullname: string, optional
- status: string, optional
- employee_number: string, optional
- department_id: number, optional
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
      "employee_number": "EMP-00001",
      "join_date": "2022-08-01T00:00:00.000Z",
      "status": "active",
      "profile": {
        "id": 1,
        "email": "jennytan@gmail.com",
        "fullname": "Jenny Tan",
        "phone": "08900987708",
        "gender": "female",
        "birthdate": "2022-08-01"
      },
      "position": {
        "id": 1,
        "name": "Junior"
      },
      "department": {
        "id": 1,
        "name": "IT"
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
