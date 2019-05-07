// Instagram post data converter tool


module.exports = {
    function: async function (responses) {

      // we only want to work with nice responses of post data
      var niceResponses = []
      for (var i=0; i<responses.length; i++) {
        try {
          if (responses[i].data.user.edge_owner_to_timeline_media) niceResponses.push(responses[i])
        } catch(error) {
          console.log("bad data", error)
        }
      }

      // next we want to reformat the nice responses to be arrays of posts with
      // metrics of thumbnailUri, caption, date, tags, location, views, comments & likes.
      var posts = []
      for (i=0; i<niceResponses.length; i++) {

        for (var ii=0; ii<niceResponses[i].data.user.edge_owner_to_timeline_media.edges.length; ii++) {
          let post = {}
          let niceResponse = niceResponses[i].data.user.edge_owner_to_timeline_media.edges[ii]
          post.id = niceResponse.node.id
          post.shortcode = niceResponse.node.shortcode
          post.owner = niceResponse.node.owner.username
          post.type = niceResponse.node.__typename
          post.thumbnailUri = niceResponse.node.thumbnail_src
          if (niceResponse.node.edge_media_to_caption.edges[0]) {
            post.caption = niceResponse.node.edge_media_to_caption.edges[0].node.text
          }
          post.date = niceResponse.node.taken_at_timestamp
          if (niceResponse.node.edge_media_to_tagged_user.edges[0]) {
            post.taggedUsers = []
            for (var iTag = 0; iTag < niceResponse.node.edge_media_to_tagged_user.edges.length; iTag++) {
              post.taggedUsers.push(niceResponse.node.edge_media_to_tagged_user.edges[iTag].node.user.username)
            }
          }
          if (niceResponse.node.location) post.location = niceResponse.node.location.name
          if (post.type === "GraphVideo") post.views = niceResponse.node.video_view_count
          if (niceResponse.node.edge_media_to_comment.edges[0]) {
            post.comments = []
            for (var iCom = 0; iCom < niceResponse.node.edge_media_to_comment.edges.length; iCom++) {
              post.comments.push({
                user: niceResponse.node.edge_media_to_comment.edges[iCom].node.owner.username,
                text: niceResponse.node.edge_media_to_comment.edges[iCom].node.text,
                date: niceResponse.node.edge_media_to_comment.edges[iCom].node.created_at
              })
            }
          }
          // post.comments = niceResponse.node.edge_media_to_comment.edges
          post.likes = niceResponse.node.edge_media_preview_like.count

          posts.push(post)
        }
      }

      return posts
    }
}
