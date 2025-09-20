# Student Productivity Hub

A comprehensive web application designed to boost student productivity with multiple tools and features.

## Features

### 🎯 Core Features
- **Day Planner**: Organize daily tasks with priority levels and time management
- **Water Reminder**: Stay hydrated with smart notifications and ringtone alerts
- **Study Library**: Access free programming books and educational resources
- **Focus Mode**: Concentrate with ambient sounds and productivity music
- **Gaming Zone**: Relax with fun games (Bubble Typing, Chess, Word Scramble, Flip Match)
- **AI Tools**: Access powerful AI tools for learning and productivity

### 🎨 UI/UX Features
- **Dark/Light Theme Toggle**: Switch between themes for comfortable viewing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Animated Cards**: Beautiful hover effects and transitions
- **Back Navigation**: Easy navigation between sections

### 🔐 Authentication
- **User Registration**: Create accounts with email and password
- **User Login**: Secure authentication system
- **Session Management**: Persistent login sessions

### 🗄️ Database Integration
- **MySQL Database**: Full database integration with XAMPP
- **User Data Storage**: Store user information, tasks, and progress
- **Progress Tracking**: Track water intake, focus sessions, and study progress

## Setup Instructions

### Prerequisites
- XAMPP (Apache + MySQL + PHP)
- Modern web browser
- Internet connection (for external resources)

### Installation Steps

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Database Setup**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database or import the provided SQL file
   - Run the `database_setup.sql` file to create tables and sample data

3. **File Setup**
   - Place all files in your XAMPP htdocs folder
   - Structure should be:
   ```
   htdocs/
   ├── student_productivity/
   │   ├── index.html
   │   ├── styles.css
   │   ├── script.js
   │   ├── api/
   │   │   ├── config.php
   │   │   ├── auth.php
   │   │   ├── tasks.php
   │   │   ├── water.php
   │   │   └── focus.php
   │   └── database_setup.sql
   ```

4. **Access the Application**
   - Open your browser
   - Navigate to: `http://localhost/student_productivity/`

### Database Configuration

The application uses the following database structure:

#### Tables
- **users**: Store user account information
- **tasks**: Store user tasks and to-do items
- **water_tracking**: Track water intake and reminders
- **focus_sessions**: Record focus mode sessions
- **study_progress**: Track study progress and book reading
- **game_scores**: Store game scores and achievements

#### Sample Data
The database setup includes sample users and data for testing:
- Test users with email/password combinations
- Sample tasks and focus sessions
- Water tracking data
- Study progress records

## Usage Guide

### Getting Started
1. **Sign Up**: Create a new account using the Sign Up button
2. **Login**: Use your credentials to access the dashboard
3. **Explore Features**: Navigate through different sections using the main dashboard

### Day Planner
- Add tasks with titles, descriptions, and time slots
- Set priority levels (Low, Medium, High)
- Mark tasks as complete
- Delete tasks when no longer needed

### Water Reminder
- Set reminder intervals (15-180 minutes)
- Track daily water intake
- View statistics and progress
- Receive browser notifications

### Study Library
- Browse free programming books
- Access online resources
- Track reading progress
- Download books (when available)

### Focus Mode
- Set focus sessions (5-120 minutes)
- Choose ambient sounds (Rain, Forest, Ocean, Cafe)
- Track focus session history
- Monitor productivity

### Gaming Zone
- Play Bubble Typing to improve typing speed
- Challenge yourself with Chess
- Solve Word Scramble puzzles
- Test memory with Flip Match

### AI Tools
- Access popular AI tools like ChatGPT, GitHub Copilot
- Explore coding assistants and productivity tools
- Get direct links to AI resources

## Technical Details

### Frontend
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Advanced styling with Flexbox/Grid, animations, and responsive design
- **JavaScript**: ES6+ features, localStorage, notifications API
- **Font Awesome**: Icons and visual elements

### Backend
- **PHP**: Server-side logic and database operations
- **MySQL**: Database management and data storage
- **PDO**: Secure database connections and prepared statements
- **RESTful API**: Clean API endpoints for frontend communication

### Security Features
- Password hashing with PHP's password_hash()
- SQL injection prevention with prepared statements
- Session management for user authentication
- Input validation and sanitization

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Future Enhancements

- Real-time notifications
- Mobile app development
- Advanced analytics and reporting
- Social features and sharing
- Integration with calendar apps
- Advanced game features
- Machine learning recommendations

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running in XAMPP
   - Check database credentials in `api/config.php`
   - Verify database exists and tables are created

2. **API Endpoints Not Working**
   - Check Apache is running in XAMPP
   - Verify file paths are correct
   - Check browser console for errors

3. **Notifications Not Working**
   - Ensure browser notifications are enabled
   - Check browser permissions for the site
   - Use HTTPS for production deployment

4. **Theme Not Persisting**
   - Check localStorage in browser developer tools
   - Clear browser cache and try again

## Support

For technical support or feature requests, please check the browser console for error messages and ensure all prerequisites are properly installed.

## License

This project is open source and available under the MIT License.
