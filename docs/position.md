# Position API Spec

## Get position

Endpoint: GET api/positions/:positionId

Request Header:

- Authorization: token

Response Body (success):

```json
{
  "id": 1,
  "name": "HR Staff",
  "level": "Staff",
  "department": {
    "id": 1,
    "name": "HR"
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Create position

Endpoint: POST api/positions

Request Header:

- Authorization: token

```json
{
  "name": "HR Staff",
  "level": "Staff",
  "department_id": 1
}
```

Response Body (success):

```json
{
  "id": 1,
  "name": "HR Staff",
  "level": "Staff",
  "department": {
    "id": 1,
    "name": "HR"
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Update position

Endpoint: PUT api/positions/:positionId

Request Header:

- Authorization: token

```json
{
  "id": 1,
  "name": "HR Staff edit",
  "level": "Staff edit",
  "department_id": 99
}
```

Response Body (success):

```json
{
  "id": 1,
  "name": "HR Staff edit",
  "level": "Staff edit",
  "department": {
    "id": 99,
    "name": "IT"
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Remove position

Endpoint: DELETE api/positions/:positionId

Request Header:

- Authorization: token

Response Body (success):

```json
{
  "message": "Position deleted succesfully"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Search position

Endpoint: GET /api/positions

- name : string, department name, optional
- department_id : number, optional
- level: string, level name, optional
- page : number, default 1
- size : number, default 10

Request Header:

- Authorization: token

Response Body (success):

```json
{
  "data": [
    {
      "id": 1,
      "name": "HR Staff",
      "level": "Staff",
      "department": {
        "id": 1,
        "name": "HR"
      }
    },
    {
      "id": 2,
      "name": "HR Manager",
      "level": "Manager",
      "department": {
        "id": 1,
        "name": "HR"
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

Response Body (failed) :

```json
{
  "errors": ""
}
```
