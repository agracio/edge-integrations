'use strict';
const edge = require('edge-js');
const assert = require('assert');

function sql(func, params){
    return new Promise((resolve, reject) =>{
        func(params, function (error, result) {
            if(error) {
                //console.error(error);
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function edgeSql(db, connectionString, source, params = null) {
    let func = edge.func('sql', {
        db: db,
        connectionString: connectionString,
        source: source,
        commandTimeout: 100
    });

    return await sql(func, params);
}

async function test(db, connectionString, source, params, expected) {
    let result = await edgeSql(db, connectionString, source, params);
    assert.equal(JSON.stringify(result).toLocaleLowerCase(), expected.toLocaleLowerCase());
}

async function top(db, connectionString, source) {
    await test(db, connectionString, source, null, '[{"Id":1,"Name":"Author - 1","Country":"Country - 1"},{"Id":2,"Name":"Author - 2","Country":"Country - 2"}]');
}

async function id(db, connectionString){
    await test(db, connectionString, 'select * from Authors where Id = @authorId', { authorId: 1 }, '[{"Id":1,"Name":"Author - 1","Country":"Country - 1"}]');
}

async function multiple(db, connectionString, source){
    await test(db, connectionString, source, null, '{"Authors":[{"Id":1,"Name":"Author - 1","Country":"Country - 1"}],"Books":[{"Id":1,"Author_Id":1,"Name":"Book - 1","Price":10}]}');
}

async function geometryMsSql(db, connectionString, source){
    await test(db, connectionString, source, null, '[{"id":1,"GeomCol":"LINESTRING (100 100, 20 180, 180 180)","GeomColSTA":"LINESTRING (100 100, 20 180, 180 180)"},{"id":2,"GeomCol":"POLYGON ((0 0, 150 0, 150 150, 0 150, 0 0))","GeomColSTA":"POLYGON ((0 0, 150 0, 150 150, 0 150, 0 0))"}]');
}

async function geometry(db, connectionString, source){
    await test(db, connectionString, source, null, '[{"id":1,"GeomCol":"LINESTRING(100 100,20 180,180 180)","GeomColSTA":"LINESTRING(100 100,20 180,180 180)"},{"id":2,"GeomCol":"POLYGON((0 0,150 0,150 150,0 150,0 0))","GeomColSTA":"POLYGON((0 0,150 0,150 150,0 150,0 0))"}]');
}

async function insertGeometry(db, connectionString, source, params){
    let result = await edgeSql(db, connectionString, source, params);
}

async function updateGeometry(db, connectionString, source, params){
    let result = await edgeSql(db, connectionString, source, params);
}

async function update(db, connectionString){
    const rnd = random(3, 100);
    let name = 'Author - ' + rnd;

    let select = 'select * from Authors where Id = @authorId';
    let update = 'update Authors set Name = @name where Id = @authorId';

    await test(db, connectionString, select, { authorId: rnd }, `[{"Id":${rnd},"Name":"${name}","Country":"Country - ${rnd}"}]`);

    let newName = name + ' - updated';

    await edgeSql(db, connectionString, update, { authorId: rnd, name: newName});

    await test(db, connectionString, select, { authorId: rnd }, `[{"Id":${rnd},"Name":"${newName}","Country":"Country - ${rnd}"}]`);
    // result = await edgeSql(db, connectionString, select, { authorId: rnd});
    // assert.equal(result[0].Name, newName);

    await edgeSql(db, connectionString, update, { authorId: rnd, name: name});

    await test(db, connectionString, select, { authorId: rnd }, `[{"Id":${rnd},"Name":"${name}","Country":"Country - ${rnd}"}]`);
}

async function proc(db, connectionString){
    await test(db, connectionString, `exec GetBooksByAuthor`, { AuthorId: 2}, '[{"Id":3,"Author_Id":2,"Name":"Book - 1","Price":10},{"Id":4,"Author_Id":2,"Name":"Book - 2","Price":20}]');
}

async function procOut(db, connectionString){
    await test(db, connectionString, 'exec GetAuthorDetails', { AuthorID: 1, '@returnParam1': 'AuthorName', '@returnParam2': 'AuthorCountry' }, '{"AuthorName":"Author - 1","AuthorCountry":"Country - 1"}');
}

async function procOutPgSql(db, connectionString){
    await test(db, connectionString, 'call GetAuthorDetails(@authorId, @returnParam1, @returnParam2)', { AuthorID: 1, '@returnParam1':'', '@returnParam2':''}, '[{"AuthorName":"Author - 1","AuthorCountry":"Country - 1"}]');
}

async function func(db, connectionString){
    await test(db, connectionString, `select * from GetBooksByAuthor(@AuthorId)`, { AuthorId: 2}, '[{"Id":3,"Author_Id":2,"Name":"Book - 1","Price":10},{"Id":4,"Author_Id":2,"Name":"Book - 2","Price":20}]');
}

module.exports = {
    top, 
    id, 
    multiple,
    geometry,
    geometryMsSql,
    insertGeometry,
    updateGeometry,
    update,
    proc,
    procOut,
    procOutPgSql,
    func
}