# PARA Web API Documentation

This documentation provides a comprehensive reference for the PARA Web backend API.

**Base URL:** `http://localhost:3000`
**Authentication:** All protected endpoints require a `Authorization: Bearer <token>` header.

---

## 1. Authentication & User (`/api/auth`, `/api/user`)

### Register
Create a new user account.
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Authentication:** None
- **Request Body:**
  ```json
  {
      "email": "user@example.com", // Required
      "password": "password123"    // Required
  }
  ```
- **Response (201 Created):**
  ```json
  {
      "message": "User registered successfully",
      "token": "eyJhbGci...",
      "user": {
          "id": "uuid-string",
          "email": "user@example.com",
          "is_verified": false
      }
  }
  ```

### Login
Authenticate a user.
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Authentication:** None
- **Request Body:**
  ```json
  {
      "email": "user@example.com", // Required
      "password": "password123"    // Required
  }
  ```
- **Response (200 OK):**
  ```json
  {
      "message": "Login successful",
      "token": "eyJhbGci...",
      "user": {
          "id": "uuid-string",
          "email": "user@example.com",
          "is_verified": false,
          "last_login_at": "2024-01-22T10:00:00.000Z"
      }
  }
  ```

### Get Current User Profile
- **URL:** `/api/user/me`
- **Method:** `GET`
- **Authentication:** Required
- **Response (200 OK):**
  ```json
  {
      "id": "uuid-string",
      "email": "user@example.com",
      "is_verified": false,
      "created_at": "...",
      "updated_at": "..."
      // password_hash is excluded
  }
  ```

### Update Current User Profile
Currently only supports password updates.
- **URL:** `/api/user/me`
- **Method:** `PATCH`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
      "password": "newPassword456" // Required
  }
  ```
- **Response (200 OK):** returns updated user profile object.

### Delete Current User (Soft Delete)
- **URL:** `/api/user/me`
- **Method:** `DELETE`
- **Authentication:** Required
- **Response (200 OK):**
  ```json
  {
      "message": "User deleted successfully"
  }
  ```

---

## 2. Folders (`/api/folders`)

### Get All Folders
- **URL:** `/api/folders`
- **Method:** `GET`
- **Query Params:**
  - `type` (optional): Filter by folder type (e.g., `PROJECT`, `AREA`, `RESOURCE`, `ARCHIVE`).
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Lấy danh sách Folders thành công!",
      "data": [
          {
              "id": "uuid",
              "name": "My Project",
              "type": "PROJECT",
              "status": "ACTIVE",
              ...
          }
      ]
  }
  ```

### Get Folder By ID
- **URL:** `/api/folders/:id`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Lấy thông tin Folder thành công",
      "data": { ...folderDetails }
  }
  ```

### Create Folder
- **URL:** `/api/folders`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "name": "New Project", // Required
      "type": "PROJECT"      // Required: PROJECT, AREA, RESOURCE, ARCHIVE
  }
  ```
- **Response (201 Created):**
  ```json
  {
      "success": true,
      "message": "Tạo Folder thành công!",
      "data": { ...newFolder }
  }
  ```

### Update Folder
- **URL:** `/api/folders/:id`
- **Method:** `PUT` (Method is technically `PUT` but acts like `PATCH` for provided fields)
- **Request Body** (Any combination of):
  ```json
  {
      "name": "Updated Name",
      "type": "ARCHIVE",
      "status": "COMPLETED",
      "target_outcome": "Goal description",
      "due_date": "2024-12-31T00:00:00Z",
      "completed_at": "2024-01-01T00:00:00Z"
  }
  ```
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Cập nhật Folder thành công!",
      "data": { ...updatedFolder }
  }
  ```

### Delete Folder (Soft Delete)
- **URL:** `/api/folders/:id`
- **Method:** `DELETE`
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Xóa Folder thành công"
  }
  ```

---

## 3. Notes (`/api/notes`)

### Get All Notes
- **URL:** `/api/notes`
- **Method:** `GET`
- **Query Params:**
  - `folderId` (optional): Filter by folder.
  - `search` (optional): Search term.
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "data": [ ...arrayOfNotes ]
  }
  ```

### Get Note Details (with Blocks)
- **URL:** `/api/notes/:id`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "data": {
          "note": { ...noteMetadata },
          "blocks": [ ...arrayOfBlocks ]
      }
  }
  ```

### Create Note
- **URL:** `/api/notes`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "folder_id": "uuid-folder", // Required
      "title": "My Note",         // Required
      "blocks": [                 // Optional initial blocks
          {
              "block_type": "text",
              "content": { "text": "Hello" },
              "position": 1
          }
      ]
  }
  ```
- **Response (201 Created):**
  ```json
  {
      "success": true,
      "message": "Note created successfully",
      "data": { ...newNote }
  }
  ```

### Update Note (Metadata)
- **URL:** `/api/notes/:id`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  {
      "title": "New Title"
  }
  ```
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "data": { ...updatedNote }
  }
  ```

### Delete Note
- **URL:** `/api/notes/:id`
- **Method:** `DELETE`
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Note deleted"
  }
  ```

### Add Block to Note
- **URL:** `/api/notes/:id/blocks`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "block_type": "text", // Required (text, image, heading, etc.)
      "content": { "text": "Content here" }, // Required (JSON)
      "position": 10 // Required
  }
  ```
- **Response (201 Created):**
  ```json
  {
      "success": true,
      "data": { ...newBlock }
  }
  ```

### Tag Operations on Notes
Note-Tag relationships are managed via these endpoints.

- **Get Tags of a Note:** `GET /api/notes/:noteId/tags`
- **Add Tag to Note:** `POST /api/notes/:noteId/tags`
  - Body: `{ "tagId": "uuid-tag" }`
- **Remove Tag from Note:** `DELETE /api/notes/:noteId/tags/:tagId`

---

## 4. Blocks (`/api/blocks`)

### Update Block Content
- **URL:** `/api/blocks/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
      "content": { "text": "Updated content" }
      // block_type can also be updated if needed
  }
  ```
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "data": { ...updatedBlock }
  }
  ```

### Reorder Blocks
- **URL:** `/api/blocks/reorder`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  {
      "blocks": [
          { "id": "block-id-1", "position": 1 },
          { "id": "block-id-2", "position": 2 }
      ]
  }
  ```
- **Response (200 OK):**
  ```json
  {
      "success": true,
      "message": "Blocks reordered"
  }
  ```

---

## 5. Tasks (`/api/tasks`)

### Get All Tasks
- **URL:** `/api/tasks`
- **Method:** `GET`
- **Query Params:** `folderId`, `noteId`, `status`.
- **Response (200 OK):**
  ```json
  { "success": true, "data": [ ...tasks ] }
  ```

### Create Task
- **URL:** `/api/tasks`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "folder_id": "uuid", // Required
      "title": "Buy milk", // Required
      "note_id": "uuid",   // Optional
      "priority": 1,       // Optional (default 2)
      "due_date": "2024-01-30" // Optional
  }
  ```
- **Response (201 Created):**
  ```json
  { "success": true, "data": { ...newTask } }
  ```

### Update Task
- **URL:** `/api/tasks/:id`
- **Method:** `PUT`
- **Request Body:** Any task fields (title, priority, etc).
- **Response (200 OK):**
  ```json
  { "success": true, "data": { ...updatedTask } }
  ```

### Update Task Status
- **URL:** `/api/tasks/:id/status`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  {
      "status": "DONE" // Required: TODO, IN_PROGRESS, DONE
  }
  ```
- **Response (200 OK):**
  ```json
  { "success": true, "message": "Task status updated" }
  ```

### Delete Task
- **URL:** `/api/tasks/:id`
- **Method:** `DELETE`
- **Response (200 OK):**
  ```json
  { "success": true, "message": "Task deleted" }
  ```

---

## 6. Tags (`/api/tags`)

### Get All Tags
- **URL:** `/api/tags`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  { "success": true, "data": [ ...tags ] }
  ```

### Create Tag
- **URL:** `/api/tags`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "name": "Urgent",    // Required
      "color": "#ff0000"   // Optional
  }
  ```
- **Response (201 Created):**
  ```json
  { "success": true, "data": { ...newTag } }
  ```

### Delete Tag
- **URL:** `/api/tags/:id`
- **Method:** `DELETE`
- **Response (200 OK):**
  ```json
  { "success": true, "message": "Tag deleted" }
  ```
