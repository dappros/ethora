This document explains functionality of Push Notifications in our platform.

## Using Push Notifications as a frontend developer 

If you want your Ethora based app to be sending Push Notification alerts to your end users according to the Standard Usage Flow below, you don't need to do anything beyond uploading the Push Notification certificates correctly for your iOS, Android and Web applications.

In case you would like to modify / extend the standard flow or in case you would like to use our push notification infrastructure in other scenarios, please read on through the Advanced usage section. 

### Standard Usage flow
* Chat server plugin mod_offline_post checks which Users are offline over 5 minutes for each room. For those who are offline, it calls the Push Service via http request.
* Push Service forms a Push Notification request for each Device of each offline User according to Devices and services subscription table it stores. Push Service sends Push Notifications requests to Apple, Google or other external push notification services according to the Device subscriptions. 
* Offline Users receive push notification messages along with metadata according to their subscriptions, their App and Room settings. Typically they receive an excerpt of the chat message they have missed while being offline. 


## Advanced usage


### API - Parameters

**Parameters**:

* ‘**ID**’: Int() // unique subscription ID, used for updating. (Jid + DeviceId)
* ‘**deviceID**’ : string() //according to FCM or APNS rules 
* ‘**deviceType**’ : Int // device’s platform (0 = iOS, 1 = Android, 2 = Amazon, 3 = WindowsPhone (MPNS), 4 = Chrome Apps / Extensions, 5 = Chrome Web Push, 6 = Windows (WNS), 7 = Safari, 8 = Firefox, 9 = MacOS, 10 = Alexa, 11 = Email)
* ‘**jid**’ : jid() //user jabber id
* ‘**externalID**’: string() // [optional] if specified, this allows to specify external User ID to connect this record with
* ‘**appID**’ : string() // Application ID will determine which push notification to use. If not specified use default certificate
* ‘**environment**’: string() // Allowed values: “development” or “production” - allows to specify an environment where different certificates may be used (for example in iOS allows to switch between Sandbox and Production push certificates, so allows to decide which one to use in case both are uploaded.
* ‘**screenName**' : string() // [optional] FirstName and LastName. Using for subject in push.
* ‘**isSubscribed**’ : boolean (1/true = subscribed, 0/false = unsubscribed)
* ‘**expiresAt**’ : non_neg_integer() // [optional] (Unix timestamp) if specified, this subscription shall be automatically disabled at specified time
* ’**createdAt**’: non_neg_integer() // (Unix timestamp) time when subscription is added
* ’**updatedAt**’: non_neg_integer() // (Unix timestamp) time when subscription is updated
* ‘**Timezone**’: Int(), hours away from UTC
* ‘**Language**’ : string() // [optional] Default “en”
* ‘**lat**’ : double() // latitude coordinate
* ‘**long**’  double() // longitude coordinate
* ‘**country**’: string() // [optional] country code in the ISO 3166-1 Alpha 2 format




### API - create a new subscription

/api/v1/push/subscriptions/

**Method: POST**
**Required post params**:
* appId
* deviceId
* deviceType
* environment
* externalId
* isSubscribed
* jid
* screenName
  
If you send additional params they will be stored as-is. All additional params you can find in answer.

**Successful Response**:

```
{
 "ok": true,
 "subscription_info": {
   "appId": "Dappros",
   "country": "",
   "createdAt": 1598521929,
   "deviceId": "SampleDeviceId",
   "deviceIdType": “common” | “voip”, if field not available - “common” by default
   "deviceType": "0",
   "environment": "Development",
   "expiresAt": 1606297929,
   "externalId": "",
   "id": 36,
   "isSubscribed": "1",
   "jid": "oleksiika@dev.dxmpp.com",
   "language": "en",
   "lat": "",
   "long": "",
   "screenName": "Oleksii Kliuiev",
   "timezone": 0,
   "updatedAt": 0
 }
}
```

Unsuccessful response:

```
{
 "ok": false,
 "errorType": "param_error",
 "errorMsg": "Param: deviceId required!"
}
```

Response always includes "ok" parameter.


### API - retrieve all subscriptions by id, jid or deviceId:

This is needed so that mobile client can obtain its subscriptions. 

* /api/v1/push/subscriptions/id/:id integer()
* /api/v1/push/subscriptions/jid/:jid string()
* /api/v1/push/subscriptions/deviceId/:deviceId string()

**Method: GET**

**Successful response**:

```
{
 "ok": true,
 "result": [
   {
     "appId": "Dappros",
     "country": "",
     "createdAt": 1598518330,
     "deviceId": "SampleDeviceId",
     "deviceIdType": “common” | “voip”, if field not available - “common” by default
     "deviceType": "0",
     "environment": "Development",
     "expiresAt": 1606294330,
     "externalId": "",
     "id": 13,
     "isSubscribed": "1",
     "jid": "oleksiika@dev.dxmpp.com",
     "language": "en",
     "lat": "",
     "long": "",
     "screenName": "Oleksii Kliuiev",
     "timezone": 0,
     "updatedAt": 0
   }
 ]
}
```

**Unsuccessful response**:

```
{
 "ok": false,
 "error": "not_found"
}
```


### API - delete a subscription

**IMPORTANT! For internal use only!**

**Used for system purposes.**

Notes: all subscriptions accumulate including the old device IDs. How can we solve this? Keep record of old device IDs? Remove old subscriptions by certain TTL? DeviceID is issued by Google Firebase (its push service).  Need to Take into account XMPP subscriptions and old devices/subscriptions so that mod_offline_post doesn’t send unnecessary subscriptions.
DELETE can’t be used as unsubscribe method - instead, you can use an EDIT and change isSubscribed to ‘false’

* /api/v1/push/subscriptions/{ID} : int() Subscription id
* 
**Method: DELETE**

Successful response:
```
{
 "ok": true
}
```

Unsuccessful response:

```
{
 "ok": false,
 "errorType": "not_found",
 "errorMsg": "Subscription with Id: 1 not found!"
}
```


### API - edit a subscription

**In progress.**



## Push Service

### Push Notification payload 

This payload has to be sent from Chat server or external services to our Push Service for the push notifications to be sent. 

Required fields:

```
              mucId = check_map_param(Post, <<"MUCID">>),
              ttl = binary_to_integer(check_map_param(Post, <<"TTL">>)),
              jid = check_map_param(Post, <<"jid">>),
              msgID = check_map_param(Post, <<"msgID">>),
              msgSubj = check_map_param(Post, <<"msgSubj">>),
              msgText = check_map_param(Post, <<"msgText">>),
              sound = check_map_param(Post, <<"sound">>),
              createdAt = erlang:system_time(second),
              customValue = case maps:is_key(<<"customValue">>
```
