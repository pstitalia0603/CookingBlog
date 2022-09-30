require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 *  GET /
 *  HOMEPAGE
 */

exports.homepage = async(req,res) => {
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);

        const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        const thai = await Recipe.find({ 'category': 'Thai'}).limit(limitNumber);
        const american = await Recipe.find({ 'category': 'American'}).limit(limitNumber);
        const chinese = await Recipe.find({ 'category': 'Chinese'}).limit(limitNumber);
        const italian = await Recipe.find({ 'category': 'Italian'}).limit(limitNumber);

//TODO
//fix this to get categories from DB
        const food = { latest, thai, american, chinese,italian};


        res.render('index',{ title: 'Cooking Blog - Home' , categories, food });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 *  GET /categories
 *  Categories
 */

 exports.exploreCategories = async(req,res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories',{ title: 'Cooking Blog - Categories' , categories });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

/**
 * GET /category/:id
 * Category
*/
exports.exploreCategoriesById = async(req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category':categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Cooking Blog - Categories',categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * GET /recipe/:id
 * Recipe
*/
exports.exploreRecipe = async(req, res) => {
    try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  }


  /**
 * POST /serach
 * Search
*/
exports.searchRecipe = async(req,res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true} });
    //res.json(recipe)
    res.render('search', { title: 'Cooking Blog - Search', recipe} );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }

}

  /**
 * GET explore-latest
 * Explore Latest
*/
exports.exploreLatest= async(req,res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe} );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }

}



  /**
 * GET explore-random
 * Explore Random
*/
exports.exploreRandom = async(req,res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    // res.json(recipe)
    res.render('explore-random', { title: 'Cooking Blog - Explore Random', recipe} );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }

}


  /**
 * GET submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req,res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe',{ title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj});
}



 /**
 * POST submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req,res)=> {

  try {


    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No files were uploaded.');
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath,function(err){
        if(err) return res.status(500).send(err);
      });
    }



    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email:req.body.email,
      ingredients:req.body.ingredients,
      category:req.body.category,
      image:newImageName,
      source:req.body.source
    });

    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    //res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }

}


// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();









// async function insertDummyCategoryData(){
//     try {
//         await Category.insertMany([
//             {
//                 "name":"Italian",
//                 "image":"italian-food.jpg"
//             },
//             {
//                 "name":"American",
//                 "image":"american-food.jpg"
//             },
//             {
//                 "name":"Chinese",
//                 "image":"chinese-food.jpg"
//             },
//             {
//                 "name":"Mexican",
//                 "image":"mexican-food.jpg"
//             },
//             {
//                 "name":"Indian",
//                 "image":"indian-food.jpg"
//             },
//             {
//                 "name":"Spanish",
//                 "image":"spanish-food.jpg"
//             }
//         ]
//         );
//     } catch (error) {
//         console.log('err', + error)
//     }
// }


// insertDummyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//         {
//             "name": "Southern fried chicken",
//             "description": "        To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute, then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.            Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours – I do this overnight.            After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.            When you’re ready to cook, preheat the oven to 190°C/375°F/gas 5.            Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.            Meanwhile, make the pickle – toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage. Place in the fridge, remembering to stir every now and then while you cook your chicken.            Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/",
//             "email": "hello@email.com",
//             "ingredients": [
//               "4 free-range chicken thighs , skin on, bone in",
//               "4 free-range chicken drumsticks",
//               "200 ml buttermilk",
//               "4 sweet potatoes",
//               "200 g plain flour",
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika"
//             ],
//             "category": "American",
//             "image": "southern-friend-chicken.jpg"
//           },
//       {
//         "name": "Mexican",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "Mexican",
//         "image": "tom-daley.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
