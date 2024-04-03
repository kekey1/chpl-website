import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@material-ui/lab';
import { bool, object } from 'prop-types';

import compareSystemMaintenance from './services/system-maintenance.service';

import { useFetchActivity } from 'api/activity';
import { getDisplayDateFormat } from 'services/date-util';
import { palette } from 'themes';

const useStyles = makeStyles({
  dateText: {
    color: palette.greyDark,
  },
});

function ChplSystemMaintenanceActivityDetails({ activity, last }) {
  const [details, setDetails] = useState([]);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchActivity({
    id: activity.id,
    isEnabled: true,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data) {
      setDetails([]);
      return;
    }
    setDetails(compareSystemMaintenance(data?.originalData, data?.newData)
      .map((item) => `<li>${item}</li>`)
      .join(''));
  }, [data, isError, isLoading]);

  if (!activity || !activity.id) {
    return null;
  }

  return (
    <TimelineItem key={activity.id}>
      <TimelineSeparator>
        <TimelineDot color="primary" />
        { !last && <TimelineConnector /> }
      </TimelineSeparator>
      <TimelineContent>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <span style={{ fontWeight: 'bold' }}>
            {activity.description}
          </span>
          <Chip size='small' variant="outlined" label="placeholder"/>
        </Box>
        <Typography variant="body2" className={classes.dateText}>
          {` (${activity.responsibleUser.fullName})`}
          {' '}
          { getDisplayDateFormat(activity.date) }
        </Typography>
        { activity.id && details?.length > 0
          && (
            <ul dangerouslySetInnerHTML={{ __html: details }} />
          )}
      </TimelineContent>
    </TimelineItem>
  );
}

export default ChplSystemMaintenanceActivityDetails;

ChplSystemMaintenanceActivityDetails.propTypes = {
  activity: object.isRequired,
  last: bool.isRequired,
};
