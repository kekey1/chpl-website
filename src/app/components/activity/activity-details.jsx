import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { object } from 'prop-types';

import { useFetchActivity } from 'api/activity';
import { ChplDialogTitle, ChplTooltip } from 'components/util';
import { compareDeveloper } from 'pages/reports/developers/developers.service';
import { compareListing } from 'pages/reports/listings/listings.service';
import { compareProduct } from 'pages/reports/products/products.service';
import { compareVersion } from 'pages/reports/versions/versions.service';
import { getDisplayDateFormat } from 'services/date-util';

const useStyles = makeStyles({
  legendTitle: {
    fontSize: '1.25em',
  },
  rowHeader: {
    color: '#156dac',
    fontWeight: 'bold',
  },
});

const getDisplay = (title, value) => (
  <Typography>
    {title}: {value}
  </Typography>
);

function ChplActivityDetails({ activity }) {
  const [details, setDetails] = useState(undefined);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchActivity({
    id: activity.activityId,
    isEnabled: open,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data) {
      setDetails(undefined);
      return;
    }
    switch (activity.triggerLevel) {
      case 'Certification Criteria':
      case 'Listing':
        setDetails(compareListing(data?.originalData, data?.newData)
                   .map((item) => `<li>${item}</li>`)
                   .join(''));
        break;
      case 'Developer':
        setDetails(compareDeveloper(data?.originalData, data?.newData)
                   .map((item) => `<li>${item}</li>`)
                   .join(''));
        break;
      case 'Product':
        setDetails(compareProduct(data?.originalData, data?.newData)
                   .map((item) => `<li>${item}</li>`)
                   .join(''));
        break;
      case 'Version':
        setDetails(compareVersion(data?.originalData, data?.newData)
                   .map((item) => `<li>${item}</li>`)
                   .join(''));
        break;
    }
  }, [isError, isLoading]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ChplTooltip title="Activity Details">
        <Button
          id={`view-activity-details-${activity.id}`}
          aria-label="Open Activity Details dialog"
          color="primary"
          variant="outlined"
          onClick={handleClickOpen}
          endIcon={<InfoIcon />}
        >
          Details
        </Button>
      </ChplTooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby={`activity-details-${activity.id}-title`}
        open={open}
        maxWidth="md"
      >
        <ChplDialogTitle
          id={`activity-details-${activity.id}-title`}
          onClose={handleClose}
          className={classes.legendTitle}
        >
          Activity Details
        </ChplDialogTitle>
        <DialogContent dividers>
          <Card>
            { getDisplay('id', activity.id) }
            { getDisplay('triggerLevel', activity.triggerLevel) }
            { getDisplay('triggerName', activity.triggerName) }
            { getDisplay('activityId', activity.activityId) }
            { getDisplay('before', activity.before) }
            { getDisplay('after', activity.after) }
            { getDisplay('activityDate', getDisplayDateFormat(activity.activityDate)) }
            { getDisplay('userId', activity.userId) }
            { getDisplay('username', activity.username) }
            { getDisplay('certificationStatusChangeReason', activity.certificationStatusChangeReason) }
            { getDisplay('reason', activity.reason) }
            { getDisplay('developerId', activity.developerId) }
            { getDisplay('developerName', activity.developerName) }
            { getDisplay('productId', activity.productId) }
            { getDisplay('productName', activity.productName) }
            { getDisplay('versionId', activity.versionId) }
            { getDisplay('versionName', activity.versionName) }
            { getDisplay('listingId', activity.listingId) }
            { getDisplay('chplProductNumber', activity.chplProductNumber) }
            { getDisplay('acbId', activity.acbId) }
            { getDisplay('acbName', activity.acbName) }
            { getDisplay('certificationStatusId', activity.certificationStatusId) }
            { getDisplay('certificationStatusName', activity.certificationStatusName) }
            { getDisplay('certificationCriterionId', activity.certificationCriterionId) }
            { activity.activityId && details?.length > 0
              && (
                <>
                  <Divider />
                  <ul dangerouslySetInnerHTML={{__html: details}}>
                  </ul>
                </>
              )}
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChplActivityDetails;

ChplActivityDetails.propTypes = {
  activity: object.isRequired,
};
