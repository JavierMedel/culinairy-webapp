# CulinAIry 🍳

**Effortless AI Meal Planning. Picture It. Cook It. Enjoy It.**

A modern, animated web UI for an AI-powered meal planning website that displays recipes and allows users to chat with the system to get recipe suggestions.

## ✨ Features

- 🎨 **Modern, Animated UI** - Built with Framer Motion for smooth transitions
- 💬 **AI Chat Interface** - Ask for recipes and get personalized suggestions
- 📱 **Fully Responsive** - Works beautifully on mobile and desktop
- 🎭 **Smooth Animations** - Fade-in, slide-up, and hover effects throughout
- 🔄 **Real-time Recipe Search** - Instant results with loading states

## 🚀 Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Fetch API** for backend communication

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```
   
   Or copy the example file:
   ```bash
   cp .env.example .env.local
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔌 API Endpoints

The app connects to a FastAPI backend and expects these endpoints:

### `GET /recipes?limit=9`
Returns the default 9 recipes.

**Response:**
```json
[
  {
    "id": "creamy-garlic-salmon-penne",
    "name": "Creamy Garlic Salmon Penne",
    "description": "Rich creamy salmon pasta with garlic and herbs.",
    "image": "https://culinairy/images/salmon-penne.jpg"
  }
]
```

### `POST /query`
Triggered when the user enters a query in the chat box.

**Request:**
```json
{
  "query": "healthy chicken dinner"
}
```

**Response:**
```json
{
  "recipes": [
    {
      "id": "charred-shrimp-skewers",
      "name": "Charred Shrimp Skewers",
      "description": "Smoky grilled shrimp skewers with citrus glaze.",
      "image": "https://culinairy.io/images/shrimp-skewers.jpg"
    }
  ]
}
```

## 📁 Project Structure

```
culinairy-webapp/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page with state management
├── components/
│   ├── Header.tsx           # App title with fade-in animation
│   ├── ChatBox.tsx          # Chat input with slide-up animation
│   ├── RecipeCard.tsx       # Individual recipe card with hover effects
│   └── RecipeGrid.tsx       # Recipe grid with staggered animations
├── types/
│   └── index.ts             # TypeScript type definitions
└── ...config files
```

## 🎨 Design System

- **Primary Blue**: `#2563eb`
- **Primary Red**: `#ef4444`
- **Background**: Light gray `#f9fafb`
- **Font**: Inter (sans-serif)
- **Border Radius**: `rounded-2xl`
- **Shadows**: `shadow-lg`, `shadow-2xl`

## 🎬 Animations

- **Header**: Fade-in on page load
- **ChatBox**: Slide-up animation with delay
- **Recipe Cards**: Staggered fade + scale animation on render
- **Hover Effects**: Subtle lift and shadow on recipe cards
- **Loading States**: Spinner and pulse animations

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Notes

- The app loads 9 default recipes on page load
- When a user submits a query, the recipe grid animates and updates with new results
- If no recipes are found, a friendly message is displayed
- All components are fully responsive (1 column on mobile, 3 on desktop)

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 📄 License

MIT
