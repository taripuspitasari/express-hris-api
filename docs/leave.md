# Leave Api Spec

## GET Leave

Endpoint: GET /api/leave/:leaveId

Request Header:

- Authorization: token

Response Body (success) :

```json
{
  "id": 12,
  "type": "annual_leave",
  "start_date": "2026-03-10T00:00:00.000Z",
  "end_date": "2026-03-12T00:00:00.000Z",
  "total_days": 3,
  "status": "approved",
  "reason": "Liburan keluarga",
  "rejection_reason": null,
  "created_at": "2026-03-05T08:21:10.000Z",
  "approved_at": "2026-03-06T10:00:00.000Z",
  "employee": {
    "id": 5,
    "employee_number": "EMP-0005",
    "fullname": "Budi Santoso",
    "department": "IT"
  },
  "approver": {
    "id": 2,
    "fullname": "Andi Wijaya"
  }
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Create Leave

Endpoint: POST /api/leaves

Request Header:

- Authorization: token

```json
{
  "type": "annual_leave",
  "start_date": "2026-03-20",
  "end_date": "2026-03-22",
  "reason": "Family vacation"
}
```

Response Body (success) :

```json
{
  "data": {
    "id": 1,
    "type": "sick_leave",
    "start_date": "2026-03-11T00:00:00.000Z",
    "end_date": "2026-03-11T00:00:00.000Z",
    "total_days": 1,
    "status": "pending",
    "reason": "Demam",
    "rejection_reason": null,
    "created_at": "2026-03-10T09:15:00.000Z",
    "approved_at": null,
    "employee": {
      "id": 7,
      "employee_number": "EMP-0007",
      "fullname": "Siti Rahma",
      "department": "Finance"
    },
    "approver": null
  },
  "message": "Leave requested"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Update leave

Endpoint PUT /api/leaves/:leaveId/status

Request Header:

- Authorization: token

```json
{
  "status": "rejected",
  "rejection_reason": "Tanggal tersebut sedang ada deadline project"
}
```

Response Body (success) :

```json
{
  "data": {
    "id": 12,
    "type": "annual_leave",
    "start_date": "2026-03-10T00:00:00.000Z",
    "end_date": "2026-03-12T00:00:00.000Z",
    "total_days": 3,
    "status": "rejected",
    "reason": "Liburan keluarga",
    "rejection_reason": "Tanggal tersebut sedang ada deadline project",
    "created_at": "2026-03-05T08:21:10.000Z",
    "approved_at": "2026-03-06T10:00:00.000Z",
    "employee": {
      "id": 5,
      "employee_number": "EMP-0005",
      "fullname": "Budi Santoso",
      "department": "IT"
    },
    "approver": {
      "id": 2,
      "fullname": "Andi Wijaya"
    }
  },
  "message": "Leave request updated successfully"
}
```

Response Body (failed) :

```json
{
  "errors": ""
}
```

## Get Personal Leave History

Endpoint: GET /api/leaves/history

- user_id: number, optional
- type: string, optional
- status: string, optional
- page: number, default 1
- size: number, default 8

Request Header:

- Authorization: token

```json
{
  "data": [
    {
      "id": 1,
      "type": "sick_leave",
      "start_date": "2026-03-11T00:00:00.000Z",
      "end_date": "2026-03-11T00:00:00.000Z",
      "total_days": 1,
      "status": "pending",
      "reason": "Demam",
      "rejection_reason": null,
      "created_at": "2026-03-10T09:15:00.000Z",
      "approved_at": null,
      "employee": {
        "id": 7,
        "employee_number": "EMP-0007",
        "fullname": "Siti Rahma",
        "department": "Finance"
      },
      "approver": null
    },
    {
      "id": 11,
      "type": "annual_leave",
      "start_date": "2026-03-10T00:00:00.000Z",
      "end_date": "2026-03-12T00:00:00.000Z",
      "total_days": 3,
      "status": "rejected",
      "reason": "Liburan keluarga",
      "rejection_reason": "Tanggal tersebut sedang ada deadline project",
      "created_at": "2026-03-05T08:21:10.000Z",
      "approved_at": "2026-03-06T10:00:00.000Z",
      "employee": {
        "id": 5,
        "employee_number": "EMP-0005",
        "fullname": "Budi Santoso",
        "department": "IT"
      },
      "approver": {
        "id": 2,
        "fullname": "Andi Wijaya"
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

## Search Leaves (admin/HR)

Endpoint: GET /api/leaves/report

- fullname: string, optional
- type: string, optional
- status: string, optional
- page: number, default 1
- size: number, default 8

Request Header:

- Authorization: token

```json
{
  "data": [
    {
      "id": 1,
      "type": "sick_leave",
      "start_date": "2026-03-11T00:00:00.000Z",
      "end_date": "2026-03-11T00:00:00.000Z",
      "total_days": 1,
      "status": "pending",
      "reason": "Demam",
      "rejection_reason": null,
      "created_at": "2026-03-10T09:15:00.000Z",
      "approved_at": null,
      "employee": {
        "id": 7,
        "employee_number": "EMP-0007",
        "fullname": "Siti Rahma",
        "department": "Finance"
      },
      "approver": null
    },
    {
      "id": 11,
      "type": "annual_leave",
      "start_date": "2026-03-10T00:00:00.000Z",
      "end_date": "2026-03-12T00:00:00.000Z",
      "total_days": 3,
      "status": "rejected",
      "reason": "Liburan keluarga",
      "rejection_reason": "Tanggal tersebut sedang ada deadline project",
      "created_at": "2026-03-05T08:21:10.000Z",
      "approved_at": "2026-03-06T10:00:00.000Z",
      "employee": {
        "id": 5,
        "employee_number": "EMP-0005",
        "fullname": "Budi Santoso",
        "department": "IT"
      },
      "approver": {
        "id": 2,
        "fullname": "Andi Wijaya"
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
