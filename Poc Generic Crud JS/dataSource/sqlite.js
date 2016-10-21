'use strict';
const sqlite3 = require('sqlite3');//.verbose();


module.exports = class Sql {
    constructor() {
        this.db_ = new sqlite3.Database('./test.sqlite');
        this.create_();
        this.name = 'sqlite';
    }
    create_() {
        this.db_.run("CREATE TABLE IF NOT EXISTS family (id CHAR(60) PRIMARY KEY NOT NULL,name CHAR(200))");
        this.db_.run("CREATE TABLE IF NOT EXISTS person (id CHAR(60) PRIMARY KEY NOT NULL,name CHAR(200),age INT,family CHAR(60), FOREIGN KEY(family) REFERENCES family(id))");

    }
    parserValues_(values) {
        let newVal = {};
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                newVal['$' + key] = values[key];
            }
        }
        return newVal;
    }
    execute(sqls,callback) {
        let data;
        for (let i = 0, len = sqls.length; i < len; i++) {
            data = sqls[i];
            //TODO: Los callback del run convertirlos en una promesa o un generador ( mirar en que version Node estan soportados),
            // para devolver un callback con todo el resultado de la operacion
            this.db_.run(data.sql,this.parserValues_(data.values),callback); 
        }

    }
    executeOne(data, callback) {
        console.log(data);
        try {
            
         
                //const st = this.db_.prepare(data.sql);
                //st.run(this.parserValues_(data.values), callback);
                //const err = st.run(this.parserValues_(data.values));                
                this.db_.run(data.sql,this.parserValues_(data.values),callback);                

         
        } catch (err) {
            callback(err);
        }


    }

    get(data, callback) {
        console.log(data);
        this.db_.get(data.sql, this.parserValues_(data.values), callback);
    }
}