"use client"

import { useEffect, useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Dish {
  isVeg: any
  id: string
  name: string
  description: string
  price: number
  image: string
  spiceLevel: number | null
  categories: Array<{ categoryId: string; category: { id: string; name: string } }>
}

interface Category {
  id: string
  name: string
  dishes: Dish[]
}

interface Restaurant {
  id: string
  name: string
  location: string
  categories: Category[]
}

const restaurantData = {
  name: "Super Restaurant",
  location: "Mumbai",
  categories: [
    {
      id: "recommended",
      name: "Recommended",
      group: "Recommended",
      dishes: [
        {
          id: "d1",
          name: "Apple Pie",
          description: "A Bengali cuisine. Diced potatoes, sweet potatoes, broad beans, eggplant, drumsticks, raw bananas, radish cooked together and sauted with mustard seeds",
          price: 140,
          isVeg: false,
          image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=300&h=300&fit=crop"
        },
        {
          id: "d2",
          name: "Chocolate Mousse",
          description: "A baked salted wheat flour cake filled with sattu (baked chickpea flour) and some special spices",
          price: 140,
          isVeg: false,
          image: "https://images.unsplash.com/photo-1541599468348-e96984315921?w=300&h=300&fit=crop"
        }
      ]
    },
    {
      id: "appetizers",
      name: "Appetizers",
      group: "Starter",
      dishes: [
        {
          id: "d3",
          name: "Aloo Tikki",
          description: "Crispy potato patties served with tangy tamarind chutney and mint sauce",
          price: 90,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop"
        },
        {
          id: "d4",
          name: "Breaded Mushrooms",
          description: "Une soupe épicée aigre habituellement faite avec le tamarin, les tomates, le poivre et autres épices sud de l'Inde",
          price: 130,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1621510456681-2330135e5871?w=300&h=300&fit=crop"
        },
        {
          id: "d5",
          name: "Bruschetta",
          description: "Toasted bread topped with fresh tomatoes, basil, garlic and olive oil",
          price: 125,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&h=300&fit=crop"
        }
      ]
    },
    {
      id: "bar-food",
      name: "Bar Food",
      group: "Starter",
      dishes: [
        {
          id: "d6",
          name: "Chicken Wings",
          description: "Spicy buffalo wings served with blue cheese dip and celery sticks",
          price: 280,
          isVeg: false,
          image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=300&h=300&fit=crop"
        },
        {
          id: "d7",
          name: "Loaded Nachos",
          description: "Crispy tortilla chips topped with cheese, jalapeños, sour cream and salsa",
          price: 220,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300&h=300&fit=crop"
        }
      ]
    },
    {
      id: "north-indian",
      name: "North Indian",
      group: "Main Course",
      dishes: [
        {
          id: "d8",
          name: "Butter Chicken",
          description: "Tender chicken pieces in a rich, creamy tomato-based curry",
          price: 320,
          isVeg: false,
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=300&fit=crop"
        },
        {
          id: "d9",
          name: "Paneer Tikka Masala",
          description: "Grilled cottage cheese cubes in a spiced tomato gravy",
          price: 280,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop"
        }
      ]
    },
    {
      id: "south-indian",
      name: "South Indian",
      group: "Main Course",
      dishes: [
        {
          id: "d10",
          name: "Masala Dosa",
          description: "Crispy rice crepe filled with spiced potato filling, served with sambar and chutney",
          price: 120,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&h=300&fit=crop"
        },
        {
          id: "d11",
          name: "Idli Sambar",
          description: "Steamed rice cakes served with lentil soup and coconut chutney",
          price: 90,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=300&h=300&fit=crop"
        }
      ]
    },
    {
      id: "pasta",
      name: "Pasta",
      group: "Main Course",
      dishes: [
        {
          id: "d12",
          name: "Penne Arrabbiata",
          description: "Penne pasta in spicy tomato sauce with garlic and red chilies",
          price: 260,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop"
        }
      ]
    },
    {
      id: "beverages",
      name: "Beverages",
      group: "Drinks",
      dishes: [
        {
          id: "d13",
          name: "Cappuccino",
          description: "麻辣和酸辣汤-般用罗望子、西红柿、辣椒等南印度的香料制成、通常吃过饭",
          price: 80,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop"
        },
        {
          id: "d14",
          name: "Clamato",
          description: "A Bengali cuisine. Diced potatoes, sweet potatoes, broad beans, eggplant, drumsticks, raw bananas, radish cooked together",
          price: 70,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=300&fit=crop"
        },
        {
          id: "d15",
          name: "Coke",
          description: "Very small dumplings of wheat flour are cooked along with green gram and whole red chili and red mustard is used as tempering",
          price: 70,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop"
        }
      ]
    },
    {
      id: "desserts",
      name: "Desserts",
      group: "Desserts",
      dishes: [
        {
          id: "d16",
          name: "Gulab Jamun",
          description: "Soft milk dumplings soaked in rose-flavored sugar syrup",
          price: 100,
          isVeg: true,
          image: "https://images.unsplash.com/photo-1610191567713-c1c98654f5f4?w=300&h=300&fit=crop"
        }
      ]
    }
  ]
};

export const categoryMenuData = [
  {
    group: "Recommended",
    items: [
      { name: "Desserts", count: 2 },
    ],
  },
  {
    group: "Starter",
    items: [
      { name: "Appetizers", count: 13 },
      { name: "Bar Food", count: 20 },
      { name: "Salad", count: 7 },
    ],
  },
  {
    group: "Desserts",
    items: [
      { name: "Desserts", count: 10 },
      { name: "Ice Cream", count: 9 },
    ],
  },
  {
    group: "Main Course",
    items: [
      { name: "North Indian", count: 22 },
      { name: "Pasta", count: 8 },
      { name: "Pizza", count: 12 },
      { name: "South Indian", count: 40 },
    ],
  },
  {
    group: "Drinks",
    items: [
      { name: "Aperitifs", count: 5 },
      { name: "Beer", count: 19 },
      { name: "Beverages", count: 29 },
      { name: "Cocktails", count: 20 },
      { name: "Cognac", count: 3 },
      { name: "Gin", count: 4 },
      { name: "Liquor", count: 14 },
      { name: "Mocktails", count: 7 },
      { name: "Shooter", count: 11 },
    ],
  },
];


export default function CustomerMenuPage(params: { params: string }) {
  const [activeCategory, setActiveCategory] = useState("recommended");
  const [menuOpen, setMenuOpen] = useState(false);
  // const categoryRefs = useRef({});
  const isScrolling = useRef(false);
  // const [menuOpen, setMenuOpen] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  // const [activeCategory, setActiveCategory] = useState<string>("")
  const [scrolling, setScrolling] = useState(false)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const floatingMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`/api/menu/${params?.params}`)
        const data = await response.json()
        setRestaurant(data)
        if (data.categories.length > 0) {
          setActiveCategory(data.categories[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [params?.params])

  useEffect(() => {
    const handleScroll = () => {
      if (scrolling) return

      // Find which category is currently in view
      const categoryElements = Object.entries(categoryRefs.current)
      let currentCategory = activeCategory

      for (const [categoryId, element] of categoryElements) {
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top >= 0 && rect.top <= 300) {
            currentCategory = categoryId
            break
          }
        }
      }

      setActiveCategory(currentCategory)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolling, activeCategory])

  // const handleCategoryClick = (categoryId: string) => {
  //   setScrolling(true)
  //   setActiveCategory(categoryId)
  //   const element = categoryRefs.current[categoryId]
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth" })
  //     setTimeout(() => setScrolling(false), 600)
  //   }
  // }

  const handleCategoryClick = (categoryId: any) => {
    const categoryElement = categoryRefs.current[categoryId];
    if (categoryElement) {
      isScrolling.current = true;
      setActiveCategory(categoryId);

      const offsetTop = categoryElement.offsetTop - 140;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollPosition = window.scrollY + 200;

      for (const category of restaurantData.categories) {
        const element = categoryRefs.current[category.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading menu...</p>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Menu not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex justify-center md:py-10">
      <div
        className="
      bg-background
      min-h-screen
      w-full
      md:w-[430px]
      md:rounded-2xl
      md:shadow-xl
      md:border
      relative
      overflow-hidden
    "
      >
        {/* HEADER */}
        <div className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="px-4 py-4">
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <p className="text-muted-foreground text-sm">{restaurant.location}</p>
          </div>
        </div>

        {/* MENU SECTION */}
        <div className="px-4 py-6 space-y-10">
          {restaurant.categories.map((category) => (
            <section
              id={`category-${category.id}`}
              key={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold">{category.name}</h2>

              {/* DISH LIST */}
              <div className="space-y-4">
                {category.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex p-3 border rounded-lg bg-white shadow-sm gap-3"
                  >
                    {/* Veg / Non-veg dot */}
                    <div className="pt-1">
                      <div className="w-5 h-5 rounded-sm border border-gray-500 flex items-center justify-center">
                        <div
                          className={`w-2 h-2 rounded-full ${dish?.isVeg ? "bg-green-600" : "bg-red-600"
                            }`}
                        />
                      </div>
                    </div>

                    {/* TEXT SECTION */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{dish.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {dish.description}
                      </p>
                      <p className="mt-1 font-semibold text-primary text-lg">
                        ₹ {dish.price}
                      </p>
                    </div>

                    {/* RIGHT IMAGE */}
                    {dish.image && (
                      <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* FLOATING MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary 
             text-primary-foreground px-6 py-3 rounded-full shadow-xl 
             flex items-center gap-2 z-50"
        >
          <span className="text-lg">☰</span> Menu
        </button>
        {menuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">

            {/* MOBILE-CONTAINER — FIXED WIDTH */}
            <div
              className="bg-white rounded-2xl shadow-xl 
                 w-[360px] max-w-[90%] 
                 max-h-[85vh] overflow-hidden flex flex-col"
            >

              {/* HEADER */}
              <div className="flex justify-end p-4 border-b">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="overflow-y-auto px-6 py-4 space-y-8">
                {categoryMenuData.map((section) => (
                  <div key={section.group}>
                    <h3 className="text-center text-lg font-bold text-red-500 mb-4">
                      {section.group}
                    </h3>

                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <div
                          key={item.name}
                          onClick={() => {
                            handleCategoryClick(item.name);
                            setMenuOpen(false);
                          }}
                          className="flex justify-between items-center 
                             bg-gray-50 px-4 py-3 rounded-xl shadow-sm
                             text-gray-800 text-base cursor-pointer"
                        >
                          <span>{item.name}</span>
                          <span className="font-semibold">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div >
  )
}
