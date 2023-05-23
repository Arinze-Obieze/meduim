


{posts &&
 posts.map((post) => (
          <Link key={post._id} href={`/posts${post.slug.current}`}>
           <img src={
                urlForImage(post.mainImage)
              } />
          </Link>
)}






             {posts &&
          posts.map((post) => (
          <Link key={post._id} href={`/posts${post.slug.current}`}>
            <div>
              <img src={
                urlForImage(post.mainImage)
              } />
              <div>
                <div>
                  <p>{post.title}</p>
                  <p>
                    {post.body} by {post.author.name}
                  </p>
                </div>

                <img src={urlForImage(post.author.image)} alt='author image' />


              </div>
            </div>
          </Link>
        ))}