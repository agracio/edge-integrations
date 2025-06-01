'use strict';
const test = require('./edge-sql.test');

describe("edge-sql PostgeSQL", function () {

    it('select top 2', async function (){
        if(!process.env.EDGE_USE_CORECLR) {
            this.skip()
        }
        await test.top('pgsql', process.env.PGSQL, 'SELECT * FROM Authors LIMIT 2');
    });


    it('select by id', async function () {
        if(!process.env.EDGE_USE_CORECLR) {
            this.skip()
        }
        await test.id('pgsql', process.env.PGSQL);
    });


    it('select from multiple tables', async function () {
        if(!process.env.EDGE_USE_CORECLR) {
            this.skip()
        }
        await test.multiple('pgsql', process.env.PGSQL, 'SELECT * FROM Authors LIMIT 1; SELECT * FROM Books LIMIT 1');
    });

    it('select geometry', async function () {
        if(!process.env.EDGE_USE_CORECLR) {
            this.skip()
        }
        await test.geometry('pgsql', process.env.PGSQL, 'select id, ST_AsText(GeomCol) as GeomCol, GeomColSTA from SpatialTable limit 2');
    });

    it.skip('insert geometry', async() => {
        await test.insertGeometry('pgsql', process.env.PGSQL, 'INSERT INTO SpatialTable VALUES (default,ST_GeomFromText(\'LINESTRING (100 100, 20 180, 180 180)\',0), default)', null);
    });

    it('update geometry', async function () {
        if(!process.env.EDGE_USE_CORECLR) {
            this.skip()
        }
        await test.updateGeometry('pgsql', process.env.PGSQL, 'UPDATE SpatialTable set GeomCol = @newValue where id = @id', { id: 4, newValue: 'POINT(10 10)' });
    });

    it.skip('update', async function () {
        if(!process.env.EDGE_USE_CORECLR) {
            this.skip()
        }
        await test.update('pgsql', process.env.PGSQL);
    });

     it('function', async function () {
         if(!process.env.EDGE_USE_CORECLR) {
             this.skip()
         }
        await test.func('pgsql', process.env.PGSQL);
    });

    it('stored proc with output parameters', async function () {
        if(!process.env.EDGE_USE_CORECLR) {
            this.skip()
        }
        await test.procOutPgSql('pgsql', process.env.PGSQL);
    });
});