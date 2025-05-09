const edge = require('edge-js');
const expect = require('@jest/globals').expect;
const test = require('@jest/globals').test;
const describe = require('@jest/globals').describe;

function sql(func, params){
    return new Promise((resolve, reject) =>{
        func(params, function (error, result) {
            if(error) {
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

describe("edge-sql MS-SQL tests", () => {

    // test('no connection string', async() => {
    //     expect(() =>edge.func('sql', function () {/**/})).toThrow(/^connectionString must be specified/);
    // });

    test('select top', async() => {

        let func = edge.func('sql', function () {/*
            select top 2 * from Authors
        */});

        let result = await sql(func, null);

        expect(JSON.stringify(result) ).toBe('[{\"Id\":1,\"Name\":\"Author - 1\",\"Country\":\"Country - 1\"},{\"Id\":2,\"Name\":\"Author - 2\",\"Country\":\"Country - 2\"}]');
    });

    test('select id', async() => {

        let func = edge.func('sql', function () {/*
            select * from Authors 
            where Id = @authorId
        */});

        let result = await sql(func, { authorId: 1 });

        expect(JSON.stringify(result) ).toBe('[{\"Id\":1,\"Name\":\"Author - 1\",\"Country\":\"Country - 1\"}]');
    });

    test('select id with options', async() => {

        let func = edge.func('sql', {
            source: 'select * from Authors where Id = @authorId',
            commandTimeout: 100
        });

        let result = await sql(func, { authorId: 1 });

        expect(JSON.stringify(result) ).toBe('[{\"Id\":1,\"Name\":\"Author - 1\",\"Country\":\"Country - 1\"}]');
    });

    test('select from multiple tables', async() => {

        let func = edge.func('sql', {
            source: 'select top 1 * from Authors; select top 1 * from Books',
            commandTimeout: 100
        });

        let result = await sql(func, null);

        expect(JSON.stringify(result) ).toBe('{\"Authors\":[{\"Id\":1,\"Name\":\"Author - 1\",\"Country\":\"Country - 1\"}],\"Books\":[{\"Id\":1,\"Author_id\":485,\"Price\":64,\"Edition\":9}]}');
    });

    test('update', async() => {

        const rnd = random(3, 500);
        let name = 'Author - ' + rnd;
        console.log(rnd)

        let func = edge.func('sql', {
            source: 'select Name from Authors where Id = @authorId',
            commandTimeout: 100
        });

        let result = await sql(func, { authorId: rnd});
        expect(result[0].Name).toBe(name);

        let update = edge.func('sql', {
            source: 'update Authors set Name = @name where Id = @authorId',
            commandTimeout: 100
        });

        let newName = name + ' - updated';

        await sql(update, { authorId: rnd, name: newName});

        result = await sql(func, { authorId: rnd});
        expect(result[0].Name).toBe(newName);

        await sql(update, { authorId: rnd, name: name});

        result = await sql(func, { authorId: rnd});
        expect(result[0].Name).toBe(name);
    });

    test('stored proc', async() => {

        let func = edge.func('sql', {
            source: 'exec GetBooksByAuthor',
            commandTimeout: 100
        });

        let result = await sql(func, { AuthorId: 2});

        expect(JSON.stringify(result) ).toBe('[{\"Id\":182,\"Author_id\":2,\"Price\":55,\"Edition\":10},{\"Id\":279,\"Author_id\":2,\"Price\":88,\"Edition\":9}]');
    });

    test('stored proc with output parameters', async() => {

        let func = edge.func('sql', {
            source: 'exec GetAuthorDetails',
            commandTimeout: 100
        });

        let result = await sql(func, { AuthorID: 1, '@returnParam1': 'Name', '@returnParam2': 'Country' });

        expect(JSON.stringify(result) ).toBe('{\"Name\":\"Author - 1\",\"Country\":\"Country - 1\"}');
    });
});