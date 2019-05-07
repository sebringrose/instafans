module.exports = {
  function: function (posts, sortBy) {

    if (Array.isArray(sortBy)) sortBy = sortBy[sortBy.length-1]

    posts.sort(function(a, b) {
      return parseFloat(b[sortBy]) - parseFloat(a[sortBy])
    })

    return posts
  }
}
