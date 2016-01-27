'use strict';
jest.dontMock('../filter.js');

const testDataSet = {
  '1': {
    _id: 1,
    name: 'j',
    price: 3,
    location: {
      name: 'USA',
      coords: {
        lat: 123,
        lng: 123
      }
    }
  },
  '2': {
    _id: 2,
    name: 'a',
    price: 4,
    location: {
      name: 'USA',
      coords: {
        lat: 123,
        lng: 123
      }
    }
  },
  '3': {
    _id: 3,
    name: 'v',
    price: 1,
    location: {
      name: 'USA',
      coords: {
        lat: 123,
        lng: 123
      }
    }
  },
  '4': {
    _id: 4,
    name: 'a',
    price: 2,
    location: {
      name: 'USA',
      coords: {
        lat: 123,
        lng: 123
      }
    }
  },
  '5': {
    _id: 5,
    name: 's',
    price: 1,
    location: {
      name: 'EU',
      coords: {
        lat: 423,
        lng: 123
      }
    }
  },
  '6': {
    _id: 6,
    name: 'c',
    price: 1,
    location: {
      name: 'EU',
      coords: {
        lat: 423,
        lng: 123
      }
    }
  },
  '7': {
    _id: 7,
    name: 'r',
    price: 7,
    location: {
      name: 'EU',
      coords: {
        lat: 423,
        lng: 123
      }
    }
  },
  '8': {
    _id: 8,
    name: 'i',
    price: 9,
    location: {
      name: 'Outer Space',
      coords: {
        lat: 999,
        lng: 999
      }
    }
  },
  '9': {
    _id: 9,
    name: 'p',
    price: 4,
    location: {
      name: 'InterGalatic Space',
      coords: {
        lat: 9001,
        lng: 42
      }
    }
  },
  '10': {
    _id: 10,
    name: 't',
    price: 999,
    location: {
      name: 'Outside',
      coords: {
        lat: -1,
        lng: 0
      }
    }
  },
};

describe('filter Tests', function () {
  var Filter;

  beforeEach(function () {
    var Filter_ = require('../filter.js');
    Filter = new Filter_();
  });

  it('should filter using find', function () {
    var filter = {
      where: {
        or: [{
          price: {
            between: [0, 5]
          },
          location: {
            name: 'EU'
          }
        }, {
          location: {
            name: {
              regexp: 'space'
            }
          }
        }]
      },
      fields: {
        name: false
      },
      order: {
        price: 'ASC'
      }
    };
    var results = Filter.apply(testDataSet, filter);
    expect(results.length).toEqual(4);
    var expected = [{
      _id: 5,
      price: 1,
      location: {
        name: 'EU',
        coords: {
          lat: 423,
          lng: 123
        }
      }
    }, {
      _id: 6,
      price: 1,
      location: {
        name: 'EU',
        coords: {
          lat: 423,
          lng: 123
        }
      }
    }, {
      _id: 9,
      price: 4,
      location: {
        name: 'InterGalatic Space',
        coords: {
          lat: 9001,
          lng: 42
        }
      }
    }, {
      _id: 8,
      price: 9,
      location: {
        name: 'Outer Space',
        coords: {
          lat: 999,
          lng: 999
        }
      }
    }];
    expect(results).toEqual(expected);
  });

  it('should filter using findById', function () {
    var findById = {
      where: {
        _id: 3
      }
    };
    var results = Filter.apply(testDataSet, findById);
    var expected = [{
      _id: 3,
      name: 'v',
      price: 1,
      location: {
        name: 'USA',
        coords: {
          lat: 123,
          lng: 123
        }
      }
    }];
    expect(results).toEqual(expected);
  });

  it('should filter entries lexicographically', function () {
    var lexiFind = {
      where: {
        name: {
          lte: 'f'
        }
      }
    };
    var results = Filter.apply(testDataSet, lexiFind);
    var expected = [{
      _id: 2,
      name: 'a',
      price: 4,
      location: {
        name: 'USA',
        coords: {
          lat: 123,
          lng: 123
        }
      }
    }, {
      _id: 4,
      name: 'a',
      price: 2,
      location: {
        name: 'USA',
        coords: {
          lat: 123,
          lng: 123
        }
      }
    }, {
      _id: 6,
      name: 'c',
      price: 1,
      location: {
        name: 'EU',
        coords: {
          lat: 423,
          lng: 123
        }
      }
    }];
    expect(results).toEqual(expected);
  });

});
