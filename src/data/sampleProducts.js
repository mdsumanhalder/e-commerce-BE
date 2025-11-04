const sampleProducts = [
  {
    title: "Stylish Cotton T-Shirt",
    description: "Comfortable cotton t-shirt perfect for casual wear. Made from premium quality cotton with a modern fit.",
    price: 999,
    discountedPrice: 799,
    discountPersent: 20,
    quantity: 50,
    brand: "FashionHub",
    color: "Blue",
    size: [
      { name: "S", quantity: 10 },
      { name: "M", quantity: 15 },
      { name: "L", quantity: 15 },
      { name: "XL", quantity: 10 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    topLevelCategory: "Men",
    secondLevelCategory: "Clothing",
    thirdLevelCategory: "T-Shirts"
  },
  {
    title: "Premium Leather Jacket",
    description: "Genuine leather jacket with modern styling. Perfect for both casual and semi-formal occasions.",
    price: 4999,
    discountedPrice: 3999,
    discountPersent: 20,
    quantity: 25,
    brand: "LeatherCraft",
    color: "Black",
    size: [
      { name: "M", quantity: 8 },
      { name: "L", quantity: 10 },
      { name: "XL", quantity: 7 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    topLevelCategory: "Men",
    secondLevelCategory: "Clothing", 
    thirdLevelCategory: "Jackets"
  },
  {
    title: "Elegant Summer Dress",
    description: "Beautiful floral summer dress made from breathable fabric. Perfect for summer outings and parties.",
    price: 2499,
    discountedPrice: 1999,
    discountPersent: 20,
    quantity: 30,
    brand: "SummerVibes",
    color: "Floral",
    size: [
      { name: "S", quantity: 8 },
      { name: "M", quantity: 12 },
      { name: "L", quantity: 10 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop",
    topLevelCategory: "Women",
    secondLevelCategory: "Clothing",
    thirdLevelCategory: "Dresses"
  },
  {
    title: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and long battery life.",
    price: 3999,
    discountedPrice: 2999,
    discountPersent: 25,
    quantity: 40,
    brand: "AudioTech",
    color: "Black",
    size: [
      { name: "One Size", quantity: 40 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    topLevelCategory: "Electronics",
    secondLevelCategory: "Audio",
    thirdLevelCategory: "Headphones"
  },
  {
    title: "Smartphone Case",
    description: "Durable protective case for smartphones with shock absorption and stylish design.",
    price: 799,
    discountedPrice: 599,
    discountPersent: 25,
    quantity: 100,
    brand: "ProtectPlus",
    color: "Clear",
    size: [
      { name: "iPhone", quantity: 50 },
      { name: "Samsung", quantity: 50 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=500&h=500&fit=crop",
    topLevelCategory: "Electronics",
    secondLevelCategory: "Accessories",
    thirdLevelCategory: "Phone Cases"
  },
  {
    title: "Running Sneakers",
    description: "Comfortable running shoes with advanced cushioning and breathable material.",
    price: 3499,
    discountedPrice: 2799,
    discountPersent: 20,
    quantity: 35,
    brand: "SportMax",
    color: "White",
    size: [
      { name: "7", quantity: 5 },
      { name: "8", quantity: 8 },
      { name: "9", quantity: 10 },
      { name: "10", quantity: 7 },
      { name: "11", quantity: 5 }
    ],
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    topLevelCategory: "Shoes",
    secondLevelCategory: "Sports",
    thirdLevelCategory: "Running"
  }
];

module.exports = sampleProducts;