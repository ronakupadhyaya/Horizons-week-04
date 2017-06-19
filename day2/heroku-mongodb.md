# Inline Exericse: Heroku and MongoDb

## Goal

The goal of this exercise is to use MongoDb with Heroku.

## Instructions

1. Navigate to the new Heroku project you created for the previous exercise in your command line
1. Install `mongoose` with `npm install --save`
1. Connect to `mongoose` using `process.env.MONGODB_URI` in `app.js`
1. Add a mongoose model `Book` to `app.js`, it should have one required String
   field called `title`
1. Create a `GET /newbook/:title` route that creates a new book with
   `req.params.title`, `.save()`s it and returns the newly created book as JSON
1. Create a `GET /books` route that uses `.find()` and returns all books from
   MongoDb as JSON.
1. First commit, then push your app with `git push heroku`
1. Create a couple books on your app on Heroku, use `/books` to check that they
   are there.
1. Go to your Heroku dashboard `https://dashboard.heroku.com/`, click on your
   app, click on `Resources`, click on `mLab MongoDB :: Mongodb`.

   This will open the familiar mLab interface straight from Heroku. Note how you
   didn't have to log into mLab directly, it's all done through Heroku.

