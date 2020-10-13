import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { has, assign } from 'lodash';
import { processData } from '@/utils/utils';
PouchDB.plugin(PouchDBFind);
export default class RemoteDB {
    constructor(name) {
        this.name = name
        this.db = new PouchDB('https://therick:develop@realesta-db.herokuapp.com/' + name, { auto_compaction: true });
        this.currentUser = { name: 'sys' };
        // this.remoteDB = new PouchDB('https://couchdb-2afa5d.smileupps.com/' + name)	
    }
    getAllData = async () => {
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
        return await this.db.post(record)
    };

    getOne(id) {
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
                return db.get(id);
            })
            .then((doc) => {
                console.log(doc);
            });
    }




    async getCollectionDocuments(rq) {
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

            return dataSource.filter(i => Object.keys(i).some(key => i[key].includes(rq.keyword)))

        } catch (error) {
            console.log(error);
        }

    }

    getDocument(id) {
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
        } catch (error) {
            console.log(error);
        }
    }
    async remove(data) {
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
}




