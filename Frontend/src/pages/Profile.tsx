import { useParams, useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/PostCard";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const me = useQuery(api.users.currentUser, {});
  const viewingUser = useQuery(
    api.users.getUserById,
    userId ? { userId: userId as Id<"users"> } : me?._id ? { userId: me._id as Id<"users"> } : "skip" as any
  );

  const isSelf = useMemo(() => {
    return me && viewingUser && me._id === viewingUser._id;
  }, [me, viewingUser]);

  const posts = useQuery(
    api.posts.getPostsByUser,
    viewingUser ? { userId: viewingUser._id } : "skip" as any
  );

  const updateProfile = useMutation(api.users.updateProfile);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  // Initialize edit fields when dialog opens
  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (val && viewingUser) {
      setName(viewingUser.name || "");
      setBio(viewingUser.bio || "");
    }
  };

  if (userId && userId === "undefined") {
    navigate("/profile");
    return null;
  }

  if (me === undefined || viewingUser === undefined) {
    return (
      <div className="pt-16 text-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="font-body text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!viewingUser) {
    return (
      <div className="pt-16 text-center py-16">
        <p className="font-heading text-xl">User not found</p>
        <Button className="mt-4" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="pt-16 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <Card className="glass-strong border-2 border-primary/20 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                <AvatarImage src={viewingUser.image} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-heading text-2xl">
                  {(viewingUser.name || "C")[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-heading font-bold">{viewingUser.name || "Anonymous Chef"}</h1>
                {viewingUser.bio && (
                  <p className="font-body text-muted-foreground mt-1">{viewingUser.bio}</p>
                )}
              </div>
              {isSelf && (
                <Button onClick={() => handleOpenChange(true)} className="bg-gradient-to-r from-primary to-accent">
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-2 border-accent/20 shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading">Honor Points</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              {viewingUser.honorPoints ?? 0}
            </motion.div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-2 border-secondary/20 shadow-xl">
          <CardHeader>
            <CardTitle className="font-heading">Redemption History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {(viewingUser.redemptionHistory || []).length === 0 ? (
              <p className="font-body text-muted-foreground">No redemptions yet.</p>
            ) : (
              (viewingUser.redemptionHistory || []).map((r) => (
                <div key={`${r.itemId}-${r.redeemedAt}`} className="flex items-center justify-between glass rounded-lg p-3 border">
                  <div>
                    <p className="font-heading font-medium">{r.name}</p>
                    <p className="text-xs font-body text-muted-foreground">
                      {new Date(r.redeemedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-heading text-sm">{r.cost} pts</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-heading text-xl">Posts by {viewingUser.name || "this user"}</h2>
        {posts === undefined ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="font-body text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🍳</div>
            <p className="font-body text-muted-foreground">No posts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-heading">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-heading">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-primary to-accent"
              onClick={async () => {
                try {
                  await updateProfile({ name, bio });
                  toast("Profile updated!");
                  setOpen(false);
                } catch {
                  toast.error("Failed to update profile");
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
