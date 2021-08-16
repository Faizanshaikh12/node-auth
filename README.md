##NODEJS FULL USER AUTHENTICATION APPLICATION APIS

- Started With Npm Init Projects Setup
- Installed the Useful Npm Packages
- Listing Server Port
- Connect With MongoDb Database
- Using SendGrid Apis Via Email

### Created The Schemas
- UserSchema
- ProfileSchema
- PostSchema

###Apis Routes Creating
User APIs
- /register
- /verify-now/:verificationCode -> Email
- /login
- /profile
- /reset-password
- /reset-password-now/:resetPasswordToken -> Email
- /reset-password-now

Profile APIs
- /create-profile
- /my-profile
- /update-profile
- /user-profile/:username

Post APIs
- /fetch-post
- /create-post
- /update-post/:id
- /like-post/:id
- /delete-post/:id
