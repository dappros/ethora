/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Player } from "@react-native-community/audio-toolkit"

export const playCoinSound = (type: number) => {
  let coinSound = ""
  switch (type) {
    case 1:
      coinSound = "token1.mp3"
      break

    case 3:
      coinSound = "token3.mp3"
      break

    case 5:
      coinSound = "token5.mp3"
      break

    case 7:
      coinSound = "token7.mp3"
      break
    default:
      coinSound = "token7.mp3"
  }
  console.log(coinSound)
  new Player(coinSound).play()
}
