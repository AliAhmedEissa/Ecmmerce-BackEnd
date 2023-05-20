// new Error()
class ApiFeatures {
    // mongoodeQuery = productModel.find()
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery
    this.queryData = queryData
  }

  /**
   * pagination
   * sort
   * select
   * search
   * filter
   */

  paginate() {
    let { page, size } = this.queryData
    if (!page || page < 1) page = 1
    if (!size || size < 1) size = 2
    this.mongooseQuery
      .limit(parseInt(size))
      .skip((parseInt(page) - 1) * parseInt(size))
    return this
  }

  sort() {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
    return this
  }

  select() {
    this.mongooseQuery.select(this.queryData.fields?.replaceAll(',', ' '))
    return this
  }

  search() {
    if (this.queryData.search) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryData.search, $options: 'i' } },
          { description: { $regex: this.queryData.search, $options: 'i' } },
        ],
      })
      return this
    }
    return this
  }

  filters() {
    const queryDataInstatance = { ...this.queryData }
    const execludeParams = ['page', 'size', 'sort', 'search', 'fields']
    execludeParams.forEach((param) => delete queryDataInstatance[param])
    const queryFilters = JSON.parse(
      JSON.stringify(queryDataInstatance).replace(
        /(lt|lte|gt|gte|in|nin|eq|neq)/g,
        (match) => `$${match}`,
      ),
    )
    this.mongooseQuery.find(queryFilters)
    return this
  }
}

export default ApiFeatures
