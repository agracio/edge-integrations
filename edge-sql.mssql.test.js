'use strict';
const test = require('./edge-sql.test');

describe("edge-sql MS SQL", () => {

    it('select top 2', async() => {
        await test.top('mssql', process.env.MSSQL, 'SELECT TOP 2 * FROM Authors');
    });


    it('select by id', async() => {
        await test.id('mssql', process.env.MSSQL);
    });

    it('select from multiple tables', async() => {
        await test.multiple('mssql', process.env.MSSQL, 'SELECT top 1 * FROM Authors; SELECT top 1 * FROM Books');
    });
    
    it('select geometry', async function () {
        if(!process.env.EDGE_USE_CORECLR) {
            this.skip()
        }
        await test.geometryMsSql('mssql', process.env.MSSQL, 'select top 2 * from SpatialTable');
    });

    it.skip('insert geometry', async() => {
        await test.insertGeometry('mssql', process.env.MSSQL, 'INSERT INTO SpatialTable (GeomCol) VALUES (geometry::STGeomFromText(\'LINESTRING (100 100, 20 180, 180 180)\', 0))', null);
    });

    it('update geometry', async() => {
        await test.updateGeometry('mssql', process.env.MSSQL, 'UPDATE SpatialTable set GeomCol = @newValue where id = @id', { id: 4, newValue: 'POINT(10 10)' });
    });

    it.skip('update', async() => {
        await test.update('mssql', process.env.MSSQL);
    });

    it('stored proc', async() => {
        await test.proc('mssql', process.env.MSSQL);
    });

    it('stored proc with output parameters', async() => {
        await test.procOut('mssql', process.env.MSSQL);
    });
});