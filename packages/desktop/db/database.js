import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { has, assign } from 'lodash';
import { processData } from '@/utils/utils';
PouchDB.plugin(PouchDBFind);



const organization = localStorage.getItem('organization')
const user = localStorage.getItem('organization') || 'System Generated'
export default class DB {
	constructor(name) {
		this.name = organization + '_' + name
		this.db = new PouchDB(organization + '_' + name, { auto_compaction: true });
		this.currentUser = user;
		// this.remoteDB = new PouchDB('https://couchdb-2afa5d.smileupps.com/' + name)	

	}
	dbSync = async () => {

		//Replicating a local database to Remote 
		// remote = 'https://ididi:pwdpwd@myaccount.cloudant.com/boaine_users',
		PouchDB.sync(this.name, 'https://therick:develop@realesta-db.herokuapp.com/' + this.name,)
			.then((res) => {
				console.log('====================================');
				console.log(res);
				console.log('====================================');
			}).catch((err) => {
				console.log(err)
			})

	}

	getAllData = async () => {
		this.dbSync()
		let data = [];
		await this.db
			.allDocs({ include_docs: true })
			.then((result) => {
				result.rows.forEach((n) => data.push(n.doc));

				return data;
			})
			.catch((err) => {
				console.log(err);
				data.push({});
			});
		return data;
	}

	addLog = async (data) => {
		this.dbSync()
		const LogsDB = new PouchDB("logs")
		data._id = new Date().toISOString();
		data.createdAt = new Date().toISOString();
		data.user = this.currentUser;
		await LogsDB.put(data)
	}

	getDBs = async () => {
		let data = [];
		await PouchDB
			.allDbs()
			.then((dbs) => {
				data = dbs;
				return data;
			})
			.catch((err) => {
				console.log(err);
				data.push({});
			});
		return data;

	}

	saveData = async (record) => {
		this.dbSync()
		return await this.db.post(record)
	};

	getOne(id) {
		this.dbSync()
		let db = this.db
		let data = db.get(id, { include_docs: true })
			.then((doc) => {

				return { ...doc }
			})

		return data
	}

	updateData(id, updates) {

		let db = this.db;
		db.get(id)
			.then((doc) => {
				updates.updateddAt = new Date().toISOString();
				updates._rev = doc._rev
				updates._id = doc._id
				db.put(updates); // <-- no need to include rev as the second argument
				db.info().then((info) => {
					this.addLog({
						description: `Updated data in ${info.db_name}`,
						details: { from: doc, to: updates }
					})
				})

			})
			.then(() => {
				this.dbSync()
				return db.get(id);
			})
			.then((doc) => {
				console.log(doc);
			});
	}




	async getCollectionDocuments(rq) {
		this.dbSync()
		const { filter } = rq

		try {
			// Check indexes
			await this.db.createIndex({
				index: { fields: ['type'] },
			});
			await this.db.createIndex({
				index: { fields: ['createdAt'] },
			});

			Object.keys(filter).map(async f =>
				await this.db.createIndex({
					index: { fields: [f] },
				})
			)

			const data = await this.db.find({
				selector: {
					// organization: localStorage.getItem('organization'),
					createdAt: { $gte: null },
					...filter
				},
				sort: [{ createdAt: 'desc' }],
			});



			// const { current = 1, pageSize = 10 } = rq;
			// console.log(rq);
			// const params = parse(realUrl, true).query;
			let dataSource = [...data.docs.map(row => ({ ...row, key: row._id }))];
			// .slice((current - 1) * pageSize, current * pageSize)
			const sorter = rq.sorter;



			if (sorter) {
				dataSource = dataSource.sort((prev, next) => {
					let sortNumber = 0;
					Object.keys(sorter).forEach(key => {
						if (sorter[key] === 'descend') {
							if (prev[key] - next[key] > 0) {
								sortNumber += -1;
							} else {
								sortNumber += 1;
							}

							return;
						}

						if (prev[key] - next[key] > 0) {
							sortNumber += 1;
						} else {
							sortNumber += -1;
						}
					});
					return sortNumber;
				});
			}

			return this.addingMoreData(rq.keyword ? dataSource.filter(i => Object.keys(i).some(key => i[key].includes(rq.keyword))) : dataSource)

		} catch (error) {
			console.log(error);
		}

	}

	getDocument(id) {
		this.dbSync()
		return this.db.get(id, { attachments: true });
	}


	async saveDocument(body) {
		try {
			if (has(body, '_id')) {
				const original = await this.db.get(body._id);

				body.updatedAt = new Date().toISOString()
				body.updatedBy = localStorage.getItem('user')

				const response = await this.db.put(body);
				return await this.db.get(response.id);
			} else {
				body._id = Date.now().toString(36).toUpperCase()
				body.entrant = localStorage.getItem('user')
				body.createdAt = new Date().toISOString()
				body.updatedAt = new Date().toISOString()
				// state: 'draft',
				// organization: localStorage.getItem('organization'),
				const response = await this.db.post(body).then((result) => {

					this.db.info().then((info) => {
						this.addLog({
							description: `Added data in ${info.db_name}`,
							details: body
						})
					})

					return result
				})
				return await this.db.get(response.id);
			}
			this.dbSync()
		} catch (error) {
			console.log(error);
		}
	}
	async remove(data) {
		this.dbSync()
		try {
			return db.remove(data._id, data._rev);
		} catch (error) {
			console.log(error);
		}
	}
	async deleteDocument(data) {
		this.db.get(data._id).then((doc) => {
			this.db.info().then((info) => {
				this.addLog({
					description: `Deletion of data in ${info.db_name}`,
					details: doc
				})
			})
			return this.db.remove(doc._id, doc._rev);
		});
	}
	bulkAdd = async (data) => this.db.bulkDocs(data)





	async addingMoreData(data) {



		if (this.name === 'landlords') {
			const historyData = await processData('Rent')
			return data.map(landlordDetails => {
				const uncollected = historyData.TheData
					.filter(occupancyDetails => landlordDetails._id === occupancyDetails.landlord_id)
					.reduce((currentSum, currentOccupancy) => currentSum + currentOccupancy.arrears, 0)

				const totalRentCollected = historyData.rentCollection.filter((row => row.landlord === landlordDetails._id))
					.reduce((currentAmount, currentReceipt) => currentAmount + currentReceipt.amount, 0)

				const paidToLandlord = historyData.allExpenses.filter(row => row.landlord === landlordDetails._id)
					.reduce((currentAmount, currentPayment) => currentAmount + currentPayment.amount, 0)
				return { ...landlordDetails, unpaid: totalRentCollected - paidToLandlord, uncollected: uncollected }
			})
		} else if (this.name === 'properties') {
			const historyData = await processData('Rent')
			return data.map(propertyDetails => {
				const reducedData = historyData.TheData
					.filter(occupancyDetails => propertyDetails._id === occupancyDetails.property_id)
					.reduce((currentSum, currentOccupancy) => {
						return {
							uncollected: currentSum.uncollected + currentOccupancy.arrears,
							totalRent: currentSum.totalRent + currentOccupancy.rent,
							totalUnits: currentSum.totalUnits + 1,
							MGTFees: currentSum.MGTFees + ((propertyDetails.management_percentage / 100) * currentOccupancy.rent)
						}
					}, {
						uncollected: 0,
						totalRent: 0,
						totalUnits: 0,
						MGTFees: 0,

					})
				return { ...propertyDetails, ...reducedData }
			})
		} else {
			return data
		}
	}


}




