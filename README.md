# Khaled El Gammal Front End

Front-end for Khaled El Gammal platform, built with **Next.js 15**, **React 19**, and **Redux Toolkit**.  
This project is the client-side for the Khaled El Gammal e-commerce/artisan platform, supporting user/admin authentication, product browsing, gallery, business/contact/customize forms, and more.

---

## 🚀 Features

- **Modern Next.js 15 App Router**
- **Redux Toolkit & RTK Query** for state management and API calls
- **User & Admin Authentication** (JWT, cookies)
- **Dynamic Product & Gallery Display**
- **Business, Contact, and Customize Forms** (with validation & file upload)
- **Responsive UI** with Tailwind CSS
- **Toast Notifications** for user feedback
- **Image Optimization** (Next.js Image)
- **Loading & Error Handling**
- **Clean, Modular Code Structure**

---

## 📁 Project Structure

```
.
├── public/                  # Static assets (images, icons, etc.)
├── src/
│   └── app/
│       ├── components/      # Reusable UI components (Nav1, Footer, Form, etc.)
│       ├── features/Api/    # RTK Query API slices (AuthApi, galleryApi, etc.)
│       ├── redux/           # Redux store and slices
│       ├── pages/           # App pages (Gallery, login, signUp, etc.)
│       └── utils/           # Utility functions (token handling, etc.)
├── .env                     # Environment variables
├── next.config.mjs          # Next.js config (image domains, etc.)
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

أنشئ ملف `.env` في الجذر:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🛠️ Installation & Run

```bash
git clone https://github.com/Abdallah-Wael10/khaled-El-gammal-Front-end-v1.git
cd khaled-El-gammal-Front-end-v1
npm install
npm run dev
```

- The app runs on `http://localhost:3000` by default.

---

## 🧩 Main Features

- **Home Page:** Introduction, trending products, gallery slider, contact form.
- **Gallery:** SSR + CSR gallery display with modal view.
- **Products:** Dynamic product cards, add to cart, checkout.
- **Forms:** Business, Contact, and Customize forms with validation and file/image upload.
- **Authentication:** User & Admin login/register, token stored in cookies.
- **Admin Dashboard:** Protected routes for admin management.
- **Notifications:** User feedback via react-hot-toast.

---

## 🔒 Authentication

- JWT tokens are stored in cookies using `js-cookie`.
- Protected routes check for token presence and validity.

---

## 🖼️ Image Handling

- Uses Next.js `<Image />` for optimized images.
- Supports remote images from backend (`localhost:5000`).

---

## 📝 Validation

- All forms have client-side validation for required fields, email, phone, etc.
- Error messages are shown inline and via toast.

---

## 📦 Dependencies

- **Next.js 15**
- **React 19**
- **Redux Toolkit**
- **React Redux**
- **RTK Query**
- **js-cookie**
- **react-hot-toast**
- **Tailwind CSS**
- **Swiper** (for sliders)

---

## 👨‍💻 Author

- [Abdallah Wael](https://github.com/Abdallah-Wael10)

---

## 📝 License

This project is licensed under the MIT License.

---

**Feel free to fork, contribute, or open issues!**
