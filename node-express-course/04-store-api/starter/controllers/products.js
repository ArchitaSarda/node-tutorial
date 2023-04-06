const product = require('../models/product');

const getAllProducts = async (req, res) => {
    //throw new Error('testing async errors')
    const {featured, name, company, sort, fields, numericFilters} = req.query
    const queryObj = {};
    if(featured) {
        queryObj.featured = featured === 'true' ? true : false
    }
    if(company) {
        queryObj.company = company
    }
    if(name) {
        queryObj.name = {$regex: name, $options: 'i'}
    }
    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        const options = ['price', 'rating'];
        console.log(numericFilters, filters);
        filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-');
        console.log(field, operator, value);
        if (options.includes(field)) {
            queryObj[field] = { [operator]: Number(value) };
        }
        });

    }
    console.log(queryObj);
    let result = product.find(queryObj);

    if(sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt')
    }

    if(fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({success: true, products, nbHits: products.length})
}

module.exports = {getAllProducts}