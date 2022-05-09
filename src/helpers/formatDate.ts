import {format} from 'date-fns';

export const formatDate = date => {
  try {
    return format(new Date(date), 'dd LLLL yyyy');
  } catch (error) {
    console.log('ERROR: Cannot format date', error);
    return '';
  }
};
