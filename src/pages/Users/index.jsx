import React, { useEffect, useState } from 'react';
import Template from '../Template';
import users from '../../attributes/users'

const index = () => {
	const [derived, setDerived] = useState({collection:'users',singular:'',moduleColumns:[]})
	useEffect(() => {
		users().then(x=>setDerived(x))
	}, [])

	return (
		<div>
			<Template {...derived} />
		</div>
	);
};
export default index;
