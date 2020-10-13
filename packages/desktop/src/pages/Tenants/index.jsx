import React, { useEffect, useState } from 'react';
import Page from '../Template/Page';
import tenants from '@/attributes/tenants';

const index = () => {
	return (
		<div>
			<Page {...tenants} />
		</div>
	);
};
export default index;
