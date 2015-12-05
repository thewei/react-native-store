var reactNativeStore = require('react-native-store');

class Test {
    constructor() {
        this.testDataSet = [
            { name: 'j', price: 3, location: { name: 'USA', coords: { lat: 123, lng: 123 }  } },
            { name: 'a', price: 4, location: { name: 'USA', coords: { lat: 123, lng: 123 }  } },
            { name: 'v', price: 1, location: { name: 'USA', coords: { lat: 123, lng: 123 }  } },
            { name: 'a', price: 2, location: { name: 'USA', coords: { lat: 123, lng: 123 }  } },
            { name: 's', price: 1, location: { name: 'EU', coords: { lat: 423, lng: 123 }  } },
            { name: 'c', price: 1, location: { name: 'EU', coords: { lat: 423, lng: 123 }  } },
            { name: 'r', price: 7, location: { name: 'EU', coords: { lat: 423, lng: 123 }  } },
            { name: 'i', price: 9, location: { name: 'Outer Space', coords: { lat: 999, lng: 999 }  } },
            { name: 'p', price: 4, location: { name: 'InterGalatic Space', coords: { lat: 9001, lng: 42 }  } },
            { name: 't', price: 999, location: { name: 'Outside', coords: { lat: -1, lng: 0 }  } },
        ];
        this.startTest();
    }

    async startTest() {
        try {
            await this.init();
            await this.findTest();
            await this.updateTest();
            await this.findByIdTest();
            await this.updateByIdTest();
            await this.removeByIdTest();
            await this.removeTest();
            console.log('Test Complete!')
        } catch(error) {
            console.log(error);
        }

    }

    async init() {
        //Create/get model from storage
        this.model = await reactNativeStore.model('test');
        //Add our test data to storage
        for(var element in this.testDataSet) {
            await this.model.add(this.testDataSet[element]);
        }
    }

    async findTest() {
        //Want to find all entries with price between 0 and 5, but with location.name = EU
        //or have space in the location name, sorted in ascending order by price
        var filter = {
            where: {
                or: [
                    {
                        price: { between: [0, 5] },
                        location: { name: 'EU' }
                    },
                    { 
                        location: { name: { regexp: 'space' } } 
                    }
                ]
            },
            fields: {
                name: false
            },
            order: {
                price: 'ASC'
            }
        }
        var results = await this.model.find(filter);
        console.log(results);
        //Note that these objects will contain a _id property containing their
        //own unique id that can be used in a where filter
        //[{ price: 1, location: { name: 'EU', coords: { lat: 423, lng: 123 }  } },
        // { price: 1, location: { name: 'EU', coords: { lat: 423, lng: 123 }  } },
        // { price: 4, location: { name: 'InterGalatic Space', coords: { lat: 9001, lng: 42 }  } },
        // { price: 9, location: { name: 'Outer Space', coords: { lat: 999, lng: 999 }  } } ]

    }

    async findByIdTest() {
        // find last entered model (by id)
        console.log('Start find by id test.');
        // entries are removed each time but the autoinc index is
        // not set. This is a work around to get this test working.
        var index = this.model.database.test.autoinc;
        var results = await this.model.findById(index - 1);
        console.log(results);
    }

    async updateTest() {
        //Update all entries with name having a value lexicographically less
        //than or equal to'f' to having price = 0
        var filter = {
            where: {
                name: { lte: 'f' }
            }
        }
        var results = await this.model.update({ price: 0 }, filter);
        console.log(results);
        //[{ name: 'a', price: 0, location: { name: 'USA', coords: { lat: 123, lng: 123 }  } },
        // { name: 'a', price: 0, location: { name: 'USA', coords: { lat: 123, lng: 123 }  } },
        // { name: 'c', price: 0, location: { name: 'EU', coords: { lat: 423, lng: 123 }  } } ],
    }

    async updateByIdTest() {
        // update last entered model (by id)
        console.log('Start update by id test.');
        var index = this.model.database.test.autoinc;
        var results = await this.model.updateById({name: 'z'}, index - 1);
        console.log(results);
    }

    async removeTest() {
        //Remove all data from this model. To include the whole database in
        //a filter, either pass no filter object or exclude the where property
        var results = await this.model.remove();
        console.log(results);
    }

    async removeByIdTest() {
        // remove last entered model (by id)
        console.log('Start remove by id test.');
        var index = this.model.database.test.autoinc;
        var results = await this.model.removeById(index - 1);
        console.log(results);
    }
}

module.exports = new Test();
