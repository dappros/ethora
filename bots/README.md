## Ethora Chat Bots (powered by XMPP, Ethora API and Web3 features)

This directory includes some sample and/or production-ready chat bots for different purposes.

These chat bots leverage Ethora API, XMPP messaging protocol and Web3.js (or Web3.py) libraries for their functionality.

3rd party developers may write their own bots based on our examples or from scratch, in order to extend the functionality of Ethora engine. 


In essence, Web3 Chat Bots are automated entities possessing the following features:

* can send and receive chat messages
* can react to messages, specific content and sequences of messages from Users
* can offer both conversational and button-based UI
* can send guidance messages visible for one or specific Users only
* control one or more Wallets
* may have their own social profile
* can own and transfer Tokens (including ERC-20 Coins, NFT Items and Documents)
* may control chat Rooms and/or interact with other features of Dappros Platform and Ethereum blockchain similarly as normal users do
* often have part or most of their logic managed by a smart contract

Chat Bots allow App owners and Users to build their own interactions and effectively extend the platform building exciting mechanisms and social economy interactions for their users.

<img width="660" alt="Screenshot 2023-08-17 at 12 01 04" src="https://github.com/dappros/ethora/assets/328787/14de0087-763d-4d70-af19-99f9cc1f74a4">

As described in the network diagram above, Bots can be hosted at your own hosting of choice and they can interact with:

* chat Rooms and chat messages via XMPP protocol
* Tokens, smart contracts and blockchain via Web3
* other Ethora platform entities via via Ethora/DP REST JSON API

You can create your own chat bots in any programming language from scratch, but the easiest thing to do is use code samples offered in our Github repo. Recommended languages for bots are Node.js and Python. 

N.B.: Your chat bots on Ethora platform don't have to be web3 bots in a way that they must operate their own crypto wallet, sign transactions with they keypair etc. It's just useful to know that you have that option with Ethora. Otherwise, it may work as a standard web2.0 chat bot. It all depends on your requirements, how you build it and how you use it.

## Ethora Bots Framework

Ethora Bots Framework is a sort of SDK to help you build your own chat bots. 

We offer a number of code samples of ready bots as well as methods that implement the core functions of working with XMPP protocol, chat rooms, DP/Ethora API as well as typical user-bot interactions so that you don't have to implement these from scratch. 


### Getting Started

### Framework initialization

To work with bots, you need to connect the framework first.

This can be done as follows: go to our Github repository, then do a git clone in your work directory.

Go to the folder Ethora -> Bots -> botTemplate

Here you need to run _npm run build_

Then the “lib” folder will appear. All working framework files will be compiled into this folder.

After doing this, you will be able to use it.

### Library connection

To connect to the framework, you need to create a directory for your future bot.

Go to the “bots” folder and create a new directory there where your bot files will be located.

Then go to this folder and create an index.js file - this is the file from which your bot will start.

In the index.js file, include the bot framework like this: 

```javascript
const {Bot} = require('../../lib');
```

The framework is connected, then, in order to work with your bot, you need to prepare its data.

### Create an account for a bot
You can create an account for your bot either manually or automatically.

By choosing the automatic way, the bot will do all the work for you. You will only need to specify the login, password and token.

#### Create an account automatically
If you want an account to be created automatically, you just need to specify the desired username and password at startup.

If such a login already exists, you will receive a corresponding error. If this login is free, an account will be created and the authorization will be automatically performed.

```javascript
const data = {
   username: 'Test',
   password: '12345678',
   tokenJWT: token
}
```

For automatic registration, you will need a JWT token - you can get it from this link https://app-dev.dappros.com/api-docs/#/Users/post_v1_users_ by copying "Authorization header set to App JWT":


#### Create an account manually

Go to the Swagger API link (see the API section of Ethora monorepo for the latest link, /api-docs/#/Users/post_v1_users_). Here you need to create a new account for the bot.

1. Copy token JWT

<img width="901" alt="Screenshot 2023-08-17 at 10 04 42" src="https://github.com/dappros/ethora/assets/328787/662f1833-eaab-45de-8b0e-4814e3d26198">


2. Click on the "lock" and paste the token in the "Value" field

<img width="886" alt="Screenshot 2023-08-17 at 10 05 32" src="https://github.com/dappros/ethora/assets/328787/837cb9bf-1a8e-4408-96af-82c66be2870d">


3. Click "Try it out" and fill in all fields.
   
4. Click "Execute"

### Connecting a bot
In the index,js file, after connecting the library, create an object with the bot data:

```javascript
const data = {
   username: 'Username',
   password: 'Password',
   tokenJWT: ’Token’,
}
```

(The login, password and token data must be taken from the previous step when creating an account for the bot.)

This is the minimum set of required data to run the bot.

Here is the complete list of attributes you can use:

```javascript
username: string; - Login when creating a bot account
password: string; - Password when creating a bot account
tokenJWT: string; - The token is in the swager, you used it when creating your account
botName?: string; - The name of the bot, as it will be displayed in chats. (if not specified, the name specified in the application is used)
botImg?: string; - Link to the bot image, if not specified, the default image or from the application will be used.
useAppName?: boolean; - Defaults to true if botName is not specified, the name in the application is used. With false and without botName login is used.
useAppImg?: boolean; - By default, true, the image from the application is used (if the image is not set in the application, the default image is used). If false, the default image or the one specified in botImg.
useInvites?: boolean; - The default is false. If true, then the bot will track incoming invites, and upon receiving an invite, subscribe to the chat room in the invite.
isProduction?: boolean; - The default is true. If ture is used "dxmpp.com" if false "dev.dxmpp.com".
usePresence?: boolean; - The default is false. If true, then when the user is present in the chat, the corresponding handler will be launched. (more on presence below).
presenceTimer?: number; - The default is 1 minute. Time to run your presence handler.
useRoomsArchive?: boolean; - The default is false. If true, gets the archive of chat rooms and subscribes to them.
connectionRooms?: string[]; - List of chat rooms to which the bot will connect at startup by default, in the format "fb9cf8277d7133ef03aed5811bc5f57237ebddecea351d8abfcb8899f6b56d79@conference.dev.dxmpp.com"
```

Now you can create a bot, for this it is enough to pass the data we just collected to it:

```javascript
const bot = new Bot(data);

bot.use(async (ctx) => {
   //Sending a message
   return await ctx.session.sendTextMessage('Hello! This is a test message.');
}, 1);
```

## Workflow

### Handlers
There are handlers you need to create for specific functions that you can use at will - for example, presence in the framework.

Otherwise, you should use the default handler.

### Default Handlers

```javascript
bot.use(‘pattern', async (context, next) => {
 return next();
});
```

The handler takes three arguments:

1. Pattern (filter by which the bot will check the user's message) - optional
2. Function (what your handler will do; you create this function) - mandatory.
3. Handler step (you can use steps in your bot to understand where the user is now)

### Pattern
In a pattern, you can use various processing options.

The pattern is intended to use it to filter the received user text and run a specific processing only if the message is equal to the pattern.

### Emptiness
An empty pattern: you can simply leave it out, in which case the handler will always run when it receives a message.

(this is a good solution when you use the stepper to filter handlers)

```javascript
bot.use(async (context, next) => {
});
```

### RegExp
You can use regular expressions to filter the text sent by the user. 

If the text in the user's message is equal to your regular expression, the handler will be started.

```javascript
bot.use(/\/start (.+)/, async (context, next) => {
});
```

(The handler will run if the message starts with "/start")

### Keywords
This pattern will search the text of the message sent by the user for the keywords you specify.

The handler will work only if the message text contains all the keywords that you specify (regardless of letter case and word order).

In order to use this pattern, you need to pass the keywords in this form "_key_ Test Word" - in this example, the text will be searched for the words "test" and "word".

Thus, you can specify as many keywords as you like, you need to specify them with a space, without commas.

```javascript
bot.use('_key_ Test Word', async (context, next) => {
});
```

### String
This pattern takes a string and checks the user's message for a full match to that string.

For example, when you specify "Test" the handler will only work if the user writes "Test" in the chat.

```javascript
bot.use('Test', async (context, next) => {
});
```

### Function
In a function, you can accept context and next.

Context makes it possible to work with framework methods, such as sending messages, getting user data, steps, and so on.

next is needed to switch to the next handler.

If you specify next() in a handler, then the next one will be launched, if next is not running in it, this completes the queue for launching handlers.

```javascript
bot.use('Test', async (context, next) => {
   await context.session.sendTextMessage('Hello! This is a test message.');
   next();
});
```

### Step
You can specify a "step" handler followed by a user step. After that, the handler will be launched only when the user is currently on the handler step.

The step can be specified both in the format of numbers and in the format of a string.

```javascript
bot.use('Test', async (context, next) => {
   await context.session.sendTextMessage('Hello! This is a test message.');
   next();
}, 1);
```

## Stepper

### Introduction

The stepper helps to save, modify and delete steps for handlers and users.

Owing to the stepper, you can create different levels of processing for users of their messages and build scenarios for the behavior of the bot.

You can assign a different step to each handler, the step must be unique.

Assigning a step to a handler is optional.

You can name the step as you like, with numbers or a string.
Transitions between steps will work the same way in both cases.

Handler steps have several parameters:

```javascript
interface IStepData {
     stepName: string | number;
     onStep: boolean;
     editing: boolean;
}
```

**stepName** - is the name of the step you wrote.

**onStep** - automatically set to “true” when the user enters this step, and “false” when leaving this step.

When the user moves from one step to the next.
The previous step is assigned the status "editing" to “true” - thanks to this, when the user gets to the same step again, by looking at the value of "editing" you can find out the first time the user is on this step or the next one.

Each user also has a "**userStep**", which you need to assign manually.
It depends on this, when receiving the next message from the user, to which handler with which step to send it.

### User step control
To work with steps, you will generally only need these methods.
They allow you to get, delete and edit a user's step.

#### nextUserStep
```javascript
nextUserStep(): void;
```

The method does not accept incoming data. It automatically replaces the user's step with the next one (by the step index in the handler steps array).

If the user has not yet set the current step, it will be created (1 step from the array of handler steps).

```javascript
bot.use('_key_ Test', async (ctx) => {
   await ctx.session.sendTextMessage(
       'Congratulations, you have moved to step 1, write something.');

   //User transition to the next step
   ctx.stepper.nextUserStep();
});
```

#### previousUserStep

```javascript
previousUserStep(): void;
```

This method is similar to the previous one, but it changes the user's current step to the previous one by its index.
If the user does not have a step, it is created automatically.

```javascript
bot.use('_key_ Test', async (ctx) => {
   await ctx.session.sendTextMessage(
       'Congratulations, you have moved to previous  step');

   //User transition to the previous step
   ctx.stepper.previousUserStep();
});
```

#### setNextUserStep
```javascript
setNextUserStep(step: string | number): void;
```

The method allows you to manually change the user's step.
The argument takes the name of the step to which you wish to change the current user step.

```javascript
bot.use('_key_ Test', async (ctx) => {
   await ctx.session.sendTextMessage(
       'Congratulations, you have moved to previous  step');

   //Set new user step
   ctx.stepper.setNextUserStep(2);
});
```

#### removeNextUserStep

```javascript
removeNextUserStep(): void;
```

This method doesn't take any arguments, just removes the user's step.
This can be useful if you want to move the user to the 0 point of the conversation, before specifying the steps.

```javascript
bot.use('_key_ Test', async (ctx) => {
   await ctx.session.sendTextMessage(
       'Okay, back to the main menu.');

   //Zeroing a step for a user
   ctx.stepper.removeNextUserStep();
});
```

#### getUserStep

```javascript
getUserStep(): string | number | undefined;
```

The method allows getting the user's current step.

```javascript
bot.use('_key_ Test', async (ctx) => {
   //Get user step.
   const userStep = ctx.stepper.getUserStep();

   await ctx.session.sendTextMessage(`Your step: &{userStep}.`);
});
```

### Handler steps control
Here you can find methods for working with handler steps.

Handler steps are handled automatically, so you don't have to use this documentation category.
Only if you want to expand the existing functionality.

#### addStep
```javascript
addStep(step: string | number): void;
```

The method allows you to add your step to the list of steps of handlers.
The argument takes only the name of the step.

```javascript
bot.use('_key_ Test', async (ctx) => {
   ctx.stepper.addStep("stepTwo");
});
```

#### addStepList

```javascript
interface IStepData {
   stepName: string | number;
   onStep: boolean;
   editing: boolean;
}

addStepList(steps: IStepData[]): void
```

The method is similar to the previous one, but it saves not one step, but an array of handler steps.

Now this method is used automatically, after the formation of a step map from handlers.

```javascript
bot.use('_key_ Test', async (ctx) => {
   const stepList = [
   {stepName: 1, onStep: false, editing: false},
   {stepName: 2, onStep: false, editing: false},
   ];

   ctx.stepper.addStepList(stepList);
});
```

#### getCurrentStep

```javascript
interface IStepData {
   stepName: string | number;
   onStep: boolean;
   editing: boolean;
}

getCurrentStep(): IStepData | void;
```

The method returns the data of the current step of the handler. It searches for the current step in the list of steps. The method understands that this is the current step by its parameter "onStep" - if "onStep" = "true", then this step is the current one

```javascript
bot.use('_key_ Test', async (ctx) => {
   const currentStepData = ctx.stepper.getCurrentStep();

   console.log(currentStepData)
});
```

#### findStep

```javascript
interface IStepData {
   stepName: string | number;
   onStep: boolean;
   editing: boolean;
}

findStep(step: string | number): IStepData | undefined;
```

The method will allow you to find the data of the handler step by the name of this step.

```javascript
bot.use('_key_ Test', async (ctx) => {
   const stepData = ctx.stepper.findStep(2);

   console.log(stepData);
});
```

#### setOnStep

```javascript
interface IStepData {
   stepName: string | number;
   onStep: boolean;
   editing: boolean;
}

setOnStep(step: string | number, status: boolean): IStepData | undefined;
```

With this method, you can set the "onStep" status to true or false to the handler step you specify.

```javascript
bot.use('_key_ Test', async (ctx) => {
   ctx.stepper.setOnStep('step5', true);
});
```

#### setStepEditing

```javascript
interface IStepData {
   stepName: string | number;
   onStep: boolean;
   editing: boolean;
}

setStepEditing(step: string | number, status: boolean): IStepData | undefined;
```

The method is similar to the previous one, it allows you to change the "editing" status of the handler step.

```javascript
bot.use('_key_ Test', async (ctx) => {
   ctx.stepper.setStepEditing('step5', true);
});
```

#### changeStep

```javascript
interface IStepData {
   stepName: string | number;
   onStep: boolean;
   editing: boolean;
}

changeStep(data: IStepData): IStepData | undefined;
```

The method allows you to change all the data of the selected step at once, for this you need to pass the correct name of the step in the object.

```javascript
bot.use('_key_ Test', async (ctx) => {
    const stepData = {
   stepName: 2;
   onStep: true;
   editing: false;
}
   const newStepData = ctx.stepper.setStepEditing(stepData);
});
```

#### getAllSteps

```javascript
interface IStepData {
   stepName: string | number;
   onStep: boolean;
   editing: boolean;
}

getAllSteps(): IStepData[];
```

The method allows you to get all the steps of the handlers in an array.

```javascript
bot.use('_key_ Test', async (ctx) => {
   const allStepsList = ctx.stepper.getAllSteps();

   console.log(allStepsList);
});
```

### Sending messages

For sending messages there is a method which is in "session" - "sendTextMessage".

This method accepts the text you want to send, as well as a keyboard.

The keyboard is optional.

The keyboard is an array of buttons that has the following type:

```javascript
export interface IKeyboardButton {
   name: string;
   value: string;
   notDisplayedValue: string;
}
```

```javascript
bot.use( async (ctx) => {
 const keyboard = [{
    name: 'Close',
    value: 'Close',
    notDisplayedValue: 'close'
 }];

 await ctx.session.sendTextMessage('Hello! This is a test message.', keyboard);
});
```

