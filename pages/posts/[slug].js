import Header from "@/components/Header";
import { client } from "@/sanity/lib/client";
import { urlForImage } from '@/sanity/lib/image'
import PortableText from "react-portable-text";

const Post = ({ post }) => {
    console.log(post);

    return (
        <main>
            <Header />
            {/* Render the post details */}
            <img
                className="w-full h-48 object-cover"
                src={urlForImage(post.mainImage).url()}
                alt='' />

            <article className="max-w-3xl mx-auto p-5">
                <h1 className="text-3xl mt-3 mb-3">{post.title}</h1>
                <h2 className="text-xl font-light text-grey-500">{post.description}</h2>

                <div className="flex items-center space-x-2">
                    <img
                        className="h-10 w-10 rounded-full"
                        src={urlForImage(post.author.image).url()}
                        alt='' />
                    <p className="font-extralight text-sm">
                        Blog post by <span className="text-green-600">{post.author.name}</span> - Published at {post._createdAt}
                    </p>

                </div>

<div className="mt-10"> 
    <PortableText
        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
   content={post.body}
   serializers={{
    h1: (props)=>{
        <h1 className="text-2xl font-bold my-5" {...props}/>
    },
    h2: (props)=>{{
        <h1 className="text-xl font-bold my-5" {...props}/>
    }},
    li:({children})=>{
        <li className="ml-4 list-disc">{children}</li>
    },
    links:({href, children})=>{
        <a href={href} className="text-blue-500 hover:underline"> {children}</a>
    }

   }}
    />
</div>

            </article>

            <hr className="max-w-lg my-5 mx-auto border border-yellow-500"/>
        
        <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
<h3 className="text-sm text-yellow-500">Enjoyed this article</h3>
<h4 className="text-3xl font-bold">Leave a comment below</h4>
<hr className="py-3 mt-2"/>

<label className="block mb-5">
<span className="text-gray-700"> Name</span>
<input className="shadow border rounded py-5 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring" placeholder="john Appleseed" type="text" />
</label>

<label className="block mb-5">
<span className="text-gray-700"> Email</span>
<input className="shadow border rounded py-5 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring" placeholder="johnAppleseed@gmail.com" type="text" />
</label>

<label className="block mb-5">
<span className="text-gray-700"> comment</span>
<textarea 
className="shadow border rounded-py-2 px-3 form-textarea 
mt-1 block w-full ring-yellow-500 outline-none focus:ring" 
placeholder="john Appleseed" 
type="text" rows={8} />
</label>



        </form>
        </main>
    );
};

export default Post;

export const getStaticPaths = async () => {
    const query = `
    *[_type == "post"] {
      slug {
        current
      }
    }
  `;
    const posts = await client.fetch(query);
    const paths = posts.map((post) => ({
        params: {
            slug: post.slug.current,
        },
    }));

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps = async ({ params }) => {
    const query = `
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      author->{
        name,
        image
      },
      'comments': *[ _type == "comment" && post._ref == ^._id ],
      description,
      mainImage,
      slug,
      body
    }
  `;

    const post = await client.fetch(query, { slug: params.slug });

    if (!post) {
        return {
            notFound: true,
        };
    } else {
        return {
            props: {
                post,
            },
            revalidate: 120, // updates the old cache after 120 seconds
        };
    };

};
