import mocker from 'mocker-data-generator'
import { addBulkData } from '@/pages/Template/service'
import DB from './database'

var id_types = ['national_id', 'driving_permit', 'passport', 'others']
var landlord = {
    _id: {
        faker: 'random.uuid'
    },
    title: {
        faker: 'name.suffix'
    },
    sur_name: {
        faker: 'name.lastName'
    },
    first_name: {
        faker: 'name.firstName'
    },
    middle_name: {
        faker: 'name.firstName'
    },
    email: {
        faker: 'internet.email'
    },
    phone: {
        faker: 'phone.phoneNumber'
    },
    mobile: {
        faker: 'phone.phoneNumber'
    },
    createdAt: {
        faker: 'date.past'
    },
    id_type:
    {
        values: id_types
    },
    id_number: {
        faker: 'random.alphaNumeric(13)'
    },
    type: {
        values: ['landlords']
    }
}
var tenant = {
    ...landlord,
    type: {
        values: ['tenants']
    }
}

var property = {
    _id: {
        faker: 'random.uuid'
    },
    landlord: {
        hasOne: 'landlords',
        get: '_id'
    },
    name: {
        faker: 'lorem.words(2)'
    },
    address: {
        faker: 'address.city'
    },
    management_percentage: {
        faker: 'random.number({"min":8,"max":12})'
    },
    remark: {
        faker: 'lorem.sentence'
    },
    type: {
        values: ['properties']
    }
}

var unit = {
    _id: {
        faker: 'random.uuid'
    },
    code: {
        faker: 'random.alphaNumeric(5)'
    },
    rent: {
        function: function () {
            return (
                Math.floor(Math.random() * 1000) * 1000
            )
        }
    },
    rooms: {
        faker: 'random.number({"min":1,"max":3})'
    },
    water_meter: {
        faker: 'random.number'
    },
    electricity_meter: {
        faker: 'random.number'
    },
    description: {
        faker: 'lorem.sentence'
    },
    property_id: {
        hasOne: 'properties',
        get: '_id',
        eval: true
    },
    type: {
        values: ['units']
    }
}

var occupations = {
    _id: {
        faker: 'random.uuid'
    },
    dateIn: {
        faker: 'date.past'
    },
    type: {
        values: ['occupations']
    }
}
var invoice = {
    _id: {
        faker: 'random.uuid'
    },
    tenant: {
        hasOne: 'occupations',
        get: '_id',
        eval: true
    },
    category: {
        values: ['Rent', 'Security Deposit', 'Utilities', 'Others']
    },
    amount: {
        function: function () {
            return (
                Math.floor(Math.random() * 1000) * 1000
            )
        }
    },
    type: {
        values: ['invoices']
    },
    createdAt: {
        faker: "date.between('2020-08-28', '2020-12-09')"
    },
}
var receipt = {
    _id: {
        faker: 'random.uuid'
    },
    tenant: {
        hasOne: 'occupations',
        get: '_id',
        eval: true
    },
    category: {
        values: ['Rent', 'Security Deposit', 'Utilities', 'Others']
    },
    amount: {
        function: function () {
            return (
                Math.floor(Math.random() * 1000) * 1000
            )
        }
    },
    particulars: {
        faker: 'lorem.words(15)'
    },
    type: {
        values: ['receipts']
    },
    createdAt: {
        faker: "date.between('2020-08-28', '2020-12-09')"
    },
}

var expense = {
    _id: {
        faker: 'random.uuid'
    },
    landlord: {
        hasOne: 'landlords',
        get: '_id',
        eval: true
    },
    expense_type: {
        values: ['Payment', 'Expense', 'Utilities', 'Others']
    },
    income_center: {
        values: ['Rent', 'Security Deposit', 'Utilities', 'Others']
    },
    amount: {
        function: function () {
            return (
                Math.floor(Math.random() * 1000) * 1000
            )
        }
    },
    particulars: {
        faker: 'lorem.words(15)'
    },
    type: {
        values: ['expenses']
    },
    createdAt: {
        faker: "date.between('2020-08-28', '2020-12-09')"
    },
}

export async function fakeData() {
    mocker()
        .schema('landlords', landlord, 2)
        .schema('tenants', tenant, 10)
        .schema('properties', property, 3)
        .schema('units', unit, 12)
        .schema('occupations', occupations, 10)
        .schema('invoices', invoice, 500)
        .schema('receipts', receipt, 450)
        .schema('expenses', expense, 300)
        .build()
        .then(
            data => {
                let newOccupations = []
                data.occupations.map((v, k) => newOccupations.push({ ...v, tenant: data.tenants[k]._id, unit: data.units[k]._id }))
                data.occupations = newOccupations
                console.log(data)


                Object.keys(data).map(async (v) => {
                    console.log(v, data[v]);
                    // await new DB(v).bulkAdd(data[v])
                })
            },
            err => console.error(err)
        )
}