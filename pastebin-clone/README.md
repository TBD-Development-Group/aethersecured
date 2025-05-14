# SimplePaste - A Pastebin Clone

![SimplePaste Screenshot](./screenshot.png)

SimplePaste is a minimal, self-hosted pastebin clone that allows you to store and share text snippets with ease.

## Features

- 🚀 Create pastes with optional titles
- 📝 Syntax highlighting for multiple languages
- ⏳ Set expiration time for pastes (1-365 days)
- 📋 Copy paste URLs with one click
- 📱 Responsive design works on all devices
- 🔍 View your recent paste history
- 🗑️ Delete pastes when no longer needed

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pastebin-clone.git
   cd pastebin-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Deployment

### Option 1: Heroku

1. Create a Heroku account and install the CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create
   ```
4. Deploy your app:
   ```bash
   git push heroku main
   ```

### Option 2: Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy your app:
   ```bash
   vercel
   ```

### Option 3: Railway

1. Connect your GitHub repository to Railway
2. Select "New Project" and choose your repository
3. Railway will automatically detect and deploy your Node.js app

## Configuration

The application can be configured by modifying the following:

- **Frontend**: Edit files in the `public/` directory
- **Backend**: Modify `server/server.js` for API changes
- **Styling**: Adjust `public/style.css` for visual changes

## Technologies Used

- Frontend:
  - HTML5, CSS3, JavaScript
  - Responsive design with CSS Grid and Flexbox
- Backend:
  - Node.js with Express
  - In-memory storage (replace with database for production)

## Roadmap

- [ ] Add user authentication
- [ ] Implement database persistence
- [ ] Add password protection for pastes
- [ ] Include more syntax highlighting options
- [ ] Add API documentation

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

For support or questions, please open an issue on GitHub or contact the maintainer directly.

---

**Happy Pasting!** ✨
