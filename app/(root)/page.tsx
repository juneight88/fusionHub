import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    10
  );

  return (
    <>
      <h1 style={{ fontSize: "2em", fontWeight: "bold", textAlign: "left", color: "white", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}>Home</h1>
      <h2 style={{ fontSize: "2.5em", fontWeight: "bold", textAlign: "center", color: "#5DEBD7", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", marginBottom: "20px" }}>Welcome to Fusion</h2>
      <h3 style={{ fontSize: "1.5em", fontWeight: "normal", textAlign: "center", color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", lineHeight: "1.5" }}>Imagine a world where you can share your thoughts and explore solutions for any troubleshooting problems!</h3>
      <h5 style={{ fontSize: "0.8em", fontWeight: "small", textAlign: "right", color: "white", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", lineHeight: "1.5" }}>-Moonstone</h5>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Post found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}
