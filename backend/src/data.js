export const products = [
["Royal Gala Apples","Fruits",149,"🍎"],["Fresh Bananas","Fruits",49,"🍌"],["Alphonso Mangoes","Fruits",199,"🥭"],["Nagpur Oranges","Fruits",89,"🍊"],["Green Grapes","Fruits",119,"🍇"],
["Farm Tomatoes","Vegetables",59,"🍅"],["Fresh Potatoes","Vegetables",45,"🥔"],["Crunchy Carrots","Vegetables",65,"🥕"],["Green Broccoli","Vegetables",89,"🥦"],["Red Onions","Vegetables",55,"🧅"],
["Full Cream Milk","Dairy",69,"🥛"],["Salted Butter","Dairy",125,"🧈"],["Cheddar Cheese Slices","Dairy",179,"🧀"],["Classic Curd","Dairy",65,"🥣"],["Fresh Paneer","Dairy",149,"🧀"],
["Classic Potato Chips","Snacks",30,"🥔"],["Milk Chocolate Bar","Snacks",50,"🍫"],["Butter Cookies","Snacks",85,"🍪"],["Movie Night Popcorn","Snacks",99,"🍿"],["Masala Namkeen","Snacks",70,"🥜"],
["Cola Drink","Beverages",45,"🥤"],["Orange Juice","Beverages",110,"🧃"],["Green Tea Bags","Beverages",160,"🍵"],["Instant Coffee","Beverages",220,"☕"],["Mineral Water","Beverages",25,"💧"],
["Premium Basmati Rice","Staples",499,"🍚"],["Whole Wheat Atta","Staples",299,"🌾"],["Toor Dal","Staples",189,"🫘"],["Fine Sugar","Staples",59,"🧂"],["Sunflower Cooking Oil","Staples",159,"🫗"]
].map((p,i)=>({id:i+1,name:p[0],category:p[1],price:p[2],icon:p[3],stock:20+((i*7)%31)}));
