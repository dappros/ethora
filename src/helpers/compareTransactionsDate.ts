import {formatDate} from './formatDate';

export const compareTransactionsDate = (transactions:any) => {
  let currentDate = '';
  return transactions.map((item:any) => {
    let showDate = false;
    let formattedDate = '';
    const formattedTimestamp = formatDate(item.timestamp);
    if (!currentDate || currentDate !== formattedTimestamp) {
      currentDate = formattedTimestamp;
      showDate = true;
      formattedDate = currentDate;
    } else {
      showDate = false;
    }
    return {...item, showDate, formattedDate};
  });
};
