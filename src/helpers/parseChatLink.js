/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {unv_url, unv_url1} from '../../docs/config';

export default parseChatLink = url => {
  let parsedLink = '';
  if (url.includes(unv_url)) {
    parsedLink = url.replace(unv_url, '');
  }
  if (url.includes(unv_url1)) {
    parsedLink = url.replace(unv_url1, '');
  }
  return parsedLink;
};
