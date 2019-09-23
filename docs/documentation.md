# <a name="toc">Routes</a>

- Authentication Routes

  - [`/login`](#login)
  - [`/register`](#register)

- User Routes

  - [`/user`](#user-root)
    - [GET](#user-get)
    - [PUT](#user-put)
    - [DELETE](#user-delete)

- Patient Routes

  - [`/patients`](#patient-root)
    - [GET](#patient-get)
    - [POST](#patient-post)
  - [`/patients/:id`](#patient-id)
  - [`/patients/:id/consent`](#patient-consent-root)
    - [GET](#patient-consent-get)
    - [POST](#patient-consent-post)
    - [DELETE](#patient-consent-delete)
  - [`/patients/:id/immunizations`](#patient-immunizations-root)
    - [GET](#patient-immunizations-get)
    - [POST](#patient-immunizations-post)

- Provider Routes
  - [`/providers`](#providers-root)
    - [GET](#providers-get)
  - [`/provders/:id`](#providers-id-root)
    - [GET](#providers-id-get)
    - [PUT](#providers-id-put)
- Immunization Routes
  - [`/immunizations`](#immunizations-root)
    - [GET](#immunizations-get)

## Authentication

### <a name="login">`/login`</a>

#### Description

This endpoint is responsible for logging a user. Upon successful authentication (_with valid username and password_), the endpoint will respond with a token. It will also return a boolean (_true or false_) which indicates if the user is a provider or not.

The receieved token will be used to access protected routes. Refer to the individual protected route for information on using the token.

#### Operation and Schemas

- POST

**Body Schema**:

```js
{
    "username": string,
    "password": string
}
```

**Output Schema**:

- 200 Success

```js
{
    "token": string,
    "isProvider": boolean
}
```

- 400 Bad Request

Request is missing either or both username and password.

- 401 Unauthorized

Credentials invalid.

[Back to top](#toc)

---

### <a name="register">`/register`</a>

#### Description

Endpoint is responsible for registering a user. Upon successful registration, the server will save received data and respond with a token, which can be used to immediately log the user. It will also return a boolean (_true or false_) which indicates if the user is a provider or not.

The received token will be used to access protected routes. Refer to the individual protected route for information on using the token.

#### Operation and Schemas

- POST

**Body Schema**:

```js
{
    "username": string,
    "password": string,
    "email": string,
    "providerName": string // optional, deprecated

}
```

**Output Schema**:

- 201 Created

```js
{
    "token": string,
    "isProvider": boolean
}
```

- 400 Bad Request

Check error message:

    * Missing username, password, or email
    * Email and/or username already exists

- 401 Unauthorized

Invalid credentials

[Back to top](#toc)

## Users

### <a name="user-root">`/user`</a>

#### Description

Endpoint representing the `user` resource. See `Operations and Schemas` for more information of each operation.

#### Operations and Schemas

---

This route is _protected_. A valid token retrieved either from `/login` or `/registration` is needed. Please check this [Stack Overflow Answer](https://stackoverflow.com/a/42879201) on information on how to pass this token along with the request with Axios.

---

<a name="user-get">**GET**</a>

Returns information about the current logged in user. There is no need to specify `userId`: the user ID is read from the token passed in the Authorization header with the request.

_Output Schema_:

- 200 OK

```js
{
    user: {
        "id": number,
        "username": string,
        "email": string,**6702803862**
        "providerId"?: number, // ? means it may or may not be there.
        "createdAt": DateString, // string with a formatted date
        "patients": array
    }
}
```

There is no `providerId` if the user account is not associated with a provider.

[Back to top](#toc)

<a name="user-put">**PUT**</a>

_Input Schema_:

```js
{
    "username"?: string, // ? means property is optional (doesn't have to be there).
    "password"?: string,
    "email"?: string
}
```

At least one property must exist in JSON body. Otherwise, the route will respond with `400 Bad Request`.

_Output Schema_:

- 200 OK

```js
{
    success: {
        // Will contain details of the updated user sans password
        "id": number,
        "username": string,
        "email": string,
        "createdAt": DateString, // string with a formatted date
        "patients": array
    }
}
```

[Back to top](#toc)

<a name="user-delete">**DELETE**</a>

_Output Schema_:

- 200 OK

```js
{
    "usersDeleted": number,
}
```

Returns the number of users deleted. This number should always be `1`. If it's more than `1`, contact the backend people.

If less than `1`, you should get a `404: Not Found` instead, signifying that the user cannot be found. Since the user to be deleted is identified by the token, a `404` may mean that the token is old and can be discarded. /_ Potentially inaccurate, will review - ER _/

[Back to top](#toc)

## Patients

### <a name="patient-root">`/patients`</a>

#### Description

Endpoint dealing with the `patient` resource. There are two operations, GET and POST. The GET operation will return an array of patients associated with the user. If the user is a provider, it will return an array of all patients that have given the provider consent. The POST operation will allow a user to add a new patient associated with its account, and will not function for a provider account.

---

This route is _protected_. A valid token retrieved either from `/login` or `/registration` is needed. Please check this [Stack Overflow Answer](https://stackoverflow.com/a/42879201) on information on how to pass this token along with the request with Axios.

---

#### Operation and Schemas

<a name="patient-get">**GET**</a>

_Output Schema_:

- 200 OK

```js
{
    "patients": array
}
```

[Back to top](#toc)

---

<a name="patient-post">**POST**</a>

_Input Schema_:

```js
{
    "firstName": string,
    "lastName": string,
    "birthDate": string // in this string format: `YYYY-MM-DD`
}
```

If you are handling date objects with either `moment.js` or natively, look into methods that can generate a string representation of the desired format.

_Output Schema_:

- 201 Created

```js
{
    "success": {
        // Returns the created patient
        "id": number,
        "firstName": string,
        "lastName": string,
        "birthDate": string,
        "userId": number,
        "createdAt": DateString // string with a formatted date
    }
}
```

[Back to top](#toc)

---

### <a name="patient-id">`/patients/:id`</a>

#### Description

Endpoint for an individual patient's information. Returns information for a single patient, if the user requesting the information is either the user associated with the patient, or a provider that the patient has given consent to. If the user is neither of these things, it will return 403 - Unauthorized.

---

This route is _protected_. A valid token retrieved either from `/login` or `/registration` is needed. Please check this [Stack Overflow Answer](https://stackoverflow.com/a/42879201) on information on how to pass this token along with the request with Axios.

---

#### Operations and Schemas

**GET**

_Output Schema_:

```js
{
    "patient": {
        "id": number,
        "firstName": string,
        "lastName": string,
        "birthDate": string,
        "userId": number,
        "createdAt": DateString // string with a formatted date
    }
}
```

### <a name="patient-consent-root">`/patients/:id/consent`</a>

#### Description

Endpoint that allows a user to give consent to a provider, or view providers a patient has given consent to. It has three operations, GET, POST, and DELETE. The GET operation will allow a user to view providers that have been given consent to handle a patient's information. The POST operation grants a provider consent to handle a patient's information. The DELETE operation takes away consent that has already been given to a specified provider.

---

This route is _protected_. A valid token retrieved either from `/login` or `/registration` is needed. Please check this [Stack Overflow Answer](https://stackoverflow.com/a/42879201) on information on how to pass this token along with the request with Axios.

---

#### Operations and Schemas

<a name="patient-consent-get">**GET**</a>

_Output Schema_:

```js
{
    "id": number, // the patient's ID
    "providers": string[] // an array of string titles of providers
}
```

[Back to top](#toc)

---

<a name="patient-consent-post">**POST**</a>

_Input Schema_:

```js
{
    "providerId": number, // The provider's ID
}
```

_Output Schema_:

- 201 Created

```js
{
    "success": {
        "patientId": number,
        "providerId": number,
        "createdAt": DateString // String with formatted date
    }
}
```

[Back to top](#toc)

---

<a name="patient-consent-delete">**DELETE**</a>

_Input Schema_:

```js
{
    "providerId": number
}
```

_Output Schema_:

- 200 OK

```js
{
    "providers": array
}
```

[Back to top](#toc)

### <a name="patient-immunizations-root">`/patients/:id/immunizations`</a>

#### Description

Endpoint that handles a patient's immunization history. It has two operations, GET and POST The GET endpoint can be used both by providers with consent from patient as well as a patient's associated user, and will return an array detailing a patient's immunization history. The POST endpoint is only usable by providers, and allows a provider to add a new immunization record to the patient's history.

---

This route is _protected_. A valid token retrieved either from `/login` or `/registration` is needed. Please check this [Stack Overflow Answer](https://stackoverflow.com/a/42879201) on information on how to pass this token along with the request with Axios.

---

#### Operations and Schemas

<a name="patient-immunizations-get">**GET**</a>

_Output Schema_:

- 200 OK

```js
{
    "history": array // An array of a patient's immunization history
}
```

[Back to top](#toc)

---

<a name="patient-immunizations-post">**POST**</a>

_Input Schema_:

```js
{
    "immunizationId": number,
    "appointmentDate": DateString
}
```

_Output Schema_:

- 201 CREATED

```js
{
    "success": {
        "patientId": number,
        "immunizationId": number,
        "appointmentDate": DateString,
        "providerId": number
    }
}
```

[Back to top](#toc)

### <a name="providers-root">`/providers`</a>

#### Description

Endpoint that handles queries related directly to information on the providers themselves. This endpoint only has one operation, GET, which will allow the user to view a list of all providers, including id, name, and when the provider entry was created.

---

This route is _protected_. A valid token retrieved either from `/login` or `/registration` is needed. Please check this [Stack Overflow Answer](https://stackoverflow.com/a/42879201) on information on how to pass this token along with the request with Axios.

---

#### Operations and Schemas

<a name="providers-get">**GET**</a>

_Output Schema_:

- 200 OK

```js
{
    "providers": array
}
```

[Back to top](#toc)

### <a name="providers-id-root">`/providers/:id`</a>

#### Description

Endpoint that handles queries directly pertaining to a specific provider. There are two operations handled by this endpoint, GET and PUT. The GET operation is available to any authenticated user, and will return the indicated provider's information. The POST operation cannot be used by an account that is not associated with the provider, and is used to update the provider's information. Note there is no DELETE operation at this endpoint - deletion of a provider should be handled through the `/user` endpoint, as the deletion of any user account associated with a provider will also trigger deletion of the provider entry.

---

This route is _protected_. A valid token retrieved either from `/login` or `/registration` is needed. Please check this [Stack Overflow Answer](https://stackoverflow.com/a/42879201) on information on how to pass this token along with the request with Axios.

---

#### Operations and Schemas

<a name="providers-id-get">**GET**</a>

_Output Schema_:

- 200 OK

```js
{
    "provider": {
        "id": number,
        "name": string,
        "createdAt": DateString
    }
}
```

[Back to top](#toc)

---

<a name="providers-id-put">**PUT**</a>

_Input Schema_:

```js
{
    "name": string
}
```

_Output Schema_:

- 200 OK

```js
{
    "success": {
        "id": number,
        "name": string,
        "createdAt": DateString
    }
}
```

[Back to top](#toc)

### <a name="immunizations-root">`/immunizations`</a>

#### Description

Endpoint that handles queries related to immunization information that is not related to any particular patient. This includes the id and name of the immunization in question. This endpoint has only one operation, GET, which can be used to retrieve a list of all immunizations.

---

This route is _protected_. A valid token retrieved either from `/login` or `/registration` is needed. Please check this [Stack Overflow Answer](https://stackoverflow.com/a/42879201) on information on how to pass this token along with the request with Axios.

---

#### Operations and Schemas

<a name="immunizations-get">**GET**</a>

_Output Schema_:

- 200 OK

```js
{
    "immunizations": array
}
```

[Back to top](#toc)
