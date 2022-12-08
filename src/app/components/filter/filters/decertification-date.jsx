import {
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';

const filter = {
  ...defaultFilter,
  key: 'decertificationDate',
  display: 'Decertification Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'decertificationDateStart' : 'decertificationDateEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
};

export default filter;
