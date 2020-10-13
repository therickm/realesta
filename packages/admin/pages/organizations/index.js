import React from 'react'
import CrudTable from '../../components/CrudTable'

const organizations = () => {
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            formComponent: 'input',
            hideInForm: true
        },
        {
            title: 'Organization Name',
            dataIndex: 'name',
            key: 'name',
            formComponent: 'input',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            formComponent: 'input',
        },
        {
            title: 'Address',
            key: 'address',
            dataIndex: 'address',
            formComponent: 'input',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            formComponent: 'input',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
            formComponent: 'password',
        },
    ];
    return (
        <CrudTable columns={columns} collection={'organizations'} />
    )
}

export default organizations
