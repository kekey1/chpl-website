import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import EditIcon from '@material-ui/icons/Edit';
import NotesOutlinedIcon from '@material-ui/icons/NotesOutlined';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
import TouchAppOutlinedIcon from '@material-ui/icons/TouchAppOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { number, string } from 'prop-types';

import ChplListingHistory from './history';

import { useFetchListing } from 'api/listing';
import ChplActionButton from 'components/action-widget/action-button';
import ChplBrowserViewedWidget from 'components/browser/browser-viewed-widget';
import ChplAdditionalInformation from 'components/listing/details/additional-information/additional-information';
import ChplCompliance from 'components/listing/details/compliance/compliance';
import ChplCqms from 'components/listing/details/cqms/cqms';
import ChplCriteria from 'components/listing/details/criteria/criteria';
import ChplG1G2 from 'components/listing/details/g1g2/g1g2';
import ChplListingInformation from 'components/listing/details/listing-information/listing-information';
import ChplSed from 'components/listing/details/sed/sed';
import ChplSubscribe from 'components/subscriptions/subscribe';
import { ChplLink, InternalScrollButton } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext, FlagContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '32px 0',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  navigation: {
    backgroundColor: palette.white,
    display: 'flex',
    flexDirection: 'row',
    position: 'sticky',
    top: '0',
    zIndex: '1299',
    gap: '16px',
    borderRadius: '4px',
    overflowX: 'scroll',
    boxShadow: 'rgb(149 157 165 / 50%) 0px 4px 16px',
    border: `.5px solid ${palette.divider}`,
    [theme.breakpoints.up('sm')]: {
      top: '100px',
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      overflowX: 'hidden',
      flexDirection: 'column',
      position: 'sticky',
      top: '104px',
      gap: '16px',
      zIndex: '100',
    },
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'visible',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  menuItems: {
    display: 'flex',
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
  content: {
    display: 'grid',
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
    gridGap: '16px',
  },
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    padding: '16px',
    backgroundColor: palette.secondary,
    borderBottom: `.5px solid ${palette.divider}`,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  sectionHeaderText: {
    fontSize: '1.5em !important',
    fontWeight: '600 !important',
  },
  listingHeaderBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gridGap: '16px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'center',
      gridGap: 'none',
    },
  },
});

function ChplListingPage({ id, panel }) {
  const $state = getAngularService('$state');
  const { data, isLoading, isSuccess } = useFetchListing({ id });
  const { hasAnyRole, user } = useContext(UserContext);
  const { isOn } = useContext(FlagContext);
  const [listing, setListing] = useState(undefined);
  const [seeAllCqms, setSeeAllCqms] = useState(false);
  const [seeAllCriteria, setSeeAllCriteria] = useState(false);
  const [subscriptionsIsOn, setSubscriptionsIsOn] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setListing(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    setSubscriptionsIsOn(isOn('subscriptions'));
  }, [isOn]);

  useEffect(() => {
    if (!panel || !listing) { return; }
    const target = document.getElementById(panel);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [listing, panel]);

  const canEdit = () => {
    if (hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) { return true; }
    if (listing.certificationEdition.name !== '2015') { return false; }
    if (hasAnyRole(['ROLE_ACB']) && user.organizations.some((o) => o.id === listing.certifyingBody.id)) { return true; }
    return false;
  };

  const canManageSurveillance = () => {
    if (hasAnyRole(['ROLE_ADMIN'])) { return true; }
    if (listing.certificationEdition.name !== '2015') { return false; }
    if (hasAnyRole(['ROLE_ACB']) && user.organizations.some((o) => o.id === listing.certifyingBody.id)) { return true; }
    return false;
  };

  const edit = () => {
    $state.go('listing.view.edit');
  };

  if (isLoading || !isSuccess || !listing) {
    return <CircularProgress />;
  }

  return (
    <Box bgcolor="#f9f9f9">
      <ChplBrowserViewedWidget
        listing={listing}
      />
      <div className={classes.pageHeader}>
        <Container maxWidth="lg">
          <Box className={classes.listingHeaderBox}>
            <Box>
              <Typography
                variant="h1"
              >
                {listing.product.name}
              </Typography>
            </Box>
            <Box>
              <ChplActionButton
                listing={listing}
                horizontal
              >
                { canEdit()
                 && (
                   <Button
                     endIcon={<EditIcon />}
                     size="small"
                     variant="contained"
                     color="primary"
                     onClick={edit}
                   >
                     Edit
                   </Button>
                 )}
                <ChplListingHistory
                  listing={listing}
                  canSeeHistory={canEdit()}
                />
              </ChplActionButton>
            </Box>
          </Box>
        </Container>
      </div>
      <Container maxWidth="lg">
        <div className={classes.container} id="main-content" tabIndex="-1">
          <div className={classes.navigation}>
            <Box className={classes.menuContainer}>
              <Box
                className={classes.menuItems}
              >
                <InternalScrollButton
                  id="listingInformation"
                  analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Listing Information' }}
                >
                  Listing Information
                  <NotesOutlinedIcon className={classes.iconSpacing} />
                </InternalScrollButton>
              </Box>
              <Box
                className={classes.menuItems}
              >
                <InternalScrollButton
                  id="certificationCriteria"
                  analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Certification Criteria' }}
                >
                  Certification Criteria
                  <BookOutlinedIcon className={classes.iconSpacing} />
                </InternalScrollButton>
              </Box>
              <Box
                className={classes.menuItems}
              >
                <InternalScrollButton
                  id="clinicalQualityMeasures"
                  analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Clinical Quality Measures' }}
                >
                  Clinical Quality Measures
                  <DoneAllOutlinedIcon className={classes.iconSpacing} />
                </InternalScrollButton>
              </Box>
              {listing.certificationEdition.name !== '2011'
                  && (
                    <Box
                      className={classes.menuItems}
                    >
                      <InternalScrollButton
                        id="sed"
                        analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Safety Enhanced Design' }}
                      >
                        Safety Enhanced Design (SED)
                        <TouchAppOutlinedIcon className={classes.iconSpacing} />
                      </InternalScrollButton>
                    </Box>
                  )}
              <Box
                className={classes.menuItems}
              >
                <InternalScrollButton
                  id="g1g2Measures"
                  analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'G1/G2 Measures' }}
                >
                  G1/G2 Measures
                  <AssessmentOutlinedIcon className={classes.iconSpacing} />
                </InternalScrollButton>
              </Box>
              <Box
                className={classes.menuItems}
              >
                <InternalScrollButton
                  id="compliance"
                  analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Compliance Activities' }}
                >
                  Compliance Activities
                  <SecurityOutlinedIcon className={classes.iconSpacing} />
                </InternalScrollButton>
              </Box>
              <Box
                className={classes.menuItems}
              >
                <InternalScrollButton
                  id="additional"
                  analytics={{ event: 'Jump to Listing Section', category: 'Navigation', label: 'Additional Information' }}
                >
                  Additional Information
                  <InfoOutlinedIcon className={classes.iconSpacing} />
                </InternalScrollButton>
              </Box>
            </Box>
          </div>
          { subscriptionsIsOn
          && (
            <Box>
              <ChplSubscribe
                subscribedObjectId={listing.id}
                subscribedObjectTypeId={1}
              />
            </Box>
          )}
          <div className={classes.content}>
            <Card>
              <span className="anchor-element">
                <span id="listingInformation" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">Listing Information</Typography>
              </Box>
              <CardContent>
                <ChplListingInformation
                  listing={listing}
                />
              </CardContent>
            </Card>
            <Card>
              <span className="anchor-element">
                <span id="certificationCriteria" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">Certification Criteria</Typography>
                <div>
                  <FormControlLabel
                    control={(
                      <Switch
                        id="see-all-criteria"
                        name="seeAllCriteria"
                        checked={seeAllCriteria}
                        color="primary"
                        onChange={() => setSeeAllCriteria(!seeAllCriteria)}
                      />
                    )}
                    label="See all Certification Criteria"
                  />
                  (
                  {listing.certificationResults.filter((cr) => cr.success).length}
                  {' '}
                  found)
                </div>
              </Box>
              <CardContent>
                <ChplCriteria
                  certificationResults={listing.certificationResults}
                  viewAll={seeAllCriteria}
                />
              </CardContent>
            </Card>
            <Card>
              <span className="anchor-element">
                <span id="clinicalQualityMeasures" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">Clinical Quality Measures</Typography>
                <div>
                  <FormControlLabel
                    control={(
                      <Switch
                        id="see-all-cqms"
                        name="seeAllCqms"
                        color="primary"
                        checked={seeAllCqms}
                        onChange={() => setSeeAllCqms(!seeAllCqms)}
                      />
                    )}
                    label="See all CQMs"
                  />
                  (
                  {listing.cqmResults.filter((cqm) => cqm.success).length}
                  {' '}
                  found)
                </div>
              </Box>
              <CardContent>
                <ChplCqms
                  cqms={listing.cqmResults}
                  edition={listing.certificationEdition}
                  viewAll={seeAllCqms}
                />
              </CardContent>
            </Card>
            {listing.certificationEdition.name !== '2011'
             && (
               <Card>
                 <span className="anchor-element">
                   <span id="sed" className="page-anchor" />
                 </span>
                 <Box className={classes.sectionHeader}>
                   <Typography className={classes.sectionHeaderText} variant="h2">Safety Enhanced Design (SED)</Typography>
                 </Box>
                 <CardContent>
                   <ChplSed
                     listing={listing}
                   />
                 </CardContent>
               </Card>
             )}
            <Card>
              <span className="anchor-element">
                <span id="g1g2Measures" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">G1/G2 Measures</Typography>
              </Box>
              <CardContent>
                <ChplG1G2
                  measures={listing.measures}
                />
              </CardContent>
            </Card>
            <Card>
              <span className="anchor-element">
                <span id="compliance" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">Compliance Activities</Typography>
              </Box>
              <CardContent>
                <ChplCompliance
                  directReviews={listing.directReviews}
                  directReviewsAvailable={listing.directReviewsAvailable}
                  surveillance={listing.surveillance}
                />
                { canManageSurveillance()
                 && (
                   <ChplLink
                     href="#/surveillance/manage"
                     text="Manage Surveillance Activity"
                     external={false}
                     router={{ sref: 'surveillance.manage', options: { listingId: listing.id, chplProductNumber: listing.chplProductNumber } }}
                   />
                 )}
              </CardContent>
            </Card>
            <Card>
              <span className="anchor-element">
                <span id="additional" className="page-anchor" />
              </span>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionHeaderText} variant="h2">Additional Information</Typography>
              </Box>
              <CardContent>
                <ChplAdditionalInformation
                  listing={listing}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Box>
  );
}

export default ChplListingPage;

ChplListingPage.propTypes = {
  id: number.isRequired,
  panel: string,
};

ChplListingPage.defaultProps = {
  panel: undefined,
};
