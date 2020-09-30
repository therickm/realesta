import React, { useEffect, useState } from 'react';
import users from '../../attributes/users'
import Page from '../Template/Page';

const index = () => {
	const [derived, setDerived] = useState({collection:'users',singular:'',moduleColumns:[]})
	useEffect(() => {
		users().then(x=>setDerived(x))
	}, [])

	return (
		<div>
			<Page {...derived} />
		</div>
	);
};
export default index;
