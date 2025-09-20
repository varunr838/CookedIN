import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";

export function PostFeed() {
  const posts = useQuery(api.posts.getAllPosts);

  if (posts === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="font-heading font-medium text-muted-foreground">
            Loading delicious recipes...
          </p>
        </motion.div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-12 text-center"
      >
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-xl font-heading font-bold mb-2">No recipes yet!</h3>
        <p className="text-muted-foreground font-body">
          Be the first to share your culinary creation
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  );
}
