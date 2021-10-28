import React, { useContext, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  changeRequest as changeRequestProp,
  changeRequestStatusType,
} from '../../shared/prop-types';
import ChplActionBar from '../action-bar';
import { ChplTextField } from '../util';
import { UserContext } from '../../shared/contexts';
import theme from '../../themes/theme';

import ChplChangeRequestAttestationEdit from './types/attestation-edit';
import ChplChangeRequestDetailsEdit from './types/details-edit';
import ChplChangeRequestWebsiteEdit from './types/website-edit';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  actionContainer: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto 1fr',
    },
  },
  actionSubContainer: {
    display: 'grid',
    gap: '16px',
    alignContent: 'flex-start',
  },
  actionDivider: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
    },
  },
});

const validationSchema = yup.object({
  comment: yup.string()
    .test('conditionallyRequired',
      'Reason for Change is required',
      (value, context) => (!!value || (context.parent.changeRequestStatusType?.name !== 'Rejected' && context.parent.changeRequestStatusType?.name !== 'Pending Developer Action'))),
  changeRequestStatusType: yup.object()
    .required('Change Request status is required'),
});

function ChplChangeRequestEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const { hasAnyRole } = useContext(UserContext);
  const [details, setDetails] = useState(props.changeRequest.details);
  const {
    changeRequest,
    changeRequestStatusTypes,
  } = props;
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

  const getInitialStatusState = () => {
    if (hasAnyRole(['ROLE_DEVELOPER'])) {
      if (changeRequest.currentStatus.changeRequestStatusType.name === 'Pending Developer Action') {
        return changeRequestStatusTypes.filter((type) => type.name === 'Pending ONC-ACB Action')[0];
      }
      return changeRequestStatusTypes.filter((type) => type.name === 'Pending Developer Action')[0];
    }
    return '';
  };

  const handleUpdate = (data) => {
    switch (changeRequest.changeRequestType.name) {
      case 'Developer Attestation Change Request':
        setDetails({
          ...details,
          attestation: data.attestation,
        });
        break;
      case 'Developer Details Change Request':
        setDetails({
          ...details,
          address: {
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
            country: data.country,
          },
          contact: {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            title: data.title,
          },
          selfDeveloper: data.selfDeveloper,
        });
        break;
      case 'Website Change Request':
        setDetails({
          ...details,
          website: data.website,
        });
        break;
        // no default
    }
  };

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'cancel':
        props.dispatch('close');
        break;
      case 'update':
        handleUpdate(data);
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const isReasonDisabled = () => hasAnyRole(['ROLE_DEVELOPER']) && changeRequest.currentStatus.changeRequestStatusType.name === 'Pending ONC-ACB Action';

  const isReasonRequired = () => formik.values.changeRequestStatusType?.name === 'Rejected'
        || (formik.values.changeRequestStatusType?.name === 'Pending Developer Action' && !hasAnyRole(['ROLE_DEVELOPER']));

  formik = useFormik({
    initialValues: {
      comment: '',
      changeRequestStatusType: getInitialStatusState(),
    },
    onSubmit: () => {
      const updated = {
        ...changeRequest,
        currentStatus: {
          comment: formik.values.comment,
          changeRequestStatusType: formik.values.changeRequestStatusType,
        },
        details,
      };
      props.dispatch('save', updated);
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <Card>
      <CardHeader className={classes.cardHeader} title="Edit Change Request" />
      <CardContent>
        <div className={classes.container}>
          <div>
            { changeRequest.changeRequestType.name === 'Developer Attestation Change Request'
              && (
                <ChplChangeRequestAttestationEdit
                  changeRequest={changeRequest}
                  dispatch={handleDispatch}
                />
              )}
            { changeRequest.changeRequestType.name === 'Developer Details Change Request'
              && (
                <ChplChangeRequestDetailsEdit
                  changeRequest={changeRequest}
                  dispatch={handleDispatch}
                />
              )}
            { changeRequest.changeRequestType.name === 'Website Change Request'
              && (
                <ChplChangeRequestWebsiteEdit
                  changeRequest={changeRequest}
                  dispatch={handleDispatch}
                />
              )}
          </div>
          <div className={classes.actionContainer}>
            <Divider className={classes.actionDivider} orientation="vertical" />
            <div className={classes.actionSubContainer}>
              <Typography variant="subtitle1">Change Request change data</Typography>
              <Typography variant="subtitle2">Current status</Typography>
              <Typography>{changeRequest.currentStatus.changeRequestStatusType.name}</Typography>
              {hasAnyRole(['ROLE_DEVELOPER'])
                ? (
                  <Typography>
                    {changeRequest.currentStatus.changeRequestStatusType.name === 'Pending Developer Action'
                    && (
                      <>
                        Status will be set to &quot;Pending ONC-ACB Action&quot;
                      </>
                    )}
                    {changeRequest.currentStatus.changeRequestStatusType.name === 'Pending ONC-ACB Action'
                    && (
                      <>
                        No status change will occur
                      </>
                    )}
                  </Typography>
                )
                : (
                  <ChplTextField
                    select
                    id="change-request-status-type"
                    name="changeRequestStatusType"
                    label="Select new Status"
                    required
                    value={formik.values.changeRequestStatusType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.changeRequestStatusType && !!formik.errors.changeRequestStatusType}
                    helperText={formik.touched.changeRequestStatusType && formik.errors.changeRequestStatusType}
                  >
                    {changeRequestStatusTypes.map((item) => (
                      <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
                    ))}
                  </ChplTextField>
                )}
              <ChplTextField
                id="comment"
                name="comment"
                label="Reason for change"
                margin="none"
                required={isReasonRequired()}
                disabled={isReasonDisabled()}
                multiline
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.comment && !!formik.errors.comment}
                helperText={formik.touched.comment && formik.errors.comment}
                rows={4}
              />
            </div>
          </div>
          <ChplActionBar
            dispatch={handleDispatch}
            isDisabled={!formik.isValid}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ChplChangeRequestEdit;

ChplChangeRequestEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  changeRequestStatusTypes: arrayOf(changeRequestStatusType).isRequired,
  dispatch: func.isRequired,
};
