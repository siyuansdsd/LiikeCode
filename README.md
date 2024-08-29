# ChatAppBackend

# Table of Content

- [Introduction](#introduction)
- [Technologies](#technologies-used)
- [Getting_Started](#getting-started)
- [API](#api-documentation)

## Introduction

Using 4 entities: User, Group, Thread, Message
Finish a Chat APP Backend based websocket

## Technologies Used

- [TypeScript](https://github.com/microsoft/TypeScript)
- [AWS_CDK](https://github.com/aws/aws-cdk)
  I use following services:
  AWS DynamoDB
  AWS Lambda
  AWS ApiGateway

* [AWS_SDK](https://github.com/aws/aws-sdk-js-v3)
  Mainly for provide some Type for our Vars.

## Getting Started

1. Clone the repository to your local machine.

2. Install the project dependencies by running:

```bash
$ npm install
```

Reminder: better to use node version >= 18

you can use nvm to change your node version

3. Create an env file, and it should contained:
   you can copy from [.env.template]('/.env.template')

```txt
CONNECTIONS_TABLE = DouglasChatConnections
MESSAGES_TABLE = DouglasChatMessages

CONNECTIONS_TABLE_ARN =
MESSAGES_TABLE_ARN =
API_ARN =

REGION =
ACCOUNT_ID =
```

4. using webpack pack files

```bash
$ npm run build
```

you can find the packed file in ./build under the root path

5. using cdk finish Lambda function deploy

first time will spend about 3 mins on building

```bash
$ npm run deploy
```

Then you can find there is an output in your local console about your api information(different from mine)

## API Documentation

### User Endpoints

1. **Get All Users**

   - **Method:** `GET`
   - **Path:** `/users`
   - **Description:** Retrieves a list of all users.
   - **Response:** A list of user objects.

2. **Register a New User**

   - **Method:** `POST`
   - **Path:** `/users/register`
   - **Description:** Registers a new user.
   - **Body Parameters:**
     - `userName`: The name of the user.
     - `email`: The email of the user.
     - `password`: The password for the user account.
   - **Response:** Confirmation of the user registration.

3. **User Login**

   - **Method:** `POST`
   - **Path:** `/users/login`
   - **Description:** Logs in an existing user.
   - **Body Parameters:**
     - `email`: The email of the user.
     - `password`: The password for the user account.
   - **Response:** Authentication token and user details.

4. **Get, Update, or Delete a User by ID**

   - **Method:** `GET`, `PUT`, `DELETE`
   - **Path:** `/users/{userId}`
   - **Description:**
     - `GET`: Retrieves details of a specific user by ID.
     - `PUT`: Updates details of a specific user by ID.
     - `DELETE`: Deletes a specific user by ID.
   - **Response:** User object or confirmation message.

5. **Update User Password**

   - **Method:** `PUT`
   - **Path:** `/users/{userId}/password`
   - **Description:** Updates the password of a specific user.
   - **Body Parameters:**
     - `oldPassword`: The current password of the user.
     - `newPassword`: The new password to set.
   - **Response:** Confirmation of password change.

6. **Get Groups Associated with a User**
   - **Method:** `GET`
   - **Path:** `/users/{userId}/groups`
   - **Description:** Retrieves all groups that the specified user is a member of.
   - **Response:** A list of group objects.

### Group Endpoints

1. **Create or Get Groups**

   - **Method:** `POST`, `GET`
   - **Path:** `/groups`
   - **Description:**
     - `POST`: Creates a new group.
     - `GET`: Retrieves a list of all groups.
   - **Body Parameters (POST):**
     - `groupName`: The name of the group.
     - `emoticon`: The group icon.
   - **Response:** Group object or list of groups.

2. **Get Details of a Specific Group**

   - **Method:** `GET`
   - **Path:** `/groups/{groupId}`
   - **Description:** Retrieves details of a specific group by ID.
   - **Response:** Group object.

3. **Get or Add Users in a Group**

   - **Method:** `GET`, `POST`
   - **Path:** `/groups/{groupId}/users`
   - **Description:**
     - `GET`: Retrieves all users in a specific group.
     - `POST`: Adds a new user to a group.
   - **Body Parameters (POST):**
     - `userId`: The ID of the user to add to the group.
   - **Response:** List of users or confirmation of user addition.

4. **Get Threads in a Group**

   - **Method:** `GET`
   - **Path:** `/groups/{groupId}/threads`
   - **Description:** Retrieves all threads in a specific group.
   - **Response:** List of thread objects.

5. **Get the Latest Thread in a Group**
   - **Method:** `GET`
   - **Path:** `/groups/{groupId}/threads/latest`
   - **Description:** Retrieves the latest thread in a specific group.
   - **Response:** Latest thread object.

### Thread Endpoints

1. **Create a New Thread**

   - **Method:** `POST`
   - **Path:** `/threads`
   - **Description:** Creates a new thread.
   - **Body Parameters:**
     - `threadName`: The name of the thread.
     - `groupId`: The ID of the group to which the thread belongs.
   - **Response:** Thread object.

2. **Get Details of a Specific Thread**
   - **Method:** `GET`
   - **Path:** `/threads/{threadId}?limit={v1}&groupId={v2}`
   - **Description:** Retrieves details of a specific thread, with optional limit and group ID query parameters.
   - **Query Parameters:**
     - `limit`: Number of messages to retrieve.
     - `groupId`: The ID of the group to which the thread belongs.
   - **Response:** Thread object with message list.

### WebSocket Link

1. **Connect**

   - **Handler Function:** `connectToWss`
   - **Description:** Handles the connection of a user to the WebSocket.
   - **Event Type:** `APIGatewayProxyEvent`
   - **Process:**
     - Validates `userId` and `token` from the request body.
     - Retrieves the user by `userId`.
     - Updates the user with the WebSocket connection ID (`wssId`).
     - Returns a success response if the connection is successful.

2. **Disconnect**

   - **Handler Function:** `disconnectToWss`
   - **Description:** Handles the disconnection of a user from the WebSocket.
   - **Event Type:** `APIGatewayProxyEvent`
   - **Process:**
     - Retrieves the user by the WebSocket connection ID (`wssId`).
     - Removes the WebSocket connection ID from the user data.
     - Returns a success response if the disconnection is successful.

3. **Default**
   - **Handler Function:** `sendMessage`
   - **Description:** Handles sending messages between users in a thread.
   - **Event Type:** `APIGatewayProxyEvent`
   - **Process:**
     - Validates `threadId`, `userId`, `message`, and `groupId` from the request body.
     - Retrieves the thread and group by their IDs.
     - Retrieves the user by `userId`.
     - Creates a new message in the thread.
     - Updates the `lastMessageAt` timestamp for the thread and group.
     - Retrieves all users in the group and sends the message to all connected users.
     - Returns a success response after the message is successfully sent.

## Database Design

This section provides an overview of the DynamoDB table structure, including the primary key schema, Global Secondary Indexes (GSIs), Local Secondary Indexes (LSIs), and entity relationships.

### Table Structure

The DynamoDB table follows a single-table design with the following primary attributes:

- **PK** (Partition Key): The primary partition key for the table.
- **SK** (Sort Key): The primary sort key for the table.

### Entity Interfaces

The following entities are stored in the DynamoDB table, each with a specific PK and SK pattern:

1. **User Entity**

   - **PK:** `USER#{userId}`
   - **SK:** `"PROFILE"`
   - **Attributes:**
     - `userId`: Unique identifier for the user.
     - `wssId`: WebSocket connection ID (optional).
     - `userName`: Name of the user.
     - `email`: Email address of the user.
     - `password`: Password for the user.
     - `dateOfBirth`: Date of birth.
     - `createdAt`: Timestamp of user creation.
     - `userImageUrl`: URL of the user's profile image (optional).

2. **Group Entity**

   - **PK:** `GROUP#{groupId}`
   - **SK:** `"METADATA"`
   - **Attributes:**
     - `groupId`: Unique identifier for the group.
     - `groupName`: Name of the group.
     - `createdAt`: Timestamp of group creation.
     - `emoticon`: Icon representing the group.
     - `lastMessageAt`: Timestamp of the last message in the group (optional).

3. **UserGroup Relationship Entity**

   - **PK:** `USER#{userId}`
   - **SK:** `GROUP#{groupId}`
   - **Attributes:**
     - `userId`: Unique identifier for the user.
     - `groupId`: Unique identifier for the group.
     - `joinedAt`: Timestamp of when the user joined the group.

4. **Thread Entity**

   - **PK:** `GROUP#{groupId}`
   - **SK:** `THREAD#{threadId}`
   - **Attributes:**
     - `threadId`: Unique identifier for the thread.
     - `groupId`: Unique identifier for the group.
     - `threadName`: Name of the thread.
     - `createdAt`: Timestamp of thread creation.
     - `lastMessageAt`: Timestamp of the last message in the thread (optional).
     - `color`: Color associated with the thread.

5. **Message Entity**
   - **PK:** `THREAD#{threadId}`
   - **SK:** `MESSAGE#{messageId}`
   - **Attributes:**
     - `messageId`: Unique identifier for the message.
     - `content`: Content of the message.
     - `senderUserId`: ID of the user who sent the message.
     - `createdAt`: Timestamp of message creation.
     - `GSI1PK`: `GROUP#{groupId}` (used in GSI1).
     - `GSI1SK`: `THREAD#{threadId}#MESSAGE#{messageId}` (used in GSI1).

### Global Secondary Indexes (GSIs)

The table includes the following GSIs to optimize queries:

1. **GSI1** (Group ID and Thread ID Index)

   - **Partition Key:** `GSI1PK` (`GROUP#{groupId}`)
   - **Sort Key:** `GSI1SK` (`THREAD#{threadId}#MESSAGE#{messageId}`)
   - **Use Case:** Efficient querying of messages by group and thread.

2. **GSI_PK_wwsId** (WebSocket Connection ID Index)

   - **Partition Key:** `wwsId`
   - **Use Case:** Query users based on their WebSocket connection ID.

3. **GSI_PK_email** (Email Index)

   - **Partition Key:** `email`
   - **Use Case:** Query users based on their email address.

4. **GSI_PK_SK_SK_PK** (Inverse Index)
   - **Partition Key:** `sk`
   - **Sort Key:** `pk`
   - **Use Case:** Query relationships between users and groups.

### Local Secondary Indexes (LSIs)

The table also includes the following LSIs:

1. **LSI_createdAt** (Message Creation Time Index)

   - **Sort Key:** `createdAt`
   - **Use Case:** Retrieve messages in a thread ordered by their creation time.

2. **LSI_lastMessageAt** (Thread Last Message Time Index)
   - **Sort Key:** `lastMessageAt`
   - **Use Case:** Retrieve threads in a group ordered by the time of the last message.

### Entity Relationships

Below is a visual representation of the relationships between entities using text-based diagrams.

- **User to Group Relationship:**

  - Many-to-many relationship facilitated by the `UserGroup` entity.

- **Group to Thread Relationship:**

  - One-to-many relationship between groups and threads.

- **Thread to Message Relationship:**
  - One-to-many relationship between threads and messages.

### Reasons

As illustrated by the relationship, the many-to-many relationship presents several best practices, such as those outlined in the DynamoDB benchmark template. However, I did not strictly adhere to best practices when designing the table due to the strong logical coupling between these four entities.

If only two entities were coupled, best practices might have been more applicable. But in the case of the **GROUP** entity, which has a many-to-many relationship with **USER** while also maintaining a one-to-many relationship with **Thread**, the complexity increases significantly. After manually simulating different designs in DynamoDB Bench for 8 hours, I was unable to find an efficient and usable design for three entities.

To address this, I created an abstract entity, **USERGROUPS**, specifically to map the many-to-many relationship between **USERS** and **GROUPS**. This approach draws from some relational database design principles, allowing us to treat other one-to-many relationships in a more single-table design-oriented manner.

However, I must acknowledge that this design is still far from best practices.
