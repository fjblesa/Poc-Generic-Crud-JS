'use strict';

const jsonSql = require('json-sql')();



module.exports = class Crud {
    constructor(app, dataSource, validationFactory) {
        this.db_ = dataSource;
        this.validationFactory_ = validationFactory;
        app.post('/crud/v1/:entity', this.security.bind(this), this.validate.bind(this), this.insert.bind(this));
        app.put('/crud/v1/:entity', this.security.bind(this), this.validate.bind(this), this.update.bind(this));
        app.get('/crud/v1/:entity/:id', this.security.bind(this), this.validate.bind(this), this.get.bind(this));
        app.delete('/crud/v1/:entity', this.security.bind(this), this.validate.bind(this), this.delete.bind(this));
        jsonSql.setDialect(dataSource.name);
    }
    security(req, res, next) {
        next();
    }
    validate(req, res, next) {
        const table = req.params.entity;
        const values = req.body;

        const validations = this.validationFactory_.get(table);
        let validate = true;
        for (let i = 0, len = validations.length; i < len; i++) {
            validate = validations[i](this.db_, values);
            if (!res) {
                break;
            }
        }
        if (validate) {
            next();
        } else {
            res.send(500, { error: "Error Validaciones" });
        }

    }

    extractEntitys_(type, values) {
        let entitys = [];
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                let newValues;
                if ((typeof values[key] === "object") && (values[key] !== null)) {
                    newValues = values[key];
                    newValues[type] = values["id"];
                    entitys.push({ type: key, values: newValues });
                    delete values[key];
                }
            }
        }
        entitys.unshift({ type: type, values: values });
        return entitys;
    }

    insert(req, res, next) {
        const table = req.params.entity;
        const values = req.body;

        const entities = this.extractEntitys_(table, values);

        const querys = [];
        let sql;
        for (let i = 0, len = entities.length; i < len; i++) {
            sql = jsonSql.build({
                type: 'insert',
                table: entities[i].type,
                values: entities[i].values
            });
            querys.push({ sql: sql.query, values: sql.values })
        }
       

        this.db_.execute(querys, (err, data) => {
            console.log(err);
            if (!err) {
                res.status(200).end();
            } else {
                res.send(err);
                res.status(500).end();
            }

        });



    }
    update(req, res, next) {
        const table = req.params.entity;
        res.status(200).end();
    }
    get(req, res, next) {
        const table = req.params.entity;
        const id = req.params.id;
        let fields = req.query.fields;
        if (fields) {
            fields = fields.split(',');
        }
        var sql = jsonSql.build({
            type: 'select',
            table: table,
            fields: fields,
            condition: { id: id }
        });

        this.db_.get({ sql: sql.query, values: sql.values }, (err, data) => {
            if (!err) {
                res.send(data);
                res.status(200).end();
            } else {
                res.send(err);
                res.status(500).end();
            }

        });


    }
    delete(req, res, next) {
        const table = req.params.entity;
        res.status(200).end();
    }
};