import {Player} from '@react-native-community/audio-toolkit';

export const playCoinSound = (type:number) => {

    let coinSound = ''
    
    switch (type){
        case 1:
          coinSound = 'token1.mp3';
          break;

        case 3:
          coinSound = 'token3.mp3';
          break;

        case 5:
          coinSound = 'token5.mp3';
          break;

        case 7:
          coinSound = 'token7.mp3';
          break;
    }

    new Player(coinSound).play();
}