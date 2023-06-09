import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header'
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import Link from 'next/link'
import post from '@/sanity/schemas/post'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ posts }) {
  console.log(posts)
  return (
    <div className='max-w-7xl  mx-auto'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {console.log(post)}
      <div className='flex justify-between items-center
      bg-yellow-400 border-y border-black py-10 lg:py-0 '>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='underline decoration-black decoration-4'>Medium  </span> is a place to write, read and connect</h1>
          <h2>its easy and free to post your thinking on any topic and connect with millions of readers.  </h2>
        </div>


        <img
          className='hidden md:inline-flex h-32 lg:h-full'
          src='https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png' />
      </div>

      {/* POSTS */}
      <div className='grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        {posts.map(post => (
          <Link key={post._id} href={`/posts/${post.slug.current}`}>
            <div className='border rounded-lg group cursor-pointer overflow-hidden'>
              <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out'
                src={urlForImage(post.mainImage).url()} alt='' />
              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-xs'>{post.description} by
                    {post.author.name}</p>
                </div>
                <img
                  className='h-12 w-12 rounded-full'
                  src={urlForImage(post.author.image)}
                  alt='' />

              </div>
            </div>
          </Link>
        ))}

      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query =
    `*[_type == "post"] {
    _id,
    description,
      _createdAt,
      mainImage,
      slug{current},
       author -> {
        name,
        image
      },
    title,
    body[]{
      children[] {
        text
      }
    }}`;

  const posts = await client.fetch(query)
  return {
    props: {
      posts,
    }
  }
}