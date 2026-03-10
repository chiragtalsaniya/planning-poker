# Planning Poker Web App

A modern, mobile-responsive Planning Poker application for Agile ceremonies built with Angular, Node.js, Socket.IO, and Tailwind CSS.

## 🚀 Live Demo

- **Frontend**: [GitHub Pages URL will be here]
- **Backend**: [Render/Railway URL will be here]

## ✨ Features

- **Real-time voting**: All participants see updates instantly
- **Role-based access**: Admin and Participant roles
- **Private voting**: Votes remain hidden until admin reveals them
- **Reveal tracking**: Shows who revealed the votes with a visual indicator
- **Vote statistics**: Average, highest, lowest, and vote distribution
- **Visual grouping**: Highlights matching votes with color coding
- **Mobile responsive**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean card-based design with branded colors

## 🛠️ Tech Stack

- **Frontend**: Angular 17 (standalone components)
- **Backend**: Node.js + Express
- **Real-time**: Socket.IO
- **Styling**: Tailwind CSS
- **Storage**: In-memory (easily upgradeable to database)

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:4200`

## 📱 Usage

1. **Start both servers** (backend on port 3000, frontend on port 4200)
2. **Join a room**: Enter your name, room ID, and select your role
3. **Vote**: Select estimation cards during planning sessions
4. **Reveal**: Admin can reveal votes to see results and statistics

## 🎯 Fibonacci Cards

- Numbers: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
- Special: ?, ∞, ☕ (Coffee break)

## 🚀 Deployment

### Frontend (GitHub Pages)
- Automatically deployed via GitHub Actions
- Available at: `https://chiragtalsaniya.github.io/planning-poker`

### Backend (Render/Railway)
- Deploy backend to cloud platform
- Update frontend API endpoints

## 👨‍💻 Developer

**Chirag Talsaniya**
- GitHub: [chiragtalsaniya](https://github.com/chiragtalsaniya)
- Email: chirag.talsaniya20@gmail.com

## 📄 License

MIT License - feel free to use this project for your team's planning sessions!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ for better sprint planning