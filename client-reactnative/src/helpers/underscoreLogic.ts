/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

// This code replaces any caps in a string with "_" followed with respective small case - this is needed for cross-compatibility between Ethereum addresses and XMPP JIDs

export const underscoreManipulation = (str: string) => {
  if (str) {
    const rep = str.replace(/([A-Z])/g, "_$1").toLowerCase()
    return rep
  } else {
    return "invalid string passed"
  }
}

export const reverseUnderScoreManipulation = (str: string) => {
  return str.replace(/_([a-z])/gm, (m1: string, m2: string) => {
    return m2.toUpperCase()
  })
}
