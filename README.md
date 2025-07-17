# Kanban Board Application

A modern, responsive Kanban board application built with React that helps you manage tasks efficiently.

## Features

- **Drag and Drop**: Easily move tasks between columns (To Do, In Progress, Done)
- **Task Management**: Add, delete, and organize tasks
- **Priority Levels**: Set and toggle between Low, Medium, and High priorities
- **Persistent Storage**: Tasks are saved to localStorage
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Clean UI**: Modern, minimalist interface with smooth animations

## Getting Started

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/ViranjPatel/kanban-board-app.git
   cd kanban-board-app
   ```

2. Open `index.html` in your web browser
   - No build process required!
   - Works directly in the browser

### Deployment Options

#### GitHub Pages
1. Go to Settings → Pages in your repository
2. Select "Deploy from a branch"
3. Choose `main` branch and `/ (root)` folder
4. Save and wait for deployment

#### Netlify
1. Visit [Netlify](https://www.netlify.com/)
2. Drag and drop the project folder
3. Your app will be live instantly!

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

## Usage

### Adding Tasks
1. Enter a task title in the first input field
2. Optionally add a description
3. Click "Add Task" or press Enter

### Managing Tasks
- **Move tasks**: Drag and drop between columns
- **Change priority**: Click on the priority badge
- **Delete tasks**: Click the × button on the task card

### Task Priorities
- 🟢 **Low**: Green badge
- 🟡 **Medium**: Yellow badge (default)
- 🔴 **High**: Red badge

## Technology Stack

- **React 18**: For reactive UI components
- **Pure CSS**: For styling (no frameworks needed)
- **LocalStorage**: For data persistence
- **Babel**: For JSX transformation in the browser

## Project Structure

```
kanban-board-app/
├── index.html       # Main HTML file
├── app.js          # React application code
├── styles.css      # All styling
└── README.md       # This file
```

## Customization

### Adding More Columns
Edit the `columns` array in `app.js`:
```javascript
const columns = [
    { id: 'todo', title: 'To Do', color: '#3498db' },
    { id: 'inprogress', title: 'In Progress', color: '#f39c12' },
    { id: 'testing', title: 'Testing', color: '#9b59b6' }, // New column
    { id: 'done', title: 'Done', color: '#27ae60' }
];
```

### Changing Colors
Modify the color values in `styles.css` for different themes.

### Adding Features
Some ideas for enhancements:
- Due dates for tasks
- Task assignments
- Labels/tags
- Search functionality
- Export/import tasks

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with React
- Inspired by Trello and other Kanban tools
- Created for learning and productivity

---

Made with ❤️ by ViranjPatel