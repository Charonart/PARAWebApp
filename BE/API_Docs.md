# PARA Web API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📌 Health Check

### `GET /api/health`
Check if the server is running.

**Auth Required:** No

**Response:**
```json
{
  "status": "OK",
  "message": "Server PARA đang chạy tốt với Express!"
}
```

---

## 🔐 Auth

### `POST /api/auth/register`
Register a new user.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "d79e042a-e283-4a89-97e9-65ac8e712751",
    "email": "user@example.com",
    "is_verified": false
  }
}
```

**Errors:**
- `400` - Email and password are required
- `409` - Email is already registered

---

### `POST /api/auth/login`
Login and get JWT token.

**Auth Required:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "d79e042a-e283-4a89-97e9-65ac8e712751",
    "email": "user@example.com",
    "is_verified": false,
    "last_login_at": "2026-01-30T12:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Email and password are required
- `401` - Invalid email or password

---

### `GET /api/user/me`
Get current user profile.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "d79e042a-e283-4a89-97e9-65ac8e712751",
    "email": "user@example.com",
    "is_verified": false,
    "created_at": "2026-01-15T10:00:00.000Z",
    "last_login_at": "2026-01-30T12:00:00.000Z"
  }
}
```

---

### `PATCH /api/user/me`
Update user password.

**Auth Required:** Yes

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## 📊 Dashboard

### `GET /api/dashboard/stats`
Get dashboard statistics.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_projects_active": 5,
    "total_tasks_todo": 12,
    "total_notes_week": 8,
    "storage_usage": "15 kB"
  }
}
```

---

## 📁 Folders

### `GET /api/folders`
Get all folders.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Filter by type: `PROJECT`, `AREA`, `RESOURCE`, `ARCHIVE` |
| `limit` | number | Limit number of results |
| `sort` | string | Sort by field (e.g., `due_date`, `created_at DESC`) |

**Example:** `GET /api/folders?type=PROJECT&limit=3&sort=due_date`

**Response (200):**
```json
{
  "success": true,
  "message": "Lấy danh sách Folders thành công!",
  "data": [
    {
      "id": "a1b2c3d4-...",
      "user_id": "d79e042a-...",
      "name": "Website Redesign",
      "type": "PROJECT",
      "status": "ACTIVE",
      "target_outcome": "Launch by Q2",
      "due_date": "2026-06-30",
      "completed_at": null,
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-20T15:30:00.000Z",
      "deleted_at": null
    }
  ]
}
```

---

### `GET /api/folders/:id`
Get a specific folder.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Lấy thông tin Folder thành công",
  "data": {
    "id": "a1b2c3d4-...",
    "user_id": "d79e042a-...",
    "name": "Website Redesign",
    "type": "PROJECT",
    "status": "ACTIVE",
    "target_outcome": "Launch by Q2",
    "due_date": "2026-06-30",
    "completed_at": null,
    "created_at": "2026-01-15T10:00:00.000Z",
    "updated_at": "2026-01-20T15:30:00.000Z",
    "deleted_at": null
  }
}
```

**Errors:**
- `404` - Folder không tồn tại hoặc bạn không có quyền

---

### `POST /api/folders`
Create a new folder.

**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "New Project",
  "type": "PROJECT"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Folder name |
| `type` | string | Yes | `PROJECT`, `AREA`, `RESOURCE`, `ARCHIVE` |

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo Folder thành công!",
  "data": {
    "id": "a1b2c3d4-...",
    "user_id": "d79e042a-...",
    "name": "New Project",
    "type": "PROJECT",
    "status": null,
    "created_at": "2026-01-30T12:00:00.000Z",
    "updated_at": "2026-01-30T12:00:00.000Z"
  }
}
```

---

### `PUT /api/folders/:id`
Update a folder.

**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "Updated Name",
  "type": "AREA",
  "status": "ACTIVE",
  "target_outcome": "Complete by Q2",
  "due_date": "2026-06-30",
  "completed_at": "2026-06-15"
}
```

All fields are optional.

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật Folder thành công!",
  "data": { ... }
}
```

---

### `DELETE /api/folders/:id`
Soft delete a folder.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Xóa Folder thành công"
}
```

---

## 📝 Notes

### `GET /api/notes`
Get all notes.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `folderId` | string | Filter by folder |
| `search` | string | Search by title |
| `limit` | number | Limit results |
| `sort` | string | Sort field |

**Example:** `GET /api/notes?limit=4&sort=created_at DESC`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "n1b2c3d4-...",
      "folder_id": "a1b2c3d4-...",
      "title": "Meeting Notes",
      "created_at": "2026-01-28T10:00:00.000Z",
      "updated_at": "2026-01-28T15:30:00.000Z",
      "deleted_at": null
    }
  ]
}
```

---

### `GET /api/notes/:id`
Get note with blocks.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "note": {
      "id": "n1b2c3d4-...",
      "folder_id": "a1b2c3d4-...",
      "title": "Meeting Notes",
      "created_at": "2026-01-28T10:00:00.000Z",
      "updated_at": "2026-01-28T15:30:00.000Z"
    },
    "blocks": [
      {
        "id": "b1b2c3d4-...",
        "note_id": "n1b2c3d4-...",
        "block_type": "text",
        "content": { "text": "Discussion points..." },
        "position": 1
      }
    ]
  }
}
```

---

### `POST /api/notes`
Create a note with optional blocks.

**Auth Required:** Yes

**Request Body:**
```json
{
  "folder_id": "a1b2c3d4-...",
  "title": "My First Note",
  "blocks": [
    {
      "block_type": "text",
      "content": { "text": "Hello World" },
      "position": 1
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `folder_id` | string | Yes | Parent folder ID |
| `title` | string | Yes | Note title |
| `blocks` | array | No | Initial blocks |

**Response (201):**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "note": { ... },
    "blocks": [ ... ]
  }
}
```

---

### `PATCH /api/notes/:id`
Update note metadata.

**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Updated Title"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### `POST /api/notes/:id/blocks`
Add a block to a note.

**Auth Required:** Yes

**Request Body:**
```json
{
  "block_type": "image",
  "content": { "url": "http://example.com/image.png" },
  "position": 2
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "b1b2c3d4-...",
    "note_id": "n1b2c3d4-...",
    "block_type": "image",
    "content": { "url": "http://example.com/image.png" },
    "position": 2
  }
}
```

---

### `DELETE /api/notes/:id`
Soft delete a note.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Note deleted"
}
```

---

## 🧱 Blocks

### `PUT /api/blocks/:id`
Update a block.

**Auth Required:** Yes

**Request Body:**
```json
{
  "content": { "text": "Updated content" }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### `PATCH /api/blocks/reorder`
Reorder blocks.

**Auth Required:** Yes

**Request Body:**
```json
{
  "blocks": [
    { "id": "block-id-1", "position": 2 },
    { "id": "block-id-2", "position": 1 }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Blocks reordered"
}
```

---

## ✅ Tasks

### `GET /api/tasks`
Get all tasks.

**Auth Required:** Yes

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `folderId` | string | Filter by folder |
| `noteId` | string | Filter by note |
| `status` | string | Filter by status: `TODO`, `IN_PROGRESS`, `DONE` |
| `limit` | number | Limit results |
| `sort` | string | Sort field |

**Example:** `GET /api/tasks?status=TODO&limit=5`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "t1b2c3d4-...",
      "folder_id": "a1b2c3d4-...",
      "note_id": null,
      "title": "Complete API docs",
      "status": "TODO",
      "priority": 1,
      "due_date": "2026-02-15",
      "created_at": "2026-01-28T10:00:00.000Z",
      "updated_at": "2026-01-28T15:30:00.000Z"
    }
  ]
}
```

---

### `POST /api/tasks`
Create a task.

**Auth Required:** Yes

**Request Body:**
```json
{
  "folder_id": "a1b2c3d4-...",
  "title": "New Task",
  "priority": 1,
  "due_date": "2026-02-15"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `folder_id` | string | Yes | Parent folder ID |
| `title` | string | Yes | Task title |
| `note_id` | string | No | Link to a note |
| `priority` | number | No | 1 (high) to 3 (low), default 2 |
| `due_date` | string | No | ISO date |

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### `PUT /api/tasks/:id`
Update a task.

**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Updated Title",
  "priority": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### `PATCH /api/tasks/:id/status`
Update task status.

**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "DONE"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task status updated"
}
```

---

### `DELETE /api/tasks/:id`
Soft delete a task.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted"
}
```

---

## 🏷️ Tags

### `GET /api/tags`
Get all user tags.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "tag-id-1",
      "user_id": "d79e042a-...",
      "name": "Important",
      "color": "#FF0000"
    }
  ]
}
```

---

### `POST /api/tags`
Create a tag.

**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "Important",
  "color": "#FF0000"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### `DELETE /api/tags/:id`
Delete a tag.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Tag deleted"
}
```

---

### `GET /api/notes/:noteId/tags`
Get tags for a note.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": "tag-id-1", "name": "Important", "color": "#FF0000" }
  ]
}
```

---

### `POST /api/notes/:noteId/tags`
Add tag to a note.

**Auth Required:** Yes

**Request Body:**
```json
{
  "tagId": "tag-id-1"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tag added to note"
}
```

---

### `DELETE /api/notes/:noteId/tags/:tagId`
Remove tag from a note.

**Auth Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Tag removed from note"
}
```

---

## Error Responses

All endpoints may return these errors:

| Status | Message |
|--------|---------|
| `400` | Bad Request - Missing required fields |
| `401` | Unauthorized - Invalid or missing token |
| `403` | Forbidden - No permission |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error |

```json
{
  "success": false,
  "message": "Error description"
}
```
