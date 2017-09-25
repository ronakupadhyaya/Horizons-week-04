# Building Twitter!


Today we will be building a clone of the popular media webite Twitter, using your knowledge of MongoDB queries, processing, and performance. Yay!

_Note: Make sure you are committing to github **as much as you can**._ If you do this and something happens with your code, you can always go fetch your old version!

## Table of Contents

- **The Big Picture** 🖼
- **Step 0:** Authentication 🔐
- **Step 1:** Connecting Users (Followers and Profiles)🙇
- **Step 2:** Creating and Viewing Tweets 🍔
- **Step 3:** Connecting everything ⭐
- **Phase 1 Challenges** 🏆

## The Big Picture 🖼

Twitter is a big project. Refer back to this section if you're ever feeling lost and need to see where this is all going. Below is a reference to all of the models we will be using in this project. More detailed information on their implementations and applications can be found in their respective sections!

Alternatively, you could try structuring the application solely from **The Big Picture**, if you're up for the challenge.

**Users** (Step 1, 3)

- `User` **Schema properties** - the model for all users of your application (_see **User Models**_)
  - `displayName` - the displayed name for a User when visiting their profile
  - `email` - used for authentication, should not be publicly available
  - `password` - used for authentication, definitely should not be publicly available
  - `bio` - a biography that the user can give to display on their profile
- `User` **Schema methods** - methods that your models will inherit to be called from in your routes
  - `follow(idToFollow, cb)` - create and save a new `Follow` object with `this._id` as the `from` (see below) and `idToFollow` as `to`
  - `unfollow(idToUnfollow, cb)` - find and delete a `Follow` object (if it exists!)
  - `getFollows(cb)` - return array of followers and users followed as User objects in callback `cb`
  - `isFollowing(user)` - return whether or not the user calling `isFollowing` is following the User model

**Follows** (Step 1)

- `Follow` - the model that is used to identify a relationship between a User and another they are following (_see **Follows!**_)
  - `follower` - the ID of the User following another
  - `following` - the ID of the User being followed

**Tweets** (Step 3)

- `Tweet` **Schema properties** - the model that defines a single review on a Restaurant
  - `content` - A String with the contents of the Tweet
  - `likes` - the ID's of the users who have 'liked' the tweet  
  - `user` - the ID of the User who posted/authored the tweet


## Step 0: Authentication 🔐 - `app.js`, `routes/index.js`,  `models/models.js`
👀 **Note:** this is step is partially completed for you! All you must do is fill in passport where it is needed! - _The code will be given, but make sure to read through, familiarize yourself with the authentication flow, and add your MongoDB details!_


Before you start this project, check out the codebase, beginning in **`app.js`** - the entry point of your application.

1. You should begin by setting your authentication to use a `LocalStrategy` with Passport to identify users by an email address and check their password (which is stored as a hash in your MongoDB database). **Remember**: your currently logged-in users are accessible through your Passport-created `req.user` object. Take advantage of that in the Parts that follow!

    <details>
    <summary>Hint</summary>
    
    ![](https://preview.ibb.co/dhAxjQ/Screen_Shot_2017_09_25_at_8_43_36_AM.png)
    ![](https://preview.ibb.co/cg8NJk/Screen_Shot_2017_09_25_at_8_43_17_AM.png)
    ![](https://preview.ibb.co/euymB5/Screen_Shot_2017_09_25_at_8_43_03_AM.png)
    
    </details>

2. Next, head into **`routes/index.js`**. and **`routes/auth.js`**. You should notice that the Login, Logout and Registration routes have been provided for you. These already handle storing users on the database and storing the sessions using passport and mongo-connect.

Begin by adding authentication details for your MongoDB database (either with the environment variable `MONGODB_URI` or with the file `connect.js`) on mLab and creating an account.

> ⚠️ **Warning**: You will be changing the schema for a user significantly in the next Part (Connecting Users). Remember to dump your existing users from this Part before testing your website in the next.


That’s it! There’s nothing else to code in this part - just make sure to get familiar with your code.
Now, get ready to dive in and create more models and properties to build out the rest of Twitter!

## Step 1: Connecting Users 🙇
Now we’ll be adding more properties to our users in our database model to give them followers and tweets. Notice how we are *not* providing you with the typical scaffolding for each route!

Your job is to take the specifications for each model and determine, with your views, how many routes you *have*, what they are *called*, and what they *do*. Take a deep breath; you've got this!

### User Models ⛷ - `models/models.js (UserSchema)`

Begin by defining a `Schema` - you'll need to do this in order to create `virtuals` and `statics` for later.


**Tip: you've been creating `Schema`s already!**

This (we shall call method 1):

```javascript
var User = mongoose.model("User", {
  property1: String
});
```
is equivalent to this (method 2):

```javascript
var userSchema = new mongoose.Schema({
   property1: String
})

//STATIC DEFINITIONS SHOULD GO HERE  
//METHOD DEFINITIONS SHOULD GO HERE

var User = mongoose.model("User", userSchema);
```


**We want to use the method 2**, because Schemas allow us to define useful additional properties on top of them, using virtuals, methods, and statics (more about these below). You will be able to define your properties inside of your Schema just like you normally do. When you create your model, just pass in a Schema as the second parameter, like `mongoose.model("User", userSchema)` as demonstrated above.

Here are some properties you definitely want to include in your **Users Schema**.

- **displayName** (`String`) - could be a first name, last name, nickname, etc.
- **email** (`String`) - email used for authentication
- **password** (`String`) - hashed password used for authentication
- **bio** (`String`) - a biography for a User
- **imgUrl** (`String`) - a direct link to your profile image

Make sure that all these fields are defined on the `userSchema` before moving on.

#### Checkpoint  
  
Great! Now lets try to register a user! We want to make sure that when we register, all of the users credentials are stored in our database. So, when we try out our register route, we should check MongoDB to make sure our user appears there right after we regsiter!  
  
Now that our user is stored in our database, let's try to login and test to make sure our passport works! We should try to login with incorrect credentials, and then try again with correct credentials. If this works, we should move on to the next part!  
  
  If you haven't already, make sure you commit your code to github so you don't lose any changes!

### Single Profile Page - `views/singleProfile.hbs`

Now that we are logged in, let's make a profile page that will display all of our information, tweets, etc. Design this page however you please, but make sure you have the following:  
  
- **Profile picture** - A spot to load your profile image, given the image in your `User` model.
- **Tweets container** - A container which will hold and display tweets that belong to you.
- **Followers container** - A container which is hold and display the number of people that follow you.
- **Following container** - A container which is hold and display the number of people that *you* follow.
- **Follow Button** - A nonfunctional button which a user will click when they want to follow you. (*Will be implemented later*)  

#### Adding the Route 🌀 - `routes/index.js`

* Add a route to a single profile page (`singleProfile.hbs`) based on an ID (as a part of the URL, i.e. `/users/575xxxxxxxxx`) - pass in the relevant details of a User and their populated friends list.

#### Checkpoint
  
Let's make this the page we go to by default after login. Now, let's get all of the correct information to show up on the page. Once we get the user information from MongoDB, we can move on.  
  
If you haven't already, make sure you commit your code to github so you don't lose any changes!

### Follows! 👫 - `models/models.js (FollowSchema)`

Follows are awesome, but they are also a little complicated. We _could_ choose to add to two arrays of emails representing followers/users following to _each_ User, but that would mean we would have to update two users every time someone was followed. Instead, we'll keep track of each User's relationship with another model - the `Follow`.

Here are the properties you'll want to define for each of your Follows:

- **follower (User ID 1)** (`type: mongoose.Schema.ObjectId`, `ref: 'User'`) (for this part, order does matter) - the ID of the user that follows the other.
- **following (User ID 2)** (`type: mongoose.Schema.ObjectId`, `ref: 'User'`) - The ID of the user being followed

(Note that this is the Twitter way of following. One can follow the other without being followed.)

When you add the above lines to your Schema, you are telling mongoose that that field will contain an `_id` corresponding to a document in the `User` collection (called `users` on mLab). The string value of `ref` will indicate the mongoose model that was made using the same string, in this case the result of `mongoose.model('User', userSchema)`

> ⚠️  **Warning:** Careful about creating duplicate follows! You should be only creating a new Follows document if it doesn't already exist - make sure you handle this in your routes below.

### Creating User Methods for Followers ☃️ - `models/models.js (UserSchema)`


Next, you want to create a function for each of the `User` models that allows us to get both the users following a user and the users that a user is following.

We will accomplish this by using Mongoose _methods_. The way we write Mongoose methods is like the following:

```javascript
var userSchema = new mongoose.Schema({...});
userSchema.methods.yourMethodName = function() {
  /* define your method before your model here! */
};
```

We want to write the following methods on our `User` Schema:

> **Tip:** When creating your methods for `User`, use _callback functions_ to return data. For example, `getFollows` should be _used_ in a future route like:

```javascript
// myUser is an instance of a user. Could be obtained with User.find, for example
myUser.getFollows(function(followers, following) {
  /* do something with the result of the callback function */  
});
```
> To accomplish this, your implementation should take a parameter that represents a callback function that will later be called with the resulting data. See more about this below.


**Tip**: You can refer to the current model that is calling a method using the `this` keyword - a lot like an object and its function prototypes! As always when using `this`, be mindful of binding issues.


**Tip**: It is suggested that when writing your own Schema methods that take callbacks you adhere to the same pattern that mongoose's predefined methods/statics (like `save`/`find`) do: that the callback functions take two arguments, the first being an `error` if there was one and the second being the `response` or `result` of the operation. If you need to send back more than one thing as the `result`, you can just wrap them in an object and call the callback with the singular object as its `result`.


- `follow` - should set a following relationship as on Twitter, Instagram, or any site that supports followers.
  - **Note**: `follow` will be an _instance method_ that acts upon a user - it would be defined in the schema as something along the lines of:

  ```javascript
  userSchema.methods.follow = function (idToFollow, callback){...}
  ```
  You should take in a parameter `idToFollow` of the user to follow; now, calling `.follow` on the logged-in user will follow the user given by `idToFollow`! `follow` should also check if you have followed that user already and prevent you from creating duplicate `Follow` documents.

- `unfollow` - deletes the relationship represented by a `Follow` document where User 1 (the caller of the `unfollow` function) follows User 2 (given by a parameter `idToUnfollow`).

- `getFollows` - This method will go through and find all `Follow` documents that correspond to both user relationships where the user's ID (accessible by the caller of the function, `this._id`) is the `from` and where the user is the `to` of a `Follow` relationship. In other words, you want **both the Users the user follows and the Users the user is being followed by** 'returned' by this function. This should call the callback method with the followers and users you are following with something like `allFollowers` and `allFollowing`.

  When first retrieving the correct `Follow` documents relevant to a user, your `allFollowers` and `allFollowing` arrays will look something like:

  ```javascript
  allFollowers = [{
    follower: ID_OF_FOLLOWER,
    following: YOUR_USER_ID
  }, {
    follower: ID_OF_FOLLOWER,
    following: YOUR_USER_ID
  }];

  allFollowing = [{
    follower: YOUR_USER_ID,
    following: ID_OF_USER_YOU_ARE_FOLLOWING
  }]
  ```


  After using `.populate`, your data will look like this (callback with this populated set!):

  ```javascript
  allFollowers = [{
    follower: {
      _id: ID_OF_FOLLOWER,
      displayName: "Francisco Flores",
      email: "frankie@joinhorizons.com",
    },
    following: YOUR_USER_ID
  }, {
    follower: {
      _id: ID_OF_FOLLOWER,
      displayName: "Graham Smith",
      email: "graham@joinhorizons.com",
    },
    following: YOUR_USER_ID
  }];

  allFollowing = [{
    follower: YOUR_USER_ID,
    following: {
      _id: ID_OF_USER_YOU_ARE_FOLLOWING,
      displayName: "Moose Paksoy",
      email: "moose@joinhorizons.com",
    }
  }]
  ```

  Notice how the `from` field for `allFollowers` and the `to` field for `allFollowing` for the populated set of data has been transformed from an ID (`ID_OF_FOLLOWER` or `ID_OF_USER_YOU_ARE_FOLLOWING`) to an actual User object. Use Mongoose's [`.populate()`](http://mongoosejs.com/docs/api.html#model_Model.populate) to populate the correct fields and accomplish this.

- `isFollowing` - this method will take in another User ID and call true or false on the callback based on whether or not the user calling `isFollowing` (`this`) is following the user represented by the ID passed in. Query for a `Follow` document where `follower` is `this._id` and `following` is the ID passed in, and call a callback function with `true` if the resulting query turns up an existing `Follow` document.

#### Follow Button  
  
Now that we have all of our follow logic set up, let make this button work! When a user hits the button on a specific users page, we should update our MongoDB so that this reflects.  
_Note: Remember that we are using the **Twitter** method for follows (i.e. a user can follow another **without** having them follow them back)_  

#### Viewing ALL the Profiles 🏃 - `views/profiles.hbs`

To have a central directory of Users where people can follow others, we will have a template dedicated to displaying all of the Users registered for our site. The result will look like:

<img src="http://cl.ly/2t3z3p3q1r3X/Yelp%20Lite-3.png" width="500">

<!--You will also want to display a button to "Follow" conditionally on whether or not the user accessing the page is already following a particular user - remember that `isFollowing` method we wrote?

You can call that method from Handlebars using a line inside of an `each` loop like: `{{#if this.isFollowing(../user)`, given that the context object looks like: `{user: req.user, users: [Array]}` - the `../` notation will give you a parent scope in Handlebars.-->

#### Adding Additional Routes 🌀 - `routes/index.js`
As aforementioned, we are going to leave many of these design decisions up to you - but here's a few routes that you'll _definitely_ need to have.

  * Both `allFollowers` and `allFollowing` mentioned in the example context object above can be retrieved from using your `getFollows` method - remember that the results are passed into a callback! Example:

  ```javascript
  req.user.getFollows(function(err, response) {
    var allFollowers = response.allFollowers;
    var allFollowings = response.allFollowings;

    res.render({
      ...,
      followers: allFollowers,
      followings: allFollowings
    })
  })
  ```
  * Note also that the `isFollowing` property from the example context object above can be retrieved using the `isFollowing` method that you wrote - call it on the user (`PERSON`) being viewed and pass in `req.user` to check whether or not the currently-logged in user follows the profile they are viewing.
* A route to render `profiles.hbs` with all the Users registered on your site.
* Routes to handle a user **following** or **unfollowing** another, and updating that `Follow` relationship accordingly
  * The routes to handle following and unfollowing should check whether or not the relationship exists first using `find`. For example, if User A with ID 1 attempts to follow  User 2 with ID 2 (a user they are already following), a new `Follow` document _should not_ be created, and the response should be "Already followed!"

#### Checkpoint
  
We should be able to follow ourselfs, so let's test our button. MongoDB should update accordingly. To unfollow yourself for now, just simply delete the entry manually in mLab.  

Display something that looks like the following:    

<img src="http://cl.ly/1q1H2F3L0D0z/Yelp%20Lite-2.png" width="500">  

When creating your Single Profile template, imagine that you are passing in the following context object into the template (_you are responsible for actually passing this into your template_ when you `.render` your route in the following sections!):    

 ```javascript    
 {    
   user: {    
     _id: PERSON_BEING_VIEWED,    
     displayName: "Ethan Lee",    
     email: "ethan@joinhorizons.com",   
     bio: "All I know is cats.",  
     imgUrl: "http://fallinpets.com/wp-content/uploads/2016/09/surrender.jpg",    
   },       
   followers: [{  
     from: {  
       _id: USER_FOLLOWING_PERSON,    
       displayName: "Abhi Fitness",    
       email: "abhi@joinhorizons.com",   
       bio: "Oh me? Probably at the gym.",  
       imgUrl: "http://www.top13.net/wp-content/uploads/2015/10/perfectly-timed-funny-cat-pictures-5.jpg",  
     },
     to: PERSON_BEING_VIEWED
   }],
   following: [{
    from: PERSON_BEING_VIEWED,
    to: {
      _id: PERSON_FOLLOWING_USER,
      displayName: "Josh",
      email: "josh@joinhorizons.com",
      bio: "Hey I'm Josh.",  
      imgUrl: "https://i.ytimg.com/vi/geqVuYmo8Y0/hqdefault.jpg",  
    }
  }],
  isFollowing: true
 }    
 ```
Above, `PERSON` refers to the User profile being rendered currently - this could be your currently logged-in user _or_ any other User on your site!  
  
If you haven't already, make sure you commit your code to github so you don't lose any changes!

### End Result, Step 1🏅- `http://localhost:3000`
Time to step back and take a look at your hard work!

At the end of Step 1, you should be able to login, view profile pages, view other profiles, and follow other users.

Hooray! You've just built the fundamentals of a social network! Now it's time to take those users and associate more data with them in the form of tweets.  
  
If you haven't already, make sure you commit your code to github so you don't lose any changes!


## Step 2: Creating and Viewing Tweets 🍔

### Tweet Models 🍚 - `models/models.js (TweetSchema)`

To start off the basics of the Tweets model, let's create some fundamental properties for _what make a tweet a tweet_. The ones we thought of are as follows:

- **user** (`type: mongoose.Schema.ObjectId`, `ref: 'User'`) - The user who posted/is the author of the tweet
- **content** (`String`) - The content of the tweet.
    - Should limit this field to be a maximum of 140 characters
    <details>
    <summary>Hint</summary>
    
    [See Mongoose maxlength to do this properly](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-maxlength)
    
    </details>
- **likes** (`Array`) - Should store an ***Array of references*** for users who have liked each individual tweet  
    <details>
    <summary>Hint</summary>
    
    likes: [{ type : ObjectId, ref: 'User' }]
    
    </details>



That's all for Tweets for now!

### Creating Tweets 💛 - `views/newRestaurant.hbs`
Create a basic form for creating a new tweet with all of its basic information. Your form should take each of the following inputs:

* The content of the tweet
    <details>
    <summary>Hint</summary>
    
    You should make sure the user DOES NOT enter more than 140 characters per tweet (Twitter has this limitation, so we should as well!)
    
    </details>


The end result should look something like:

<img src="http://cl.ly/3F2126010E36/Yelp%20Lite-4.png" width="500">

### Viewing Single Tweets 🍺 - `views/singleTweet.hbs`
When displaying a single tweet, you should only display the relevant information, so in this case, the author, the content, and the number of likes the tweet has. We want to add the ability to view a single tweet so we can send them to our friends without having to dig through a mess of tweets!

<img src="http://cl.ly/0K10042i0l01/Yelp%20Lite-5.png" width="500">


**Methods for Tweets**

- `getLikes` - This method should find the array of User documents associated with the Tweet calling the method (`this`) and call a callback function with an array of populated Tweets. Make sure to use `.populate` for this to replace the `userId` in the Review with the details of the actual user! This will be used in the likes page .

**Virtuals for Tweets**

- `numLikes` - this virtual should return the total number of likes per tweet. Need a refresher on creating Mongoose virtuals? Take a look at [the documentation!](http://mongoosejs.com/docs/guide.html) - scroll down to "Virtuals."


### Creating User Methods for Tweets 🍃 - `models/models.js (UserSchema)`
The single method you will be creating for your User to fetch tweets will also use a callback to return its results. Likewise, make sure that when you call this in your routes, you are passing in a callback function to define _what happens_ when you get those results back.

- `getTweets` - This method will query the Tweet documents for all tweets with the same User ID as the user calling `getTweets`, which you can identify by the `this` keyword. For this `getTweets`, you will `.populate` the Tweet ID instead!

Remember that because our methods rely on asynchronous calls (namely, database queries such as `find`), we must take in a callback function for these methods to get the result of the function! For example, using the `getTweets` function in our routes will look _something_ like:

```javascript
User.findById(req.params.id, function(err, user1) {
  user1.getTweets(function(tweets) {
    res.render('singleProfile', {
      user: user,
      tweets: tweets
    });
  });
});
```

### Browsing ALL tweets 🍻 - `views/tweets.hbs`

When viewing all tweets, you should be able to see basic information; content, # of likes, and author are all important here. Don't worry about sorting, searching, or filtering for now - we'll tackle that tomorrow.


**Use your `numLikes` virtual (which will be defined below) to display the average rating of each restaurant inline with its listing on your restaurants view. You can access it like any other property!**

> ⚠️  **Warning:** You may have called these fields by different property names! Make sure that your Handlebars templates `{{placeholders}}` match those that you defined in your models previously.

The end result will look something like the following:

<img src="http://cl.ly/3R1k3u0P390b/Yelp%20Lite-6.png" width="500">


### Adding the Routes 🌀 - `routes/index.js`
Looks like your views and models for restaurants are ready to go! Time to build out your endpoints to render routes with your data. As before, you will be making the design decisions for your routes, but here are basic guidelines for what they should _do_:

* A route for viewing all the restaurants with basic information (name, content, likes), rendering `tweets.hbs`.
  * _What to Pass In_: A context object with a property `tweet` that has an array of all Tweet documents.
  * Go the extra mile and implement paging for tweets!
* A route for viewing any one restaurant by its ID, also with basic information, rendering `singleTweet.hbs`.
  * _What to Pass In_: A context object with a property `tweet` that has a single Tweet document
* A route for creating new restaurants, rendering `newTweet.hbs`
  * You'll need to have a `POST` route to handle the form from `newTweet.hbs` as well, so that you can save the new Tweet document with the data receieved in `req.body`.


### End Result, Step 2🏅- `http://localhost:3000`
At this point, you should be able to view Restaurants in both a complete listing (with view paging) as well as individual Tweets with their details of content, author, and likes. Make sure to commit your code!


## Step 3: The Final Touches ⭐

### Viewing Likes 📝 
Now that we have an Array of references attached to our tweets, representing each 'like', we want to do something with this!  
  
In our `singleTweet.hbs` file, let's add a container to view the likes on the individual tweet! The goal is to see some information about each person who has liked the tweet, e.g their display name. Use `.populate()` to get this information and display it on the page!

## Phase 1: COMPLETE ⭐  
Congrats! You have finished phase 1! You have succesfully implemeneted most of the basic functionality that twitter uses! Make sure you commit your code to github, if you haven't already.  
  
Hungry for more? Check out the below challenges!

## Phase 1 Challenge 🏆
You've made it this far, and early. Why not a challenge?  
  
These challenges will be a bit more open ended, and you will be free to implement them however you want!  
  
- Retweets
    <details>
    <summary>Hint</summary>
    
    You should add another key to our Tweet model, similarly to "likes". How could we make sure these retweets display on a singleProfile of a user who does not own them?
    
    </details>  
- Filter tweets  
    - Based on user, date posted, etc. 
- Enable mentions 
   <details>
   <summary>Hint</summary>
   Extract usernames with the '@' symbol infront in tweets. Maybe add another key to your tweets model, which has a list of all users mentioned in the tweet.
   </details>
 


