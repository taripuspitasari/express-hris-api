# Department Api Spec

## Get department

Endpoint: GET /api/departments/:departmentId

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "id": 1,
  "name": "HR",
  "description": "Human Resource"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Create department

Endpoint: POST /api/departments/

Request Header:

- Authorization: token

```json
{
  "name": "HR",
  "description": "Human Resource"
}
```

Response Body (success) :

```json
{
  "id": 1,
  "name": "HR",
  "description": "Human Resource"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Update department

Endpoint: PUT /api/departments/:departmentId

Request Header:

- Authorization: token

```json
{
  "id": 1,
  "name": "HR edit",
  "description": "Human Resource edit"
}
```

Response Body (success) :

```json
{
  "id": 1,
  "name": "HR edit",
  "description": "Human Resource edit"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Remove department

Endpoint: DELETE /api/departments/:deparmentId

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "message": "Department deleted succesfully"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Search department

Endpoint: GET /api/departments

- name : string, department name, optional
- page : number, default 1
- size : number, default 10

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "data": [
    {
      "id": 1,
      "name": "HR edit",
      "description": "Human Resource edit"
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
