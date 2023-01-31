//
//  RNWaweform.swift
//  ethora
//
//  Created by Михайло Могилюк on 16.11.2021.
//
import Foundation
import React
import AVFoundation 


@objc (RNWaveform)
class RNWaveform : NSObject  {
  
  
  // Calling a routine & get response back
  func json(from object:Any) -> String? {
      guard let data = try? JSONSerialization.data(withJSONObject: object, options: []) else {
          return nil
      }
      return String(data: data, encoding: String.Encoding.utf8)
  }
  @objc(loadAudioFile:rejecter:)
  func loadAudioFile(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    let recordingName = "audio.m4a"
    let dirPath = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first
    let desURL = dirPath?.appendingPathComponent(recordingName)
    
//    let pathArray = [dirPath.absoluteString, recordingName]
//    let filePath = URL(fileURLWithPath: pathArray.joined(separator: "/"))
    
    let file = try! AVAudioFile(forReading: desURL!)
    let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: file.fileFormat.sampleRate, channels: file.fileFormat.channelCount, interleaved: false)!

      let buf = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: 1024)!
      try! file.read(into: buf)

      // this makes a copy, you might not want that
    let floatArray = Array(UnsafeBufferPointer(start: buf.floatChannelData?[0], count:Int(buf.frameLength)))
   
    let result: NSMutableArray = []
        for item in floatArray {
          result.add(item)
        }
  
    resolve(result)

  }
}
