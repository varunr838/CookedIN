import { motion } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChefHat, ThumbsUp, ThumbsDown, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";

interface PostCardProps {
  post: Doc<"posts">;
}

export function PostCard({ post }: PostCardProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const toggleInteraction = useMutation(api.posts.toggleInteraction);
  const userInteraction = useQuery(api.posts.getUserInteraction, { postId: post._id });

  const handleInteraction = async (type: "approve" | "disapprove") => {
    if (isInteracting) return;
    
    setIsInteracting(true);
    try {
      await toggleInteraction({ postId: post._id, type });
      
      if (type === "approve") {
        toast("Recipe approved! 👨‍🍳", {
          description: "Great taste in food!",
        });
      } else {
        toast("Feedback noted 📝", {
          description: "Thanks for your honest opinion!",
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
    } finally {
      setIsInteracting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Recipe link copied! 📋", {
      description: "Share this delicious recipe with friends",
    });
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="glass rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Header with author info */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20">
            <AvatarImage src={post.authorImage} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-heading font-semibold">
              {post.authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-heading font-semibold text-lg">{post.authorName}</h4>
            <p className="text-sm text-muted-foreground font-body">
              {new Date(post._creationTime).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 pb-4">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          {post.title}
        </h2>
      </div>

      {/* Ingredients */}
      <div className="px-6 pb-4">
        <h3 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-primary" />
          Ingredients Used
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {post.ingredients.map((ingredient, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 font-body text-sm"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full flex-shrink-0" />
              {ingredient}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Caption */}
      <div className="px-6 pb-4">
        <p className="font-body text-foreground leading-relaxed">
          {post.caption}
        </p>
      </div>

      {/* Media */}
      {post.mediaFiles.length > 0 && (
        <div className="px-6 pb-4">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={post.mediaFiles[0]}
              alt={post.title}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-6 py-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Approve Button */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleInteraction("approve")}
                disabled={isInteracting}
                className={`flex items-center gap-2 hover:bg-primary/10 ${
                  userInteraction?.type === "approve" 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground"
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="font-body font-medium">{post.approvals}</span>
              </Button>
            </motion.div>

            {/* Disapprove Button */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleInteraction("disapprove")}
                disabled={isInteracting}
                className={`flex items-center gap-2 hover:bg-destructive/10 ${
                  userInteraction?.type === "disapprove" 
                    ? "text-destructive bg-destructive/10" 
                    : "text-muted-foreground"
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="font-body font-medium">{post.disapprovals}</span>
              </Button>
            </motion.div>

            {/* Comment Button */}
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-muted-foreground hover:bg-accent/10 hover:text-accent"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-body font-medium">{post.comments}</span>
              </Button>
            </motion.div>
          </div>

          {/* Share Button */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
