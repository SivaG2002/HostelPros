# CampusConnect - Hostel Management System (HTML/CSS/JS Version)

A complete conversion of the React-based hostel management system to vanilla HTML, CSS, and JavaScript.

## 📁 Folder Structure

```
hostel-static/
├── index.html                 # Login page
├── css/
│   └── styles.css            # Main stylesheet with all styles
├── js/
│   └── app.js                # Core JavaScript functions for API calls and utilities
└── pages/
    ├── admin-dashboard.html           # Admin main dashboard
    ├── students.html                  # Student management (view, add, edit, delete)
    ├── rooms.html                     # Room management
    ├── notices.html                   # Notice management
    ├── complaints.html                # Complaint management
    ├── fees.html                      # Fees management
    ├── student-dashboard.html         # Student main dashboard
    ├── student-fees.html              # Student fees & payment
    ├── student-notices.html           # Student notices view
    ├── student-complaints.html        # Student complaints filing
    └── student-rules.html             # Hostel rules & regulations
```

## 🚀 Getting Started

### Option 1: Using Live Server (Recommended)
1. Open the `hostel-static` folder in VS Code
2. Install the "Live Server" extension if not already installed
3. Right-click on `index.html` and select "Open with Live Server"
4. The app will open at `http://localhost:5500`

### Option 2: Using Python
```bash
cd hostel-static
python -m http.server 8000
```
Then visit `http://localhost:8000`

### Option 3: Using Node.js
```bash
cd hostel-static
npx http-server
```

## 🔐 Login Credentials

For demo purposes, use these credentials:

**Admin Account:**
- Email: `admin@hostel.com`
- Password: `admin123`

**Student Account:**
- Email: `student@hostel.com`
- Password: `student123`

## 🎨 Features

### Admin Features
- **Dashboard**: View key statistics (total students, rooms, complaints, fees)
- **Students**: Manage student records (add, edit, delete)
- **Rooms**: View and manage hostel rooms with occupancy details
- **Notices**: Create and manage hostel notices
- **Complaints**: Track and respond to student complaints
- **Fees**: Monitor student fee payments and payment history

### Student Features
- **Dashboard**: View personal profile, room info, fees status, latest notices and complaints
- **Fees**: Check fee status and payment history
- **Notices**: View all hostel notices
- **Complaints**: File and track complaints
- **Rules**: View hostel rules and regulations

## 📝 Key Files Explanation

### `css/styles.css`
Complete styling including:
- Reset and base styles
- Layout utilities (flexbox, grid)
- Component styles (card, button, form, navbar)
- Responsive design
- Light/dark theme support with CSS variables

### `js/app.js`
Core functionality:
- **Authentication**: Login/logout functions
- **API Functions**: 
  - Dashboard data fetching
  - Student, room, notice, complaint, fees data
- **UI Helpers**: 
  - Error/success messages
  - Loading states
  - Date/currency formatting
- **Protection**: Route guards for authenticated pages

### HTML Pages
Each page includes:
- Navigation bar with logout
- Content sections
- Modal dialogs where needed
- Event listeners for user actions
- API integration via `app.js`

## 🔌 API Integration

All pages are configured to communicate with the backend API at:
```
http://localhost:5000
```

Endpoints used:
- `POST /api/login` - User authentication
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/students` - Student list
- `GET /api/admin/rooms` - Room list
- `GET /api/admin/notices` - Notice list
- `GET /api/admin/complaints` - Complaint list
- `GET /api/admin/fees` - Fees list
- `GET /api/student/{userId}` - Student profile
- `GET /api/student/latest-notice` - Latest notice
- `GET /api/student/latest-complaint/{userId}` - Latest complaint

## 🎯 Configuration

### Change API URL
Open `js/app.js` and modify:
```javascript
const API_URL = "http://localhost:5000";
```

### Customize Colors
Edit `css/styles.css` CSS variables:
```css
:root {
  --primary-color: #0070f3;
  --background: #ffffff;
  --foreground: #000000;
  /* ... more variables */
}
```

## ✨ Styling Guide

### Utility Classes
- Layout: `.flex`, `.flex-col`, `.grid`, `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4`
- Spacing: `.gap-2`, `.gap-4`, `.gap-6`, `.space-y-4`, `.space-y-6`
- Padding: `.p-4`, `.p-6`
- Margin: `.mb-2`, `.mb-4`, `.mb-6`, `.mt-2`, `.mt-4`, `.mt-6`
- Sizing: `.w-full`, `.max-w-md`, `.min-h-screen`
- Typography: `.text-center`, `.text-muted`, `.fw-bold`

### Components
- **Card**: `.card` - Main container component
- **Button**: `.button`, `.button-primary`, `.button-secondary`, `.button-danger`, `.button-success`
- **Form**: `.form-group` for grouping labels and inputs
- **Alert**: `.alert`, `.alert-error`, `.alert-success`, `.alert-warning`
- **Badge**: `.badge`, `.badge-primary`, `.badge-success`, `.badge-warning`, `.badge-danger`

## 🔐 Security Notes

⚠️ **Important**: This is a static HTML/CSS/JS application. Security considerations:

1. **Tokens**: In production, implement JWT or session-based authentication
2. **Data**: All API calls are in plain JavaScript - use HTTPS in production
3. **Local Storage**: User data is stored in browser localStorage (not secure)
4. **CORS**: Ensure backend allows CORS for API requests

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Desktop: Full layout with sidebar
- Tablet: Adjusted grid (2-column)
- Mobile: Single column, hidden sidebar, stacked navigation

## 🐛 Troubleshooting

### Page shows "Loading..." indefinitely
- Check if backend server is running on port 5000
- Check browser console for API errors (F12 > Console)
- Verify CORS is enabled on backend

### Login not working
- Ensure backend API is responding to `POST /api/login`
- Check network tab in DevTools (F12 > Network)
- Verify correct credentials for test accounts

### Styles not loading
- Clear browser cache (Ctrl+Shift+Del)
- Ensure `css/styles.css` path is correct
- Check browser console for CSS loading errors

## 🚀 Deployment

To deploy this static app:

1. **GitHub Pages**: Push to GitHub and enable Pages in repository settings
2. **Netlify**: Drag and drop the folder or connect GitHub repo
3. **Vercel**: Connect GitHub repo or upload folder
4. **Traditional Hosting**: Upload to any web server (Apache, Nginx, etc.)

### Before Deployment
1. Update API_URL in `js/app.js` to production backend
2. Enable HTTPS
3. Implement proper authentication tokens
4. Add error monitoring/logging

## 📚 Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/) - JavaScript & HTML/CSS reference
- [CSS Tricks](https://css-tricks.com/) - CSS tutorials and guides
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - API calls

## 📄 License

This project maintains the same license as the original React version.

---

**Last Updated**: February 18, 2026
**Version**: 1.0.0
