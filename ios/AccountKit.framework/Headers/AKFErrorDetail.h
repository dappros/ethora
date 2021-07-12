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
  The AccountKit error domain for server errors (underlying errors).
 */
extern NSString *const AKFServerErrorDomain;

/**
 AKFServerErrorCode

  Detail error codes for server errors.
 */
typedef NS_ENUM(NSInteger, AKFServerErrorCode)
{
  /**
    An invalid parameter value was found.


 The SDK does not know how to handle this parameter value from the server.
   */
  AKFInvalidServerParameterValueError = 201,
};

/**
 AKFLoginRequestInvalidatedErrorCode

  Detail error codes for login request invalidated errors.
 */
typedef NS_ENUM(NSInteger, AKFLoginRequestInvalidatedErrorCode)
{
  /**
    The request has expired without completing.
   */
  AKFLoginRequestExpiredError = 301,
};

/**
 AKFInvalidParameterValueErrorCode

  Detail error codes for invalid parameter errors.
 */
typedef NS_ENUM(NSInteger, AKFInvalidParameterValueErrorCode)
{
  /**
    The email address value is invalid.
   */
  AKFInvalidEmailAddressError = 401,

  /**
    The phone number value is invalid.
   */
  AKFInvalidPhoneNumberError = 402,

  /**
    The value is not of the appropriate type for NSCoding.
   */
  AKFInvalidCodingValueError = 403,

  /**
    No valid access token is available.
   */
  AKFInvalidAccessTokenError = 404,

  /**
    The key for account preferences is invalid.
   */
  AKFInvalidAccountPreferenceKeyError = 405,

  /**
    The value for account preferences is invalid.
   */
  AKFInvalidAccountPreferenceValueError = 406,

  /**
    The operation was not successful.
   */
  AKFOperationNotSuccessful = 407,

  /**
    The provided UIManager is not valid
   */
  AKFInvalidUIManager = 408,
};

/**
 AKFServerResponseErrorCode

  Detail error codes for server response errors.
 */
typedef NS_ENUM(NSInteger, AKFServerResponseErrorCode)
{
  AKFServerResponseErrorCodeInvalidConfirmationCode = 15003,
};

NS_ASSUME_NONNULL_END
