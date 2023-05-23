import Header from "@/components/Header";
import { client } from "@/sanity/lib/client";
import urlBuilder from "@sanity/image-url/lib/types/builder";

const Post = () => {
    return (
        <div>
            <Header />
        </div>
    );
}
export default Post;

export const getStaticPaths = async () => {
    const query = `*[_type=="posts]{
        _id,
        slug{
            current
        }
    }`

    const posts = await client.fetch(query)

    const paths = posts.map((post) => (
        {
            params: {
                slug: post.slug.current
            }
        }
    ))

    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps = async ({ params }) => {
    const query = `[_type == "posts" && slug.current== $slug][0]{
        _id,
        _createdAt,
    title,
    author ->{
        name,
        image
    },
    'comments': *[
        _type == "comment" && 
        post._ref == ^._id &&
        approved == true],

        description,
        mainImage,
        body[]{
            children[] {
              text
            }
    ]
    
    }`
    const post = await client.fetch(query, {
        slug: params?.slug
    })
if(!post){
    return{
        notFound: true
    }
}

return{
    props:{
        post,
    }
}
}
