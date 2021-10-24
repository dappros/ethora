/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

//replace any caps in a string with "_" followed with respective small case

export const underscoreManipulation = (str)=>{
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export const reverseUnderScoreManipulation = (str) => {
    return str.replace(/_([a-z])/gm, (m1, m2)=>{
        return m2.toUpperCase();
    });
}
