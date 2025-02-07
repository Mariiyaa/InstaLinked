
const Post = require('../models/Post'); // Assuming your schema is in models/Post.js


  const explorePage=async (req,res)=> {
    
        // Fetch all documents from the Post collection
        try {
          const posts = await Post.aggregate([
            { $unwind: "$posts" },
            { $sample: { size: 120 } },
            {
              $project: {
                _id: "$posts._id",
                url: "$posts.url",
                caption: "$posts.caption",
                content_type: "$posts.content_type",
                created_at: "$posts.created_at"
              }
            }
          ]);
          
          // Separate PDFs and videos from other content
          const mediaPosts = posts.filter(post => 
            post.content_type === "pdf" || post.content_type.startsWith("reel")
          );
          const otherPosts = posts.filter(post => 
            !(post.content_type === "pdf" || post.content_type.startsWith("reel"))
          );
          
          let finalPosts = [];
          let mediaIndex = 0, otherIndex = 0;
          let lastMediaIndex = -9; // To track distance between media posts
          
          while (mediaIndex < mediaPosts.length || otherIndex < otherPosts.length) {
            let row = []; // Dynamic row, no fixed `null` slots
          
            // Add a media post if the 10-post gap is satisfied
            if (mediaIndex < mediaPosts.length && finalPosts.length - lastMediaIndex >= 10) {
              let mediaPost = mediaPosts[mediaIndex++];
              // Randomly place media post in the first or last column
              if (Math.random() < 0.5) {
                row.push(mediaPost); // Place in the first column
              } else {
                row.unshift(mediaPost); // Place in the last column
              }
              lastMediaIndex = finalPosts.length;
            }
          
            // Fill the rest of the row with other posts
            while (row.length < 3 && otherIndex < otherPosts.length) {
              row.push(otherPosts[otherIndex++]);
            }
          
          
          
            // Add row to final posts
            finalPosts.push(...row.filter(Boolean)); // Remove null values
          }
          
          console.log(finalPosts);
          
          res.status(200).json(finalPosts);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    };
    module.exports={explorePage}
    
    // Connect to MongoDB
   
  