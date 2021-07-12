// Copyright (c) 2016-present, Facebook, Inc. All rights reserved.
//
// You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
// copy, modify, and distribute this software in source code or binary form for use
// in connection with the web services and APIs provided by Facebook.
//
// As with any software that integrates with the Facebook platform, your use of
// this software is subject to the Facebook Developer Principles and Policies
// [http://developers.facebook.com/policy/]. This copyright notice shall be
// included in all copies or substantial portions of the software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <FBNotifications/FBNCardViewController.h>

NS_ASSUME_NONNULL_BEGIN

/**
 Block type used as a completion for content preparation from remote notification payload.

 @param payload Payload for which content was fetched.
 @param error   An instance of `NSError` that represents the error if it happened, otherwise - `nil`.
 */
typedef void(^FBNCardContentPreparationCompletion)(NSDictionary *_Nullable payload, NSError *_Nullable error);

/**
 Block type used as a completion for card view controller presentation from remote notification payload.

 @param viewController A card view controller that was presented.
 @param error          An instance of `NSError` that represents the error if it happened, otherwise - `nil`.
 */
typedef void(^FBNCardPresentationCompletion)(FBNCardViewController *_Nullable viewController, NSError *_Nullable error);

/**
 Block type used as a completion for local notification creation from remote notification payload.

 @param notification Newly created notification if the operation succeded, otherwise - `nil`.
 @param error        An instance of `NSError` that represents the error if it happened, otherwise - `nil`.
 */
typedef void(^FBNLocalNotificationCreationCompletion)(UILocalNotification *_Nullable notification, NSError *_Nullable error);


/**
 `FBNotificationsManager` is a primary interface for interacting with FBNotifications.framework.
 */
@interface FBNotificationsManager : NSObject

///--------------------------------------
#pragma mark - Creating a Card Manager
///--------------------------------------

/**
 Returns a shared notifications manager for the current process.

 @return Shared notifications manager.
 */
+ (instancetype)sharedManager;

- (instancetype)init NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;

///--------------------------------------
#pragma mark - Present from Remote Notification
///--------------------------------------

/**
 Fetch push card content from a remote notification payload and cache it for later use.
 If the payload doesn't contain a push card - completion block is going to be called with an error.

 @param payload    Remote notification payload.
 @param completion Completion block that will be called when content fetch is done or there was an error.
 */
- (void)preparePushCardContentForRemoteNotificationPayload:(NSDictionary *)payload
                                                completion:(nullable FBNCardContentPreparationCompletion)completion;

/**
 Presents a push card from a remote notification if it contains one.
 If content is not fully available for a given push card, a loading indicator will be shown instead of a card.

 @param payload        Remote notification payload.
 @param viewController View controller to present a push card from (optional).
 @param completion     Optional completion block that will be called when a card is visible or there was an error.
 */
- (void)presentPushCardForRemoteNotificationPayload:(NSDictionary *)payload
                                 fromViewController:(nullable UIViewController *)viewController
                                         completion:(nullable FBNCardPresentationCompletion)completion;

/**
 Returns a `BOOL` value that designated whether a push notification payload is a valid push card payload.

 @param payload Push notification payload.

 @return `YES` if payload is a valid push card payload, otherwise - `NO`.
 */
- (BOOL)canPresentPushCardFromRemoteNotificationPayload:(nullable NSDictionary *)payload;

///--------------------------------------
#pragma mark - Present from Local Notification
///--------------------------------------

/**
 Creates a local notification from a remote notification payload (if present).
 The completion will be called when all content is cached for the in app notification or if there was an error.

 @param payload Remote notification payload, usually acquired via `application:didReceiveRemoteNotification:`.
 @param completion A block that will be called after the content is ready for presentation or if there was an error.
 */
- (void)createLocalNotificationFromRemoteNotificationPayload:(NSDictionary *)payload
                                                  completion:(FBNLocalNotificationCreationCompletion)completion;

/**
 Presents a push card from a local notification if it contains one.

 @param notification   A local notification.
 @param viewController View controller to present a push card from (optional).
 @param completion     Optional completion block that will be called when a card is visible or there was an error.
 */
- (void)presentPushCardForLocalNotification:(UILocalNotification *)notification
                         fromViewController:(nullable UIViewController *)viewController
                                 completion:(nullable FBNCardPresentationCompletion)completion;

/**
 Returns a boolean value that indicates whether a push card can be presented from a local notification.

 @param notification Local notification to check.

 @return `YES` if push card can be presented, otherwise - `NO`.
 */
- (BOOL)canPresentPushCardFromLocalNotification:(UILocalNotification *)notification;

@end

NS_ASSUME_NONNULL_END
