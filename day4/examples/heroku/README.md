# Heroku

## Part 1: Introduction to Heroku and deployment of a test app

In this section we will get started with Heroku. In the first video we install the [Heroku CLI]() and create a Heroku account. In order to follow along in the second video you will need to clone the heroku test app [repo](https://github.com/horizons-school-of-technology/heroku-testapp) on your local machine. In the third video you will learn how to link a mlab MongoDB instance to your application running on Heroku.

### [Initial Heroku CLI & Account creation video](https://vimeo.com/222642703)
### [Deploying with Heroku]()

### Exercise 
    
Using your understanding of heroku deployment go through the same steps with the codebase [here]() to put this application on the cloud.
Be sure to test the app you deploy by using `heroku open`.


## Part 2: Debugging common deployment issues 

In this section we will take a closer look at how to debug some common issues that you will run into while deploying apps using heroku. In the local environment you can easily see the output of your `console.log()` 
in the terminal. Similiar to the local environment heroku provides you with some built in mechanisms to debug issues in the cloud. Watch the video below to learn more.

### Exercise
    
Now that you know a little more about how heroku tries to deploy your app try to fix the common errors in repo located [here](). Be sure to test that your app is deployed by visiting the url provided by heroku.


## Part 3: Heroku config

In this section we will learn more about configuring environment variables in heroku. Environment variables are easily set in our local environment by either using an `env.sh` file or manually calling `export` inside a terminal window. For example `export myEnv="myValueString"` adds the environment variable `myEnv` to the `process.env` object inside your program. If we logged the value of `process.env.myEnv` we would see the string `"myValueString"`. Similiar to the export command heroku has a builtin command to set an environment variable for your node application that is running on heroku in the cloud. Watch the video below to learn more.

### [Heroku Config Variables]()

### Exercise
    
Using the app you deployed in the previous exercise add the following config variables using either the admin interface or the heroku command line: `HORIZON_URI="abhi_darwish"`, and `TEST=0`. Use heroku logs and `console.log()` calls to print the values of `process.env.HORIZON_URI` and `process.env.TEST` to make sure the variables are set after the app has been redeployed. 

## Part 4: Heroku addons: mlab

In this section we will build on the previous section by exploring how to use mlabs with Heroku. The addon we will be working with is mongodb provided by mlabs. Once you learn how to use one addon it is not difficult to figure out how to add any another addon to our tech stack. Watch the video below to learn about setting up mongodb/mlab with a heroku application. 

[Heroku Addons]()

### Exercise

Now that we understand how to deploy our apps to heroku, debug common problems using Heroku logs, set environment or config variables, and configuring addons we are ready to put it all together and get the app located at the repo [here]() up and running on Heroku.


## Summary

1. heroku login- login using password/email from terminal.
1. heroku create- inside a git repo add a heroku app for the project you are in.
1. git push yourbranch:heroku- on the current branch called "yourbranch" in this case push the app to heroku. Note: you need to have a new commit since your last push to heroku in order for this to work.
1. heroku logs- see the terminal for your heroku deployment, lets you see terminal output (console.logs etc.) for the app.
1. heroku logs --tail- see the last few lines of terminal output instead of the entire log
1.