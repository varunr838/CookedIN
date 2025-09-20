import { motion, AnimatePresence } from "framer-motion";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Reply, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface CommentDrawerProps {
  postId: Id<"posts">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentDrawer({ postId, open, onOpenChange }: CommentDrawerProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<Id<"comments"> | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const comments = useQuery(api.comments.listForPost, { postId });
  const createComment = useMutation(api.comments.createComment);
  const navigate = useNavigate();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createComment({
        postId,
        content: newComment.trim(),
      });
      setNewComment("");
      toast("Comment posted! 💬", {
        description: "Your thoughts have been shared with the community",
      });
    } catch (error) {
      toast.error("Failed to post comment", {
        description: "Please try again later",
      });
    }
  };

  const handleSubmitReply = async (parentCommentId: Id<"comments">) => {
    if (!replyText.trim()) return;

    try {
      await createComment({
        postId,
        content: replyText.trim(),
        parentCommentId,
      });
      setReplyText("");
      setReplyingTo(null);
      toast("Reply posted! 💬", {
        description: "Your reply has been added to the conversation",
      });
    } catch (error) {
      toast.error("Failed to post reply", {
        description: "Please try again later",
      });
    }
  };

  const handleUsernameClick = (userId: Id<"users">) => {
    navigate(`/profile/${userId}`);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full sm:w-96 sm:max-w-96 fixed right-0 top-0 rounded-none">
        <DrawerHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-heading font-bold text-xl">Comments</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* AI Analysis Section (Placeholder) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-2xl p-4 border border-accent/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-accent">AI Chef Analysis</h3>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              This recipe showcases excellent flavor balance with complementary ingredients. 
              The cooking technique preserves nutritional value while maximizing taste. 
              Great choice for both beginners and experienced cooks!
            </p>
          </motion.div>

          {/* Comment Form */}
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts about this recipe..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="glass border-primary/30 focus:border-primary/50 font-body resize-none"
              rows={3}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-heading font-semibold"
            >
              Post Comment
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments === undefined ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="font-body text-muted-foreground">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <p className="font-heading font-semibold mb-2">No comments yet</p>
                <p className="font-body text-muted-foreground text-sm">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    {/* Main Comment */}
                    <div className="glass rounded-xl p-4 border border-border/50">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                          <AvatarImage src={comment.authorImage} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-heading font-semibold">
                            {comment.authorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUsernameClick(comment.authorId)}
                              className="font-heading font-semibold text-sm hover:text-primary transition-colors cursor-pointer"
                            >
                              {comment.authorName}
                            </button>
                            <span className="text-xs text-muted-foreground font-body">
                              {new Date(comment._creationTime).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-body text-sm leading-relaxed">{comment.content}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(comment._id)}
                            className="text-xs text-muted-foreground hover:text-primary font-body"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pl-11 space-y-2"
                        >
                          <Textarea
                            placeholder={`Reply to ${comment.authorName}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="glass border-primary/30 focus:border-primary/50 font-body resize-none text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReply(comment._id)}
                              disabled={!replyText.trim()}
                              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-body text-xs"
                            >
                              Reply
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="font-body text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-8 space-y-2">
                        {comment.replies.map((reply) => (
                          <motion.div
                            key={reply._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass rounded-lg p-3 border border-border/30"
                          >
                            <div className="flex items-start gap-2">
                              <Avatar className="w-6 h-6 ring-1 ring-primary/20">
                                <AvatarImage src={reply.authorImage} />
                                <AvatarFallback className="bg-gradient-to-br from-secondary to-accent text-white text-xs font-heading font-semibold">
                                  {reply.authorName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleUsernameClick(reply.authorId)}
                                    className="font-heading font-semibold text-xs hover:text-primary transition-colors cursor-pointer"
                                  >
                                    {reply.authorName}
                                  </button>
                                  <span className="text-xs text-muted-foreground font-body">
                                    {new Date(reply._creationTime).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="font-body text-xs leading-relaxed">{reply.content}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
