
const pages = {
    ROLES:{
        name: 'Roles',
        icon: 'KeyOutlined',
        path: '/roles',
        component: './Roles',
        collection:'roles',
        singular:'Role',
    },
    USERS:{
        name: 'Users',
        icon: 'KeyOutlined',
        path: '/users',
        component: './Users',
        collection:'users',
        singular:'User',
    },
    PROPERTIES:{
        name: 'Properties',
        icon: 'KeyOutlined',
        path: '/properties',
        component: './Properties',
        collection:'properties',
        singular:'Property',
    },
    LANDLORDS:{
        name: 'Landlords',
        icon: 'KeyOutlined',
        path: '/landlords',
        component: './Landlords',
        collection:'landlords',
        singular:'Landlord',
    },
    TENANTS:{
        name: 'Tenants',
        icon: 'KeyOutlined',
        path: '/tenants',
        component: './Tenants',
        collection:'tenants',
        singular:'Tenant',
    },
    UNITS:{
        name:'Property Units',
        collection:'units',
        singular:'Unit'
    },
    INVOICES:{
        name:'Invoices',
        icon: 'KeyOutlined',
        path: '/invoices',
        component: './Invoices',
        collection:'invoices',
        singular:'Invoice'
    },
    RECEIPTS:{
        name:'Receipts',
        icon: 'KeyOutlined',
        path: '/receipts',
        component: './Receipts',
        collection:'receipts',
        singular:'Receipt'
    },
    COMPLAINTS:{
        name:'Complaints',
        icon: 'KeyOutlined',
        path: '/complaints',
        component: './Complaints',
        collection:'complaints',
        singular:'Complaint'
    },
    NOTES:{
        name:'Notes',
        icon: 'KeyOutlined',
        path: '/notes',
        component: './Notes',
        collection:'notes',
        singular:'Note'
        
    },
    EXPENSE:{
        name:'Expenses',
        icon: 'KeyOutlined',
        path: '/expenses',
        component: './Expenses',
        collection:'expenses',
        singular:'Expense'
    },
    TRANSACTIONS:{
        name:'Transactions',
        icon: 'KeyOutlined',
        path: '/transactions',
        component: './Transactions',
        collection:'transactions',
        singular:'Transaction'
    },
    ACCOUNTS:{
        name:'Accounts',
        icon: 'KeyOutlined',
        path: '/accounts',
        component: './Accounts',
        collection:'accounts',
        singular:'Account'
    },
    OCCUPATION:{
        name:'Income Collection',
        icon: 'KeyOutlined',
        path: '/collection',
        component: './Collections',
        collection:'occupations',
        singular:'Occupation'
    },
    
}


const settings = {
    USER_TYPES:{
        name:'User Types',
        collection:'user_types',
        singular:'User Type'
    },
    INCOME_EXPENSE_TYPES:{
        name:'Income & Expense Types',
        collection:'income_expense_types',
        singular:'Type'
    },
    PAYMENT_OPTIONS:{
        name:'Payment Options',
        collection:'payment_options',
        singular:'Payment Option'
    },
}


export default {...pages, ...settings}