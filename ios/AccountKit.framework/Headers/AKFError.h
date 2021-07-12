// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
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

NS_ASSUME_NONNULL_BEGIN

/**
  The AccountKit error domain.
 */
extern NSString *const AKFErrorDomain;

/**
  The userInfo key for the developer message in errors.
 */
extern NSString *const AKFErrorDeveloperMessageKey;

/**
  The userInfo key for the user message in errors.
 */
extern NSString *const AKFErrorUserMessageKey;

/**
  The userInfo key for the object that caused the error.
 */
extern NSString *const AKFErrorObjectKey;

/**
 AKFErrorCode

  Top level error codes from the AccountKit framework.


 Use the NSUnderlyingErrorKey to retrieve underlying errors with more details if necessary.
 */
typedef NS_ENUM(NSInteger, AKFErrorCode)
{
  /**
    A request failed due to a network error.


 It is generally suitable to present UI to check the network connection when this error code is received.
   */
  AKFNetworkConnectionError = 100,

  /**
    Server generated an error.


 Use AKFErrorDeveloperMessageKey to retrieve the details of the server error from the underlying error.
   */
  AKFServerError = 200,

  /**
    The existing login request has become invalid.


 A new login request must be initiated. See AKFLoginRequestInvalidatedErrorCode for underlying error codes.
   */
  AKFLoginRequestInvalidatedError = 300,

  /**
    A parameter value that is entered is invalid.


 The data passed into the SDK has an invalid value. In most cases this can be resolved by presenting UI to
   re-enter the data correctly. See AKFInvalidParameterValueErrorCode for underlying error codes.
   */
  AKFInvalidParameterValueError = 400,
};

NS_ASSUME_NONNULL_END
