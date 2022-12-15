package com.ethora;

import android.content.Context;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;


import linc.com.amplituda.Amplituda;
import linc.com.amplituda.AmplitudaResult;
import linc.com.amplituda.exceptions.io.AmplitudaIOException;


public class Waveform extends ReactContextBaseJavaModule {
   Waveform(ReactApplicationContext context) {
       super(context);
   }
   public String result;
    public void processAudio(String filePath) {
        Context mContext=getReactApplicationContext();
        Amplituda amplituda = new Amplituda(mContext);

        amplituda.processAudio(filePath).get(result -> getAmpResult(result), exception -> {
                    if(exception instanceof AmplitudaIOException) {
                        System.out.println("IO Exception!");
                    }
                });


    }
    public void getAmpResult(AmplitudaResult<?> input) {
        result = input.amplitudesAsJson();
    }
    @Override
    public String getName() {
    return "Waveform";
    }

    @ReactMethod
    public void getWaveformArray(String filePath, Promise promise ) {
            this.processAudio(filePath);
        try{
        promise.resolve(this.result);
        }catch (Exception e){
            promise.reject("Create Event Error", e);
        }
    }
}