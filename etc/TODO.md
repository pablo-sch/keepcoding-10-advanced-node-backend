# TODO LIST

Migrate code to typeScript.
Search post by price, name, author, tag and creation date.
Sort posts by each search parameter.
CRUD of a post.
Edit Profile.

## Fix Bugs

- Cannot open Dropbox by default in my header.ejs. An axillary code was implemented to force it to open.

- In my connectMongoose.js when connecting to mongoose my “process.env.MONGODB_CONNSTR” passes as string so it causes error. An auxiliary code was used to pass it not as a string.
