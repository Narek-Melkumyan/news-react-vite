# NewsDesk Admin Dashboard

NewsDesk is a full-stack admin dashboard for managing a news website.

The project includes admin authentication, protected routes, article management, category management, image uploads with Cloudflare R2, AI-powered SEO autofill using the ChatGPT API, dashboard statistics, and a clean responsive admin interface.

## Repository

```bash
https://github.com/Narek-Melkumyan/news-react-vite
```

## Features

* Admin registration
* Admin login
* Admin logout
* Protected admin routes
* Cookie-based authentication
* Dashboard statistics
* Total articles count
* Total views count
* Weekly views count
* Articles table
* Search articles
* Filter articles by status
* Filter articles by category
* Create new articles
* Edit existing articles
* Delete articles
* Upload article cover images
* Store article images in Cloudflare R2
* Save uploaded image URLs in MySQL
* AI-powered SEO autofill using ChatGPT API
* Auto-generate SEO title
* Auto-generate SEO description
* Auto-generate SEO keywords
* Auto-generate slug suggestions
* Category management
* Users and authors section
* Responsive sidebar
* Dynamic logged-in username in header/sidebar
* Bootstrap and Bootstrap Icons UI

## Tech Stack

### Frontend

* React
* Vite
* React Router DOM
* Bootstrap
* Bootstrap Icons
* CSS
* FormData for image uploads

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* bcrypt
* Cookie Parser
* CORS
* Multer
* Cloudflare R2
* AWS S3 SDK
* ChatGPT API / OpenAI API

## Project Structure

```bash
news-react-vite/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── articles/
│   │   │   ├── Header.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── SideBar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ViewsChart.jsx
│   │   │   └── RecentActivity.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── layouts/
│   │   │   ├── dashboard.jsx
│   │   │   ├── articles.jsx
│   │   │   ├── categories.jsx
│   │   │   ├── polls.jsx
│   │   │   ├── users.jsx
│   │   │   └── loginPage.jsx
│   │   │
│   │   ├── middleware/
│   │   │   └── RequireAdmin.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── App.css
│   │
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── controller/
│   │   ├── authController.js
│   │   ├── articleController.js
│   │   └── categoryController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── articleRoutes.js
│   │   └── categoryRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── r2.js
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
```

## Frontend Routes

```bash
/login
/admin
/admin/dashboard
/admin/articles
/admin/createArticle
/admin/editArticle/:id
/admin/categories
/admin/polls
/admin/users
```

## API Routes

### Auth Routes

```bash
POST /admin/auth/register
POST /admin/auth/login
POST /admin/auth/logout
GET  /admin/auth/me
```

### Article Routes

```bash
GET    /admin/articles
POST   /admin/articles
GET    /admin/articles/getAuthors
GET    /admin/articles/getSlugs
GET    /admin/articles/:id
PUT    /admin/articles/:id
DELETE /admin/articles/:id
```

### Category Routes

```bash
GET    /admin/categories
POST   /admin/categories
PUT    /admin/categories/:id
DELETE /admin/categories/:id
```

## Environment Variables

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3010/admin
```

### Backend `.env`

```env
PORT=3010

JWT_SECRET=your_jwt_secret

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name

R2_ENDPOINT=your_cloudflare_r2_endpoint
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_URL=your_r2_public_url

OPENAI_API_KEY=your_openai_api_key
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Narek-Melkumyan/news-react-vite.git
cd news-react-vite
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

## Run the Project

### Start backend

```bash
cd backend
npm run dev
```

Backend will run on:

```bash
http://localhost:3010
```

### Start frontend

```bash
cd frontend
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

## Authentication

This project uses JWT authentication stored in an HTTP-only cookie.

When an admin logs in, the backend creates a JWT token and stores it inside a cookie. Protected backend routes use middleware to check the cookie and verify the logged-in user.

Protected frontend requests must include:

```js
credentials: "include"
```

Example:

```js
const res = await fetch(`${API_URL}/articles`, {
    credentials: "include",
});
```

## Protected Routes

Admin pages are protected with `RequireAdmin`.

If the user is not logged in, the user is redirected to the login page.

Example protected frontend routes:

```bash
/admin/dashboard
/admin/articles
/admin/categories
/admin/users
```

## Dashboard

The dashboard shows important newsroom statistics.

Dashboard includes:

* Total articles
* Total views
* Views this week
* Views chart
* Recent activity
* Dynamic greeting with the logged-in admin name

The dashboard gets article data from the backend and calculates totals on the frontend.

## Article Management

Admins can manage articles from the admin dashboard.

Article features include:

* View all articles
* Search articles by title or author
* Filter articles by status
* Filter articles by category
* Create new articles
* Edit existing articles
* Delete articles
* Upload cover images
* Mark articles as featured
* Mark articles as breaking news
* Add SEO fields
* Use AI to generate SEO data

## Article Creation

Admins can create articles with:

* Title
* Slug
* Short description
* Body content
* Category
* Author
* Status
* Featured option
* Breaking news option
* Cover image
* SEO title
* SEO description
* SEO keywords

## Cloudflare R2 Image Upload

This project uses Cloudflare R2 to store article images.

When an admin creates a new article, the selected cover image is sent from the frontend to the backend using `FormData`.

The backend receives the file with Multer, uploads the image to Cloudflare R2, gets the public image URL, and saves that URL in the MySQL database with the article.

### Image Upload Flow

```bash
Admin selects image
        ↓
Frontend sends FormData to backend
        ↓
Backend receives image with Multer
        ↓
Backend uploads image to Cloudflare R2
        ↓
Cloudflare R2 stores the image
        ↓
Backend saves image URL in MySQL
        ↓
Article displays image from Cloudflare R2 URL
```

Example image URL saved in database:

```js
image: "https://your-r2-public-url.com/articles/image-name.jpg"
```

## AI SEO Autofill

The Add Article page uses the ChatGPT API to autofill SEO fields.

When creating an article, the admin can write the article title, short description, category, or body content, then use AI to generate SEO data automatically.

AI can generate:

* SEO title
* SEO description
* SEO keywords
* Slug suggestion
* Short summary

This saves time and helps improve article search visibility.

### AI SEO Flow

```bash
Admin writes article title/body
        ↓
Admin clicks AI SEO button
        ↓
Frontend sends article data to backend
        ↓
Backend calls ChatGPT API
        ↓
ChatGPT returns SEO suggestions
        ↓
Frontend fills SEO fields automatically
```


## Dynamic User Info

The admin dashboard shows the logged-in user’s name and role.

The frontend gets the current user with:

```js
const res = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
});
```

The backend returns:

```json
{
  "user": {
    "id": 1,
    "name": "Narek Melkumyan",
    "email": "narek@example.com",
    "role": "admin"
  }
}
```

The frontend uses this data in the header, sidebar footer, and dashboard greeting.

## Common Issues

### 401 Unauthorized

This usually means the cookie/token is not being sent to the backend.

Fix protected fetch requests by adding:

```js
credentials: "include"
```

Also check backend CORS:

```js
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
```

### 404 Not Found

This means the route does not exist or the URL is wrong.

Check frontend `.env`:

```env
VITE_API_URL=http://localhost:3010/admin
```

Check backend route mounting:

```js
app.use("/admin/auth", authRoutes);
app.use("/admin/articles", articleRoutes);
app.use("/admin/categories", categoryRoutes);
```

### Cookie Not Saving

Make sure the backend cookie settings match your development environment.

Example local cookie setup:

```js
res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
});
```



The browser must set it automatically.

Correct:

```js
const response = await fetch(`${API_URL}/articles`, {
    method: "POST",
    credentials: "include",
    body: formData,
});
```

## Notes

* Make sure the backend server is running before using the frontend.
* Make sure the frontend `.env` file has the correct API URL.
* Restart the frontend server after changing `.env`.
* Use `credentials: "include"` for all protected API requests.
* Make sure backend CORS allows credentials.
* Make sure Cloudflare R2 credentials are correct.
* Keep API keys private and never upload `.env` files to GitHub.

## Future Improvements

* Add comments management
* Add pagination for articles
* Add role-based permissions
* Add image preview before upload
* Add article analytics
* Add real recent activity from database
* Add dark/light theme persistence
* Add better error messages
* Add loading states
* Add user profile settings

## Author

Created by Narek Melkumyan.
