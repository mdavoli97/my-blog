import { GetStaticProps } from "next";
import { useState } from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

interface IformInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IformInput>();

  const onSubmit: SubmitHandler<IformInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        setSubmitted(false);
      });
  };

  return (
    <main className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white pb-5">
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()}
        alt=""
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt=""
          />
          <p className="font-extralight text-sm">
            post by <span>{post.author.name}</span> - Published at{" "}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => <h1 className="text-l my-5" {...props} />,
              li: ({ children }: any) => (
                <li className="special-list-item">{children}</li>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-slate-700" />

      {submitted ? (
        <div className="flex flex-col p-10 my-10 bg-slate-700 text-white max-w-2xl mx-auto">
          <h3>Thank you for submitting your comment!</h3>
          <p>Once it has been approved, it will appear below</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 my-10 max-w-2xl mx-auto mb-10"
        >
          <h3 className="text-sm text-white">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="block mb-5">
            <span className="text-grey-700 ">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border bg-gray-50 text-black rounded py-2 px-3 form-input mt-1 block w-full ring-slate-700 outline-none focus:ring"
              placeholder="Freddy Manrique"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-grey-700 ">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border bg-gray-50 text-black rounded py-2 px-3 form-input mt-1 block w-full ring-slate-700 outline-none focus:ring"
              placeholder="freddy@gmail.com"
              type="email"
            />
          </label>
          <label className="block mb-5">
            <span className="text-grey-700 ">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border bg-gray-50 text-black rounded py-2 px-3 form-textarea mt-1 block w-full ring-slate-700 outline-none focus:ring"
              placeholder="Type your comment here..."
              rows={8}
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <p className="text-red-500">- The Name field is required</p>
            )}
            {errors.email && (
              <p className="text-red-500">- The Email field is required</p>
            )}
            {errors.comment && (
              <p className="text-red-500">- The Comment field is required</p>
            )}
          </div>

          <input
            type="submit"
            className="bg-slate-700 hover:bg-slate-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}

      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-slate-700 space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post?.comments?.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-slate-700 ml-2">{comment.name}</span>:{" "}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
        _createdAt,
        _id,
        slug {
        current
      }
      }`;

  const post = await sanityClient.fetch(query);

  const paths = post.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
        _id,
        _createdAt,
         title,
        slug,
         author -> {
        name,
        image
        },
        'comments': *[
            _type == 'comment' && 
            post._ref == ^._id && 
            approved == true],
        description,
        mainImage,
        slug,
        body
    }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};
