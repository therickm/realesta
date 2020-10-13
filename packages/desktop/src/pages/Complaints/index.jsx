import React, { useEffect, useState } from 'react';
import complaints from '@/attributes/complaints';
import Page from '../Template/Page';

const index = () => {
	const [derived, setDerived] = useState({collection:'complaints',singular:'',moduleColumns:[]})
	useEffect(() => {
		complaints().then(x=>setDerived(x))
	}, [])

	console.log(derived.moduleColumns);

	return (
		<div>
			<Page {...derived} />
		</div>
	);
};
export default index;
