# Auth User API documentation

The Auth User API provides endpoints specifically designed for user authentication and authorization within the system. These endpoints handle user login, user register, and related authentication operations. The API ensures secure access to protected resources by authenticating users and managing their access tokens.

## Register User API documentation
This API endpoint allows a new user to register by providing the necessary information such as name, username, email, password, profile picture, and other required details. Upon successful registration, the API returns a response with the user's details and an authentication token.

## Endpoint

`POST /api/auth/register`

### Request Body & Header :

The request body should be in JSON format and include the following fields:

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe123",
    "email": "johndoe@example.com",
    "password": "P@ssw0rd!",
    "pin": "123456",
    "profile_picture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QB0RXhpZgAATU0AKgAAAAgAFAIaAAUAAAABAAAAFgAAAA8AAAABAAAJAAAABAAAAMgAAAAAAKgrAAAAEAAAKhAAAAP//AABEIAMIBAwMBIgACEQEDEQH/xA..."
}

```

### Response Body and Header : 

<details>
<summary>201 Created</summary>

### Response Body & Header :

> | name      |  value     | data type               | description                                                           |
> |-------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Content-Type|  application/json | string   | N/A  |

```json
{
    "id": "xxxxx",
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "username": "johndoe",
    "verified": true,
    "profile_picture": "http://example.com/storage/profile_picture.jpeg",
    "balance": 1000,
    "card_number": "1234567812345678",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTY4MjcwNjI0MCwiZXhwIjoxNjgyNzA5ODQwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
}


```
</details>

<details>
<summary>400 Bad Request</summary>

### Response Body & Header :

> | name      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |

```json
{
    "message": "Account already exists",
}
``` 
</details>

## Login User API documentation

The Login User API endpoint facilitates the authentication process for users within the system. This endpoint allows users to securely log in by providing their credentials, such as username/email and password. Upon successful authentication, the API generates an access token that can be used to authorize subsequent requests to protected resources.

## Endpoint

`POST /api/auth/login`

### Request Body & Header :

The request body should be in JSON format and include the following fields:

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |

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
    "id": "xxxxx",
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe@example.com",
    "username": "johndoe",
    "verified": true,
    "profile_picture": "http://example.com/storage/profile_picture.jpeg",
    "balance": 1000,
    "card_number": "1234567812345678",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTY4MjcwNjI0MCwiZXhwIjoxNjgyNzA5ODQwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
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
</details>

## Logout User API documentation

The Logout User API provides a mechanism for users to securely log out of a system or application. Upon successful invocation, it terminates the user's current session, revokes any associated authentication tokens, and invalidates session cookies, ensuring that the user is no longer authenticated or authorized to access protected resources.

## Endpoint

`POST /api/auth/logout`

### Request Body & Header :

The request header should be in include the following fields:

> | header      |  value     |
> |-------------|-----------|
> | Content-Type|  application/json |
> | Authorization|  Bearer eyJ0eXAiOiJKV1... |


### Response Body and Header : 

<details>
<summary>200 OK</summary>

### Response Body & Header :

> | name      |  value     | data type               | description                                                           |
> |-------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Content-Type|  application/json | string   | N/A  |

```json
{
    "message" :"success"
}
```
</details>

<details>
<summary>401 Unauthorized</summary>

### Response Body & Header :

> | name      |  value     | data type               | description                                                           |
> |-------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | Content-Type|  application/json | string   | N/A  |

```json
{
    "message": "Invalid credentials",
}
``` 
</details>
