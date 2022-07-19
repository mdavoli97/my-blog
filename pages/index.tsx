import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import bull from "../assets/Images/bull-logo.png";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
import Link from "next/link";

interface Props {
  posts: [Post];
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div className="max-w-7xl mx-auto pb-2 bg-white dark:bg-slate-800">
      <Head>
        <title>My project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="flex justify-between space-x-2 items-center p-10 bg-slate-200 dark:bg-black border-y border-black">
        <div className="space-y-10 text-slate-800 dark:text-white">
          <h1 className="text-6xl max-w-2xl font-serif">
            <span className="underline decoration-black decoration-4 mr-4">
              Code hacks
            </span>
            for the future
          </h1>
          <h2 className="text-2xl w-1/2">
            Delve into this articles and make your work journey easier.
          </h2>
        </div>
        <div className="hidden md:inline-flex h-full">
          <Image src={bull} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.reverse().map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="border border-xl dark:border-none rounded group cursor-pointer overflow-hidden">
              <img
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                src={urlFor(post.mainImage).url()}
                alt=""
              />
              <div className="flex justify-between p-5 bg-white text-black">
                <div className="truncate w-9/12">
                  <p className="text-lg font-bold">{post.title}</p>
                  <div className="text-xs space-y-0.5 mt-1">
                    <p>{post.description}</p>
                    <p>by {post.author.name}</p>
                  </div>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
    slug,
    author -> {
    name,
    image
    },
  description,
  mainImage,
  slug,
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
