import moment from 'moment';
moment.locale('ko');

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

function format(dateString) {
  return moment(dateString).format(DATE_FORMAT);
}

export {
  format
};