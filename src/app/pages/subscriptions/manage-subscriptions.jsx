import React, { useState } from 'react';

import ChplManageSubscriptionsView from './manage-subscriptions-view';

import { FilterProvider } from 'components/filter';
import {
  subscriptionType,
} from 'components/filter/filters';

const staticFilters = [
  subscriptionType,
];

function ChplManageSubscriptionsPage() {
  const [filters] = useState(staticFilters);

  const analytics = {
    category: 'Manage Subscriptions',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-manageSubscriptionsPage"
    >
      <ChplManageSubscriptionsView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplManageSubscriptionsPage;

ChplManageSubscriptionsPage.propTypes = {
};
