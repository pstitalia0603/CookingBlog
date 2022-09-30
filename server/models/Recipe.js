const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    description: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: 'This field is required.'
    },
    category: {
        type: String,
        enum:['Thai','American','Chinese','Mexican','Italian'],
        required: 'This field is required.'
    },
    ingredients: {
        type: Array,
        required: 'This field is required.'
      },
    image: {
        type: String,
        required: 'This field is required.'
    },
    source: {
        type:String,
        required: 'This field is required.'
    }

});

//searching the name and description fields
recipeSchema.index( {name: 'text', description: 'text'});
// wildcard indexing
//recipeSchema.index( { "$**" : 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
