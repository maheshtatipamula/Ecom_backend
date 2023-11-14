class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "category",
      "brands",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  filterByCategory() {
    if (this.queryStr.category) {
      this.query = this.query.find({
        category: { $in: this.queryStr.category.split(",") },
      });
    }
    return this;
    // totalProductsQuery = totalProductsQuery.find({
    //   category: {$in:req.query.category.split(',')},
    // });
  }

  filterByBrands() {
    if (this.queryStr.brand) {
      this.query = this.query.find({
        brand: { $in: this.queryStr.brand.split(",") },
      });
    }
    return this;
    // totalProductsQuery = totalProductsQuery.find({
    //   category: {$in:req.query.category.split(',')},
    // });
  }
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitingFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v ");
    }

    return this;
  }

  pagination() {
    const page = this.queryStr.page || 1;
    const limit = this.queryStr.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    //   if (this.queryStr.page) {
    //     const productCount = Product.countDocuments();
    //     if (skip >= productCount) throw new Error("This Page does not exists");
    //   }
    return this;
  }
}

module.exports = ApiFeatures;
