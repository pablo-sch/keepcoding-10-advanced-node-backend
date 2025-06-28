# NodePop API

`>` [◀️ **Go Back**](README.md)

## Note

To test the API open the swagger page in the project.

---

## Auth

### POST /api/login

**Summary:** Login user and return JWT token  
**Description:** Authenticates the user with email and password and returns a JWT token along with user info.

#### Request Body (application/json)

| Field    | Type   | Description          | Required |
| -------- | ------ | -------------------- | -------- |
| email    | string | User's email address | Yes      |
| password | string | User's password      | Yes      |

#### Example Request Body

```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

#### Response 200 (application/json)

| Field    | Type   | Description                          | Example          |
| -------- | ------ | ------------------------------------ | ---------------- |
| message  | string | Login successful message             | Login successful |
| tokenJWT | string | JWT token for authenticated requests | eyJhbGciOiJI...  |
| user     | object | User information                     |                  |

#### Example Response

```json
{
  "message": "Login successful",
  "tokenJWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "12345",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "avatar.jpg"
  }
}
```

#### Response 401

Invalid credentials

---

## **Posts**

### GET /api/posts

**Summary:** Get a list of posts for the authenticated user (Supports filtering)  
**Description:** Returns a list of posts belonging to the authenticated user. Supports filtering by name or tag, pagination, sorting, and field selection.

#### Query Parameters

| Name   | Type    | Description                                                 |
| ------ | ------- | ----------------------------------------------------------- |
| name   | string  | Filter posts by name (case-insensitive, partial match)      |
| tag    | string  | Filter posts by exact tag                                   |
| limit  | integer | Maximum number of posts to return (default 6)               |
| skip   | integer | Number of posts to skip (used for pagination)               |
| sort   | string  | Field to sort the results by                                |
| fields | string  | Comma-separated list of fields to return                    |
| count  | boolean | If true, also returns the total count of matching documents |

#### Response 200 (application/json)

| Field   | Type    | Description                   | Example |
| ------- | ------- | ----------------------------- | ------- |
| results | array   | List of posts                 |         |
| count   | integer | Total count of matching posts | 42      |

#### Example Request with Query Parameters

**GET** /api/posts?name=phone&tag=mobile&limit=5&sort=price

#### Example Response

```json
{
  "results": [
    {
      "id": "1",
      "name": "Smartphone X",
      "price": 799.99,
      "tag": "mobile",
      "photo": "smartphonex.jpg"
    },
    {
      "id": "2",
      "name": "Smartphone Y",
      "price": 699.99,
      "tag": "mobile",
      "photo": "smartphoney.jpg"
    }
  ],
  "count": 2
}
```

#### Response 401

Unauthorized - Missing or invalid JWT token

---

### POST /api/posts

**Tags:** Posts  
**Summary:** Create a new post  
**Description:** Creates a new post for the authenticated user. The image is optional; if none is uploaded, a default placeholder image is assigned.

#### Request Body (multipart/form-data)

| Field | Type   | Description                    | Required | Enum                           |
| ----- | ------ | ------------------------------ | -------- | ------------------------------ |
| name  | string | The name of the product        | Yes      |                                |
| price | number | The price of the product       | Yes      |                                |
| tag   | string | The tag or category of product | Yes      | work, lifestyle, motor, mobile |
| photo | file   | Optional image file of product | No       |                                |

#### Example Request Body (form-data)

- name: "Office Chair"
- price: 120.50
- tag: "work"
- photo: (file upload)

#### Response 201 (application/json)

Returns the created post object.

#### Example Response

```json
{
  "id": "123",
  "name": "Office Chair",
  "price": 120.5,
  "tag": "work",
  "photo": "office-chair.jpg"
}
```

#### Response 400

Invalid input data.

---

### GET /api/posts/{postId}

**Tags:** Posts  
**Summary:** Get a specific post by ID  
**Description:** Retrieves a single post that belongs to the authenticated user.

#### Path Parameters

| Name   | Type   | Description        | Required |
| ------ | ------ | ------------------ | -------- |
| postId | string | The ID of the post | Yes      |

#### Response 200 (application/json)

Returns the requested post.

#### Example Request with Query Parameters

**GET** /api/posts/123

#### Example Response

```json
{
  "id": "123",
  "name": "Office Chair",
  "price": 120.5,
  "tag": "work",
  "photo": "office-chair.jpg"
}
```

#### Response 404

Post not found or does not belong to the user.

---

### PUT /api/posts/{postId}

**Tags:** Posts  
**Summary:** Update a post  
**Description:** Updates a post that belongs to the authenticated user. If a new image is uploaded, it replaces the old one.

#### Path Parameters

| Name   | Type   | Description        | Required |
| ------ | ------ | ------------------ | -------- |
| postId | string | The ID of the post | Yes      |

#### Request Body (multipart/form-data)

| Field | Type   | Description       | Required |
| ----- | ------ | ----------------- | -------- |
| name  | string | Name of the post  | No       |
| price | number | Price of the post | No       |
| tag   | string | Tag of the post   | No       |
| photo | file   | New image file    | No       |

#### Example Request Body (form-data)

- name: "Ergonomic Office Chair"
- price: 135.00
- photo: (file upload)

#### Response 200 (application/json)

Post updated successfully.

#### Example Request with Query Parameters

**PUT** /api/posts/123

#### Example Response

```json
{
  "id": "123",
  "name": "Ergonomic Office Chair",
  "price": 135.0,
  "tag": "work",
  "photo": "ergonomic-chair.jpg"
}
```

#### Response 404

Post not found or not owned by the user.

---

### DELETE /api/posts/{postId}

**Tags:** Posts  
**Summary:** Delete a post  
**Description:** Deletes a post that belongs to the authenticated user. If the post includes an image (other than the placeholder), the image file will be removed.

#### Path Parameters

| Name   | Type   | Description        | Required |
| ------ | ------ | ------------------ | -------- |
| postId | string | The ID of the post | Yes      |

#### Example Request with Query Parameters

**DELETE** /api/posts/123

#### Response 200

Post deleted successfully.

#### Response 401

Unauthorized. The post does not belong to the user.

#### Response 404

Post not found.
