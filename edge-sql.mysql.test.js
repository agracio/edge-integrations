'use strict';
const test = require('./edge-sql.test');

describe("edge-sql MySql", () => {

    it('select top 2', async() => {
        await test.top('mysql', process.env.MYSQL, 'SELECT * FROM Authors LIMIT 2');
    });

    it('select by id', async() => {
        await test.id('mysql', process.env.MYSQL);
    });

    it('select from multiple tables', async() => {
        await test.multiple('mysql', process.env.MYSQL, 'SELECT * FROM Authors LIMIT 1; SELECT * FROM Books LIMIT 1');
    });

    it('select geometry', async() => {
        await test.geometry('mysql', process.env.MYSQL, 'select id, ST_AsText(GeomCol) as GeomCol, GeomColSTA from SpatialTable limit 2');
    });

    it.skip('insert geometry', async() => {
        await test.insertGeometry('mysql', process.env.MYSQL, 'INSERT INTO SpatialTable VALUES (default,ST_GeomFromText(\'LINESTRING (100 100, 20 180, 180 180)\',0), default)', null);
    });

    it.skip('update geometry', async() => {
        await test.updateGeometry('mysql', process.env.MYSQL, 'UPDATE SpatialTable set GeomCol = @newValue where id = @id', { id: 4, newValue: 'ST_GeomFromText(\'POINT(10 10)\')' });
    });

    it.skip('update', async() => {
        await test.update('mysql', process.env.MYSQL);
    });

    it('stored proc', async() => {
        await test.proc('mysql', process.env.MYSQL);
    });

    it('stored proc with output parameters', async() => {
        await test.procOut('mysql', process.env.MYSQL);
    });
});