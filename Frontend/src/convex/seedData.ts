import { mutation } from "./_generated/server";

export const seedPosts = mutation({
  args: {},
  handler: async (ctx) => {
    // Create some sample posts for demonstration
    const samplePosts = [
      {
        title: "Spicy Avocado Toast Supreme",
        ingredients: ["Sourdough bread", "Ripe avocado", "Cherry tomatoes", "Red pepper flakes", "Lime juice", "Sea salt"],
        caption: "Just whipped up this incredible avocado toast! The combination of creamy avocado with the kick of red pepper flakes is absolutely divine. Perfect for a quick breakfast or afternoon snack! 🥑✨",
        mediaFiles: ["https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800"],
        authorId: "sample_user_1" as any,
        authorName: "Chef Maria",
        authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        approvals: 24,
        disapprovals: 2,
        comments: 8,
      },
      {
        title: "Rainbow Buddha Bowl",
        ingredients: ["Quinoa", "Purple cabbage", "Carrots", "Chickpeas", "Tahini", "Lemon", "Spinach", "Beets"],
        caption: "Meal prep Sunday done right! This colorful buddha bowl is packed with nutrients and flavor. The tahini dressing ties everything together beautifully. Who says healthy can't be delicious? 🌈",
        mediaFiles: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"],
        authorId: "sample_user_2" as any,
        authorName: "Healthy Hannah",
        authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        approvals: 42,
        disapprovals: 1,
        comments: 15,
      },
      {
        title: "Homemade Pasta Perfection",
        ingredients: ["00 Flour", "Eggs", "Olive oil", "Salt", "Fresh basil", "San Marzano tomatoes", "Parmesan"],
        caption: "Nothing beats fresh homemade pasta! Spent the afternoon making this from scratch and the texture is incredible. The simple tomato sauce really lets the pasta shine. Nonna would be proud! 🍝",
        mediaFiles: ["https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800"],
        authorId: "sample_user_3" as any,
        authorName: "Pasta Paolo",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        approvals: 67,
        disapprovals: 3,
        comments: 23,
      }
    ];

    for (const post of samplePosts) {
      await ctx.db.insert("posts", post);
    }

    return "Sample posts created successfully!";
  },
});
