import React, { useEffect, useState } from 'react';
import Template from './Template';
import tenants from '../attributes/tenants'

const index = () => {
	return (
		<div>
			<Template {...tenants} />
		</div>
	);
};
export default index;
