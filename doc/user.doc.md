# User API documentation

The User API provides endpoints for managing user-related functionalities within the system. These endpoints enable interaction with user data, allowing clients to retrieve user information, search for users by username, and update user profiles. The API facilitates seamless user management and ensures efficient handling of user-related operations.

## Get Data User API documentation
Retrieve detailed information about a specific user identified by their unique user ID.
## Endpoint
`POST /api/user`

### Request Header :

The request header should be in include the following fields:

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |
> | Authorization|  Bearer eyJ0eXAiOiJKV1... |

### Response Body and Header : 

<details>
<summary>200 OK</summary>

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "username": "johndoe",
    "verified": true,
    "profile_picture": "http://example.com/storage/profile_picture.jpeg",
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z",
    "balance": 1000,
    "card_number": "1234567812345678",
}
```
</details>

<details>
<summary>401 Unauthorized</summary>

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |

```json
{
    "message": "Unauthorized",
}
```
</details>

## Search User API documentation

The Search User by Username API endpoint enables clients to search for users within the system based on their username. This endpoint provides a convenient way to locate specific users and retrieve their details.

## Endpoint
`POST /api/user/:username`

### Request Header :

The request header should be in include the following fields:

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |
> | Authorization|  Bearer eyJ0eXAiOiJKV1... |

### Response Body and Header : 

<details>
<summary>200 OK</summary>

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |

```json
{
    "id": 14,
    "username": "johndoe",
    "verified": 1,
    "profile_picture": "http://example.com/storage/profile_picture.jpeg"
}
```
</details>
<details>
<summary>404 Not Found</summary>

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |

```json
{
    "message": "User not found"
}
```
</details>

## Update User API documentation (Cooming Soon)

<!-- The Update User API endpoint allows clients to update the profile information of a specific user within the system. This endpoint provides a mechanism for users to modify their account details, such as name, email, profile picture, and other relevant information.

## Endpoint

`PUT /api/user`

### Request Body & Header :

The request body should be in JSON format and include the following fields:

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |
> | Authorization|  Bearer eyJ0eXAiOiJKV1... |

```json
{
    "email": "johndoe@example.com",
    "password": "P@ssw0rd!",
}

```

### Response Body and Header : 

<details>
<summary>200 OK</summary>

### Response Body & Header :

> | name      |  value     | data type               | description                                                           |
> |-------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Content-Type|  application/json | string   | N/A  |

```json
{
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "username": "johndoe",
    "verified": 1,
    "profile_picture": "http://example.com/storage/profile_picture.jpeg",
}


```
</details>

<details>
<summary>400 Bad Request</summary>

### Response Body & Header :

> | name      |  value     | data type               | description                                                           |
> |-------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Content-Type|  application/json | string   | N/A  |

```json
{
    "message": "Invalid credentials",
}
``` 
</details> -->