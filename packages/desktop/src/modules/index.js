
const pages = {
    ROLES: {
        name: 'Roles',
        icon: 'KeyOutlined',
        path: '/roles',
        component: './Roles',
        collection: 'roles',
        singular: 'Role',
    },
    USERS: {
        name: 'Users',
        icon: 'UserSwitchOutlined',
        path: '/users',
        component: './Users',
        collection: 'users',
        singular: 'User',
    },
    PROPERTIES: {
        name: 'Properties',
        icon: 'HomeOutlined',
        path: '/properties',
        component: './Properties',
        collection: 'properties',
        singular: 'Property',
    },
    LANDLORDS: {
        name: 'Landlords',
        icon: 'UsergroupDeleteOutlined',
        path: '/landlords',
        component: './Landlords',
        collection: 'landlords',
        singular: 'Landlord',
    },
    TENANTS: {
        name: 'Tenants',
        icon: 'UsergroupAddOutlined',
        path: '/tenants',
        component: './Tenants',
        collection: 'tenants',
        singular: 'Tenant',
    },
    UNITS: {
        name: 'Property Units',
        collection: 'units',
        ixon: 'SafetyCertificateOutlined',
        singular: 'Unit'
    },
    INVOICES: {
        name: 'Invoices',
        icon: 'TransactionOutlined',
        path: '/invoices',
        component: './Invoices',
        collection: 'invoices',
        singular: 'Invoice'
    },
    RECEIPTS: {
        name: 'Receipts',
        icon: 'PayCircleOutlined',
        path: '/receipts',
        component: './Receipts',
        collection: 'receipts',
        singular: 'Receipt'
    },
    COMPLAINTS: {
        name: 'Complaints',
        icon: 'MessageOutlined',
        path: '/complaints',
        component: './Complaints',
        collection: 'complaints',
        singular: 'Complaint'
    },
    NOTES: {
        name: 'Notes',
        icon: 'ProfileOutlined',
        path: '/notes',
        component: './Notes',
        collection: 'notes',
        singular: 'Note'

    },
    EXPENSE: {
        name: 'Expenses',
        icon: 'AccountBookOutlined',
        path: '/expenses',
        component: './Expenses',
        collection: 'expenses',
        singular: 'Expense'
    },
    TRANSACTIONS: {
        name: 'Transactions',
        icon: 'InteractionOutlined',
        path: '/transactions',
        component: './Transactions',
        collection: 'transactions',
        singular: 'Transaction'
    },
    ACCOUNTS: {
        name: 'Accounts',
        icon: 'BankOutlined',
        path: '/accounts',
        component: './Accounts',
        collection: 'accounts',
        singular: 'Account'
    },
    OCCUPATION: {
        name: 'Income Collection',
        icon: 'MoneyCollectOutlined',
        path: '/collection',
        component: './Collections',
        collection: 'occupations',
        singular: 'Occupation'
    },

}


const settings = {
    USER_TYPES: {
        name: 'User Types',
        collection: 'user_types',
        singular: 'User Type'
    },
    INCOME_EXPENSE_TYPES: {
        name: 'Income & Expense Types',
        collection: 'income_expense_types',
        singular: 'Type'
    },
    PAYMENT_OPTIONS: {
        name: 'Payment Options',
        collection: 'payment_options',
        singular: 'Payment Option'
    },
}


export default { ...pages, ...settings }