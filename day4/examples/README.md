# Week 4 Day 4 Morning Videos & Individual Exercises

---

## Section 1: Heroku

### Part 1: Introduction to Heroku and deployment of a test app

In this section we will get started with Heroku. In the first video we install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and create a [Heroku account](https://www.heroku.com). In order to follow along in the second video you will need to clone the heroku test app [repo](https://github.com/horizons-school-of-technology/heroku-testapp) on your local machine. The third (optional) video gives a pictorial representation of what the heroku create command is doing.

#### [Initial Heroku CLI & Account creation video](https://vimeo.com/222642703)
#### [Deploying with Heroku](https://vimeo.com/222645394)
#### [Optional: heroku create with pictures](https://vimeo.com/222645486)

#### Exercise 
    
Using your understanding of heroku deployment go through the same steps with the codebase [here](https://github.com/horizons-school-of-technology/heroku-app-exercise) to put this application on the cloud.
Be sure to test the app you deploy by using `heroku open`.


### Part 2: Debugging common deployment issues 

In this section we will take a closer look at how to debug some common issues that you will run into while deploying apps using heroku. In the local environment you can easily see the output of your `console.log()` 
in the terminal. Similiar to the local environment heroku provides you with some built in mechanisms to debug issues in the cloud. Watch the video below to learn more.

#### [Heroku debugging common issues](https://vimeo.com/222650288)

#### Exercise
    
Now that you know a little more about how heroku tries to deploy your app try to fix the common errors in repo located [here](https://github.com/horizons-school-of-technology/heroku-error-app). Be sure to test that your app is deployed by visiting the url provided by heroku.


### Part 3: Heroku config

In this section we will learn more about configuring environment variables in heroku. Environment variables are easily set in our local environment by either using an `env.sh` file or manually calling `export` inside a terminal window. For example `export myEnv="myValueString"` adds the environment variable `myEnv` to the `process.env` object inside your program. If we logged the value of `process.env.myEnv` we would see the string `"myValueString"`. Similiar to the export command heroku has a builtin command to set an environment variable for your node application running on heroku in the cloud. Watch the video below to learn how.

#### [Optional: process.env walkthrough](https://vimeo.com/222652293)
#### [Heroku Config Variables](https://vimeo.com/222654441)

#### Exercise
    
Using the app you deployed in the previous exercise add the following config variables using either the admin interface or the heroku command line: `HORIZON_URI="abhi_darwish"`, and `TEST=0`. Use `console.log()` calls to print the values of `process.env.HORIZON_URI` and `process.env.TEST` and heroku logs command to see that the variables are set after the app has been redeployed. Note: you may need to wait a few seconds for the changes to update.

### Part 4: Heroku with mlab

In this section we will build on the previous section by exploring how to use mlabs with Heroku. The addon we will be working with is mongodb provided by mlabs. Watch the video below to learn about setting up mongodb/mlab with a heroku application. 

[Heroku with MongoDB: mlab](https://vimeo.com/222664592)

#### Exercise

Now that we understand how to deploy our apps to heroku, debug problems using Heroku logs, set environment/config variables, and configure mlabs we are ready to put it all together and get the app located at the repo [here](https://github.com/horizons-school-of-technology/heroku-final-exercise) up and running on Heroku. Remember heroku logs command is your friend! Warning: Sometimes it takes a minute for heroku logs to update.


### Reference

1. heroku login- login using password/email from terminal.
1. heroku create- inside a git repo add a heroku app for the project you are in.
1. git push yourbranch:heroku- from the current branch, called "yourbranch" in this case, push the app to heroku. Note: you need to have a new commit to heroku in order for this to trigger a redeploy.
1. heroku logs- see the terminal for your heroku deployment, lets you see terminal output (console.logs etc.) for the app.
1. heroku logs --tail- see the last few lines of terminal output instead of the entire log
1. heroku config:set GITHUB_USERNAME=joesmith-sets a new variable called GITHUB_USERNAME that is available through `proccess.env.GITHUB_USERNAME`, setting a config var triggers a reset of your app


---

## Section 2: Webhooks
- [Watch Me: Webhooks Intro](https://vimeo.com/222624480)
- [Watch Me: Webhooks with Twilio](https://vimeo.com/222623051)
- Complete the [webhooks](webhooks/) exercise

---

## Section 3: OAuth
- [Watch Me: Oauth Intro](https://vimeo.com/222398661)
- [Watch Me: Oauth with Facebook](https://vimeo.com/222398704)
- Complete the [oauth](oauth/) exercise

