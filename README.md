# YouTube Clone - Frontend

# GitHub Link - https://github.com/adityasoam55/Youtube-Fe

A modern, responsive YouTube-like social video platform built with **React**, **Tailwind CSS**, and **Axios**. Features video uploading, streaming, comments, likes/dislikes, user authentication, and a fully functional channel management system.

## 🌟 Features

### User Authentication

- **Login & Register** with JWT-based authentication
- Secure token storage in localStorage
- Protected routes with automatic redirects
- Session persistence across page refreshes

### Video Management

- **Upload videos** with title, description, and category
- **Watch videos** with view tracking
- **Edit/Delete videos** from your channel
- **Video categories**: Frontend, JavaScript, Design, Backend, Database

### Engagement Features

- **Like/Dislike system** with real-time updates
- **Comments** - add, edit, and delete your comments
- **Author-only permissions** - only comment authors can edit/delete
- **Suggested videos** based on category
- **View counter** for each video

### User Profile

- **Customize channel** with banner and profile picture
- **Channel description** editing
- **Profile page** with channel info
- **Manage Videos** dashboard
- **Logout** functionality with navbar state sync

### UI/UX

- **Responsive design** - mobile, tablet, desktop
- **Dark theme** for watch/profile pages
- **Light theme** for customization
- **Hamburger menu** with smooth animations
- **Search functionality** with query parameters
- **Toast notifications** for user feedback (success, error, warning, info)
- **Loading states** with animated spinner component
- **Smooth transitions** and hover effects

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: react-icons
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useContext)
- **Form Handling**: Controlled components with ref-based file inputs

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **Backend API** running at `https://youtube-be-0qhc.onrender.com`

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/adityasoam55/Youtube-Fe.git
cd Youtube-Fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API endpoint

Edit `src/config/api.js`:

```javascript
const API_BASE_URL = "https://youtube-be-0qhc.onrender.com/api";
export default API_BASE_URL;
```

For local development, use:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

### 4. Start the development server

```bash
npm run dev
```

The app will run at `http://localhost:5173` (or another port if 5173 is busy).

### 5. Build for production

```bash
npm run build
```

Output goes to `dist/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation with search and user menu
│   ├── Home.jsx            # Video feed with category filtering
│   ├── VideoCard.jsx       # Reusable video grid card
│   ├── CommentBox.jsx      # Comment section with add/edit/delete
│   ├── Loading.jsx         # Loading spinner component
│   └── Toast.jsx           # Toast notification component
├── pages/
│   ├── Login.jsx           # User login page
│   ├── Register.jsx        # User registration page
│   ├── Profile.jsx         # User profile and channel info
│   ├── ProfileCustomize.jsx # Edit channel description, banner, avatar
│   ├── Upload.jsx          # Video upload form
│   ├── Watch.jsx           # Video player with comments
│   ├── Channel.jsx         # Manage user's uploaded videos
│   └── ProtectedRoute.jsx  # Route guard component
├── hooks/
│   └── useToast.js         # Toast notification hook
├── config/
│   └── api.js              # Centralized API URL configuration
├── App.jsx                 # Main app component with routing
├── index.css               # Global styles and animations
└── main.jsx                # Entry point

public/
└── (static assets)

vercel.json                # Vercel deployment config (SPA routing)
package.json              # Dependencies and scripts
```

## 🔑 Key API Endpoints Used

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Videos

- `GET /api/videos` - Fetch all videos (with optional category filter)
- `GET /api/videos/:id` - Get single video details
- `POST /api/videos/upload` - Upload new video
- `PUT /api/videos/channel/:id` - Update video details
- `DELETE /api/videos/channel/:id` - Delete video
- `PUT /api/videos/:id/view` - Increment view count
- `PUT /api/videos/:id/like` - Toggle like
- `PUT /api/videos/:id/dislike` - Toggle dislike
- `GET /api/videos/suggest/:category/:videoId` - Get suggested videos

### Comments

- `GET /api/comments/:videoId` - Fetch video comments
- `POST /api/comments/:videoId` - Add comment
- `PUT /api/comments/:commentId` - Edit comment
- `DELETE /api/comments/:commentId` - Delete comment

### User/Profile

- `GET /api/users/me` - Get logged-in user profile
- `PUT /api/users/update` - Update user info (username, description)
- `PUT /api/users/avatar` - Upload profile picture
- `PUT /api/users/banner` - Upload channel banner

## 🎨 Component Documentation

### Navbar

Top navigation bar with search, login/profile menu, and upload button.

```jsx
<Navbar />
```

- Syncs user state from localStorage
- Listens to `authChanged` event for instant logout updates
- Responsive hamburger menu on mobile

### VideoCard

Displays a video in grid layout with thumbnail, title, uploader info.

```jsx
<VideoCard video={videoData} />
```

### CommentBox

Add, edit, and delete comments on a video.

```jsx
<CommentBox video={video} setVideo={setVideo} />
```

### Loading

Animated loading spinner with message.

```jsx
<Loading message="Loading videos..." />
```

### Toast

Toast notification component for feedback.

```jsx
<Toast message="Success!" type="success" duration={3000} onClose={() => {}} />
```

Types: `success`, `error`, `warning`, `info`

## 🔒 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in `localStorage.token`
4. User object stored in `localStorage.user`
5. Protected routes check token presence
6. Axios requests include `Authorization: Bearer ${token}` header
7. On logout: token and user cleared, navbar updates via `authChanged` event

## 🚀 Deployment

### Vercel (Recommended for Frontend)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables (if needed)
4. Deploy automatically on push

The `vercel.json` file ensures SPA routes work correctly (all paths serve `index.html`).

### Alternative: Manual Build & Deploy

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint (if configured)
```

## 🐛 Troubleshooting

### "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### API connection errors

- Verify backend is running and accessible
- Check `src/config/api.js` for correct URL
- Open browser DevTools → Network tab to inspect requests

### Login not persisting

- Check that `localStorage` is enabled in browser
- Verify token is being saved: `localStorage.getItem('token')`

### Toast not showing

- Ensure `Toast.jsx` is in `src/components/`
- Check that toasts are rendered in the component (see examples in Watch.jsx, Channel.jsx)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Environment Variables

Create a `.env.local` file (optional):

```
VITE_API_URL=https://youtube-be-0qhc.onrender.com/api
```

Reference in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

## 🎯 Future Enhancements

- [ ] Playlists support
- [ ] Video search with advanced filters
- [ ] User subscriptions
- [ ] Notifications system
- [ ] Dark/Light theme toggle
- [ ] Video duration tracking
- [ ] Upload progress indicator
- [ ] Video quality selection
- [ ] Shorts feature
- [ ] Analytics dashboard

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Aditya Som**

- GitHub: [@adityasoam55](https://github.com/adityasoam55)

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the author.

---

**Backend Repository**: [Youtube-Be](https://github.com/adityasoam55/Youtube-Be)

**Live Demo**: [YouTube Clone](https://youtube-fe-liart.vercel.app/)
