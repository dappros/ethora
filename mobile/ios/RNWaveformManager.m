//
//  RNWaveformManager.m
//  ethora
//
//  Created by Михайло Могилюк on 16.11.2021.
//


#import "React/RCTBridgeModule.h"


@interface RCT_EXTERN_MODULE(RNWaveform, NSObject)
RCT_EXTERN_METHOD(loadAudioFile: (RCTPromiseResolveBlock *)resolve rejecter:(RCTPromiseRejectBlock * )reject)
@end
