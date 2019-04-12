import moment from 'moment';
import uniq from 'lodash.uniq';

const iterateRangeOfDate = ((availabilities) => {
  let days = [];

  // Iterate through each date range
  for (let i = 0; i < availabilities.length; i++) {
    const startDateObj = moment(availabilities[i].startdate);
    const endDateObj = moment(availabilities[i].enddate);
    while (startDateObj.isSameOrBefore(endDateObj)) {
      days.push(startDateObj.format("YYYY-MM-DD"))
      startDateObj.add(1, 'days');
    }
  }

  // Remove duplicates
  days = uniq(days);

  // Sort
  days.sort((a, b) => {
    a = moment(a);
    b = moment(b);
    if (a.isSameOrAfter(b)) {
      return -1;
    } 
    return 1;
  });

  return days;
});

export default iterateRangeOfDate;