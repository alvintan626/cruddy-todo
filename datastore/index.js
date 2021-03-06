const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = fs.readdir(exports.dataDir, function(err, items) {
  if(err){
    return err
  }else{
    return items
  }
});

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if(err){
      throw('Something went wrong');
    }else{
      items[id] = text;
      //write and create a path to data dir
      //create file with id name and text/data
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if(err) {
          throw('EERR',err);
        }else{
          callback(null, { id, text });
        }
      })
    }
  });
};

// exports.readAll = (callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id, text };
//   });
//   callback(null, data);
// };


exports.readAll = () => {
  return new Promise(function(resolve, reject) {
    var data = _.map(items, (text, id) => {
      return exports.readOne(id)
    });
      resolve(Promise.all(data))
  })

}


exports.readOne = (id) => {
  return new Promise(function(resolve, reject) {
    var text = items[id];
    console.log('text', text)
    if (!text) {
      reject(new Error(`No item with id: ${id}`));
    } else {
      resolve({ id, text });
    }
  })
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if(err) {
        throw('EERR',err);
      }else{
        callback(null, { id, text });
      }
    })
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
      if(err) {
        throw('EERR',err);
      }
      callback();
    })
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
