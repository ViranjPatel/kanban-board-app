# Kanban Board Application

A modern, intuitive Kanban board built with React and styled with shadcn/ui components and Tailwind CSS.

## ✨ Features

- **🎯 Intuitive Drag & Drop**: Seamlessly move tasks between columns
- **🎨 Modern UI**: Clean interface built with shadcn/ui design system
- **📱 Fully Responsive**: Works perfectly on all devices
- **🏷️ Priority Management**: Set task priorities (Low, Medium, High) with visual indicators
- **💾 Persistent Storage**: Tasks saved to localStorage
- **🚀 Zero Build Process**: Works directly in the browser

## 🖼️ UI Features

- **Clean Header**: Modern navigation bar with dashboard icon
- **Smart Task Input**: 
  - Inline priority selection
  - Optional description field
  - One-click task creation
- **Visual Column States**:
  - To Do: Circle dashed icon (blue)
  - In Progress: Loader circle icon (amber)
  - Done: Check circle icon (green)
- **Task Cards**:
  - Priority badges with color coding
  - Creation date with calendar icon
  - Hover effects for better interaction
  - Quick delete button

## 🚀 Quick Start

### View Online
Your Kanban board is deployed at:
```
https://viranjpatel.github.io/kanban-board-app/
```

### Run Locally
```bash
git clone https://github.com/ViranjPatel/kanban-board-app.git
cd kanban-board-app
# Open index.html in your browser
```

## 💻 Technology Stack

- **React 18**: For reactive components
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component design system
- **Lucide Icons**: Beautiful icon set
- **LocalStorage**: Client-side persistence

## 🎯 Usage

1. **Add Tasks**: 
   - Enter task title
   - Add optional description
   - Select priority level
   - Click "Add Task"

2. **Manage Tasks**:
   - Drag tasks between columns
   - Click X to delete tasks
   - Tasks automatically save

3. **Priority Levels**:
   - 🟢 Low: Gray badge
   - 🔵 Medium: Blue badge (default)
   - 🔴 High: Red badge

## 🛠️ Customization

### Adding Columns
Edit the `columns` array in `app.js`:
```javascript
const columns = [
    { id: 'todo', title: 'To Do', icon: 'circle-dashed', color: 'text-blue-600' },
    { id: 'inprogress', title: 'In Progress', icon: 'loader-circle', color: 'text-amber-600' },
    { id: 'review', title: 'Review', icon: 'eye', color: 'text-purple-600' }, // New
    { id: 'done', title: 'Done', icon: 'check-circle-2', color: 'text-green-600' }
];
```

### Changing Theme
The app uses shadcn/ui's default theme. Customize colors in the Tailwind config within `index.html`.

## 📦 Project Structure

```
kanban-board-app/
├── index.html       # Main HTML with Tailwind config
├── app.js          # React application
├── styles.css      # Minimal custom styles
└── README.md       # Documentation
```

## 🌐 Deployment

The app automatically deploys to GitHub Pages via GitHub Actions on every push to main branch.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

Open source under the MIT License.

---

Built with ❤️ using React and shadcn/ui
