# Heroku Self Directed Examples

- **All videos have the password `horizonites`**
- Before you jump in
- Keep [lesson slides](http://lessons.horizonsbootcamp.com/lessons/week03/day2.html)
  open in your browser. Lesson slides contain code samples and links to
  essential documentation.
- You can write all your solutions in the same project. You don't need to
  create a new React Native project for each secion.
- Ask for help early and often! 🙋

### Set Up Heroku

#### Goal

Your goal is to create a Heroku account, and to install the Heroku toolbelt on
your computer. This will allow you to follow along with today's inline
exercises, and to quickly deploy your project apps to the Heroku cloud.

#### What is Heroku?

Heroku is a "Platform as a Service" (PaaS) cloud host that offers free basic
accounts. Heroku makes it fast and easy to host your backend apps in the cloud
so that anyone, anywhere can access your apps--from e.g. a web browser or a
mobile app. This process is called "deployment." Heroku also integrates with
git, so the learning curve is not too steep.

#### Instructions

1. Visit https://signup.heroku.com/ in your browser and fill out the form.
   Select "Node.js" as your primary development language. Click Create Free
   Account at the bottom.
1. Look for the verification email. Tap the link in this email, then set a
   password on the form. Tap "Set password and log in."
1. Go to https://toolbelt.heroku.com/ and download the Heroku Toolbelt for your
   platform. Install it.
1. Go to command line. Type `heroku login` and enter your credentials to
   login.

### [Watch Meh]()

The following set of instructions will walk you through deploying your first
application to Heroku.

1. Create a new Git repository **outside** `week04`.
1. Add a `.gitignore` file to your repository. Add the following lines to
   it:

    ```
	node_modules
	npm-debug.log
	.DS_Store
	```

1. `npm init` to create your `package.json`
1. Install `express` with `npm install --save`
1. Create an `app.js` file, `app.js` should:
    1. `require('express')`
    1. Create `app` using `express()`
    1. Create a `GET /` route `res.send()`s a string of your choice
    1. Listen on a port

	    ```javascript
        app.listen(process.env.PORT || 3000);
        ```

1. Add a start script to `package.json` that runs `node app.js`.
1. Run `node start` and confirm your server works.
1. Commit all of your code to git.
    ```bash
	git add -A
	git commit -m 'initial commit'
	```
1. Create a new heroku app and push your code there:

	```bash
	heroku create
	git push heroku
	```

1. Connect to Heroku from your laptop and check that it works. You can also use the command `heroku open` from the terminal to launch your app.
1. Post a link to your Heroku app on Slack so your friends can check it out too! Welcome to the Cloud!

### [Watch Meh]()

1. Open up the new Heroku project you created for the previous exercise
1. Add a MongoDB instance to your Heroku app (__Note__ that you will have to navigate to account settings prior to this step and add billing information. Don't worry as your card will not be charged as long as you select the __Sandbox - Free__ instance of mLab.)
    1. Go to your Heroku dashboard [https://dashboard.heroku.com/](https://dashboard.heroku.com/)
	1. Click on the app you created in the last exercise
	1. Navigate to the Resources tab
	1. Search for & select mLab in the Addons section
	1. Make sure you choose the __Sandbox - Free__ plan, and click Provision
	1. Now go to the Settings tab and click on __Reveal Config Vars__. You should see your `MONGODB_URI` (this can be used by your application via. `process.env.MONGODB_URI`)
1. Install `mongoose` with `npm install --save`
1. Connect to `mongoose` using `process.env.MONGODB_URI` in `app.js`
1. Add a mongoose model `Book` to `app.js`, it should have one required String
   field called `title`
1. Create a `GET /newbook/:title` route that creates a new book with
   `req.params.title`, `.save()`s it and returns the newly created book as JSON
1. Create a `GET /books` route that uses `.find()` and returns all books from
   MongoDb as JSON.
1. Push your app with `git push heroku`
1. Create a couple books on your app on Heroku, use `/books` to check that they
   are there.
1. Go to your Heroku dashboard `https://dashboard.heroku.com/`, click on your
   app, click on `Resources`, click on `mLab MongoDB :: Mongodb`.

   This will open the familiar mLab interface straight from Heroku. Note how you
   didn't have to log into mLab directly, it's all done through Heroku.


