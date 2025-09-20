import { mutation } from "./_generated/server";

export const seedPosts = mutation({
  args: {},
  handler: async (ctx) => {
    // Create some sample posts for demonstration
    const samplePosts = [
      {
        title: "Spicy Avocado Toast Supreme",
        ingredients: [
          { name: "Sourdough bread", quantity: 2 },
          { name: "Ripe avocado", quantity: 1 },
          { name: "Cherry tomatoes", grams: 100 },
          { name: "Red pepper flakes", grams: 5 },
          { name: "Lime juice", grams: 15 },
          { name: "Sea salt", grams: 2 }
        ],
        caption: "Just whipped up this incredible avocado toast! The combination of creamy avocado with the kick of red pepper flakes is absolutely divine. Perfect for a quick breakfast or afternoon snack! 🥑✨",
        mediaFiles: ["https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800"],
        flairs: {
          cuisine: "Mediterranean",
          foodType: "Vegetarian",
          taste: "Savory",
          method: "Other"
        },
        authorId: "sample_user_1" as any,
        authorName: "Chef Maria",
        authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        approvals: 24,
        disapprovals: 2,
        comments: 8,
      },
      {
        title: "Rainbow Buddha Bowl",
        ingredients: [
          { name: "Quinoa", grams: 150 },
          { name: "Purple cabbage", grams: 100 },
          { name: "Carrots", quantity: 2 },
          { name: "Chickpeas", grams: 200 },
          { name: "Tahini", grams: 30 },
          { name: "Lemon", quantity: 1 },
          { name: "Spinach", grams: 50 },
          { name: "Beets", quantity: 2 }
        ],
        caption: "Meal prep Sunday done right! This colorful buddha bowl is packed with nutrients and flavor. The tahini dressing ties everything together beautifully. Who says healthy can't be delicious? 🌈",
        mediaFiles: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"],
        flairs: {
          cuisine: "Other",
          foodType: "Vegan",
          taste: "Savory",
          method: "Other"
        },
        authorId: "sample_user_2" as any,
        authorName: "Healthy Hannah",
        authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        approvals: 42,
        disapprovals: 1,
        comments: 15,
      },
      {
        title: "Homemade Pasta Perfection",
        ingredients: [
          { name: "00 Flour", grams: 400 },
          { name: "Eggs", quantity: 4 },
          { name: "Olive oil", grams: 15 },
          { name: "Salt", grams: 5 },
          { name: "Fresh basil", grams: 20 },
          { name: "San Marzano tomatoes", grams: 400 },
          { name: "Parmesan", grams: 100 }
        ],
        caption: "Nothing beats fresh homemade pasta! Spent the afternoon making this from scratch and the texture is incredible. The simple tomato sauce really lets the pasta shine. Nonna would be proud! 🍝",
        mediaFiles: ["https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800"],
        flairs: {
          cuisine: "Italian",
          foodType: "Vegetarian",
          taste: "Savory",
          method: "Boiled"
        },
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

export const seedRewards = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if rewards already exist
    const existingRewards = await ctx.db.query("rewards").collect();
    if (existingRewards.length > 0) {
      return "Rewards already exist";
    }

    const sampleRewards = [
      {
        name: "Premium Spice Blend Kit",
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300",
        cost: 500,
        active: true,
      },
      {
        name: "Organic Vegetable Box",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300",
        cost: 750,
        active: true,
      },
      {
        name: "Chef's Knife Set",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300",
        cost: 1200,
        active: true,
      },
      {
        name: "Cooking Class Voucher",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300",
        cost: 1000,
        active: true,
      },
      {
        name: "Artisan Olive Oil Collection",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300",
        cost: 600,
        active: true,
      },
      {
        name: "Gourmet Recipe Book",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300",
        cost: 300,
        active: true,
      },
    ];

    for (const reward of sampleRewards) {
      await ctx.db.insert("rewards", reward);
    }

    return "Sample rewards created successfully!";
  },
});