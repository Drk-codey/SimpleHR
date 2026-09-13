You are a senior full-stack SaaS engineer, product designer, HRIS architect, database designer, and security engineer.
 
I want you to help me build a FREE, modern, lightweight HR management web application for a small company with fewer than 50 employees.
 
The application should be inspired by the workflow and usability of BambooHR, but it must be an ORIGINAL application with its own branding, UI, architecture, and implementation. Do not copy BambooHR's proprietary UI, source code, trademarks, or exact visual design.
 
PROJECT NAME:
SimpleHR
 
PROJECT GOAL:
Build a practical HR system that allows a small company to manage employees, leave, onboarding, attendance/basic employee information, documents, and HR tasks from one place.
 
IMPORTANT CONSTRAINT:
I have NO DEVELOPMENT BUDGET.
 
Therefore:
- Prefer open-source technologies.
- Prefer free tiers.
- Do not introduce paid APIs or services unless there is a completely free alternative.
- The application must be self-hostable.
- Avoid unnecessary infrastructure.
- Avoid services that require credit cards where possible.
- Build the application so I can run it locally for free.
- The architecture should allow deployment later using free/low-cost hosting without major rewriting.
 
TECH STACK
 
Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui or another free accessible component system
- React Router
- TanStack Query where useful
- React Hook Form
- Zod
- Lucide React icons
- Recharts for dashboards/charts
- date-fns for date handling
 
Backend:
Prefer:
- Supabase for PostgreSQL database, authentication, storage, and Row Level Security
 
If Supabase is not appropriate for a particular feature, explain why before introducing another service.
 
Database:
- PostgreSQL
- Proper relational schema
- Foreign keys
- indexes
- timestamps
- constraints
- soft deletion where appropriate
 
Authentication:
- Supabase Auth
- Email/password authentication
- Role-based access control
 
Testing:
- Vitest
- React Testing Library
- Playwright for important end-to-end flows
 
Development:
- VS Code
- Cursor
- Git
- GitHub
 
Do not use unnecessary libraries.
 
==================================================
1. USER ROLES
==================================================
 
The system should support:
 
1. Super Admin
2. HR/Admin
3. Manager
4. Employee
 
Permissions must be enforced both in the frontend and database.
 
Super Admin:
- Full access
- Manage users and roles
- Company settings
- Manage departments
- Manage job roles
- View all HR information
 
HR/Admin:
- Manage employees
- Manage leave
- Manage onboarding
- Manage HR tasks
- View reports
- Manage employee documents
 
Manager:
- View employees within their permitted scope
- Approve/reject leave requests
- View team information
- Manage assigned onboarding/tasks
- View team leave calendar
 
Employee:
- View own profile
- Edit permitted personal information
- Submit leave requests
- View leave history
- View assigned onboarding tasks
- View company documents made available to them
 
==================================================
2. CORE MODULES
==================================================
 
Build the following modules.
 
A. DASHBOARD
 
Create a clean HR dashboard containing:
 
- Total employees
- Active employees
- Employees on leave
- Pending leave requests
- Upcoming birthdays
- Upcoming work anniversaries
- New hires
- Outstanding onboarding tasks
- Recent HR activity
 
Use attractive but simple cards.
 
Include useful charts where appropriate.
 
The dashboard should not be overloaded.
 
==================================================
3. EMPLOYEE DIRECTORY
==================================================
 
Create an Employee Directory.
 
Features:
 
- List all employees
- Grid/card view
- Table view
- Search employees by:
  - name
  - email
  - role
  - department
- Filter by:
  - department
  - employment status
  - employment type
  - location
- Sort employees
- Pagination if necessary
 
Each employee card should display:
 
- Profile photo/avatar
- Full name
- Job title
- Department
- Location
- Employment status
- Email
- Phone where permitted
 
Clicking an employee opens their employee profile.
 
==================================================
4. EMPLOYEE PROFILE
==================================================
 
Create a detailed employee profile.
 
Sections:
 
PERSONAL INFORMATION
- First name
- Last name
- Preferred name
- Email
- Phone
- Date of birth
- Address
- Emergency contact
 
EMPLOYMENT INFORMATION
- Employee ID
- Job title
- Department
- Manager
- Employment type
- Employment status
- Start date
- End date if applicable
- Location
 
HR INFORMATION
- Leave balance
- Documents
- Onboarding status
- Notes
- Employment history
 
Do not expose sensitive information to users without permission.
 
Employees should only be able to edit fields they are authorized to edit.
 
==================================================
5. LEAVE MANAGEMENT
==================================================
 
Create a complete but simple Leave Management module.
 
Employees can:
 
- Submit leave requests
- Select leave type
- Select start date
- Select end date
- Enter reason
- Submit request
- Cancel eligible requests
- View leave history
- View leave status
 
Leave types should initially include:
 
- Annual Leave
- Sick Leave
- Personal Leave
- Maternity/Paternity Leave
- Compassionate Leave
- Other
 
HR/Admin can:
 
- Create/edit leave types
- Set default leave allowances
- Approve requests
- Reject requests
- Add comments
- Adjust employee leave balances
 
Managers can:
 
- Review leave requests from their team
- Approve/reject requests
 
Statuses:
 
- Pending
- Approved
- Rejected
- Cancelled
 
Use visual status indicators.
 
Create a Leave Calendar showing:
 
- Employee
- Leave type
- Start date
- End date
- Status
 
Include monthly calendar and list/table views.
 
Prevent invalid requests such as:
 
- End date before start date
- Missing required fields
- Requests exceeding available balance where company policy requires this
- Unauthorized approvals
 
==================================================
6. ONBOARDING
==================================================
 
Create an onboarding system.
 
HR/Admin can create onboarding templates.
 
Example:
 
NEW EMPLOYEE ONBOARDING
 
Day 1:
- Submit employee information
- HR orientation
- Company introduction
- Create email account
- Assign workstation
 
Week 1:
- Meet manager
- Meet team
- Complete company policies
- Complete role training
 
30 Days:
- First check-in
- Performance discussion
 
Tasks should contain:
 
- Task title
- Description
- Assigned person
- Due date
- Priority
- Status
- Completion date
 
Statuses:
 
- Not Started
- In Progress
- Completed
- Overdue
 
Allow tasks to be assigned to:
 
- HR
- Manager
- Employee
- Specific team member
 
Show onboarding progress as a percentage.
 
==================================================
7. HR TASK MANAGEMENT
==================================================
 
Create a simple task management system for HR.
 
HR can create tasks.
 
Fields:
 
- Title
- Description
- Assignee
- Employee related to task
- Due date
- Priority
- Status
 
Priorities:
 
- Low
- Medium
- High
- Urgent
 
Statuses:
 
- To Do
- In Progress
- Completed
- Cancelled
 
Create a task dashboard showing:
 
- My tasks
- Overdue
- Due today
- Upcoming
- Completed
 
==================================================
8. EMPLOYEE DOCUMENTS
==================================================
 
Create a document management system.
 
HR can upload documents associated with employees.
 
Examples:
 
- Employment contract
- Offer letter
- ID/document records
- Certificates
- HR forms
- Policy acknowledgements
 
Each document should contain:
 
- Document name
- Document type
- Employee
- Upload date
- Uploaded by
- File
- Visibility/access level
 
Use Supabase Storage.
 
Do not make documents publicly accessible.
 
Use secure access rules.
 
==================================================
9. DEPARTMENTS
==================================================
 
Create Department Management.
 
HR/Admin can:
 
- Create departments
- Edit departments
- Delete/deactivate departments
- Assign department heads
- View employees within departments
 
Example:
 
- Management
- Human Resources
- Finance
- Marketing
- Operations
- IT
- Sales
 
Do not hardcode these departments into the application.
 
They must be database records.
 
==================================================
10. JOB ROLES
==================================================
 
Create Job Role Management.
 
Fields:
 
- Job title
- Department
- Description
- Employment type
- Active/inactive
 
Allow employees to be assigned to job roles.
 
==================================================
11. EMPLOYMENT TYPES
==================================================
 
Support:
 
- Full Time
- Part Time
- Contract
- Intern
- Graduate Trainee
 
This should be configurable rather than hardcoded where practical.
 
==================================================
12. BASIC ATTENDANCE
==================================================
 
Do NOT build a complicated biometric attendance system.
 
For this small-company version, create a lightweight attendance module.
 
Employees can:
 
- Check in
- Check out
- View their attendance history
 
HR can:
 
- View attendance
- Filter by employee/date
- See late check-ins
- See missing check-outs
 
Keep this module simple.
 
Do not require expensive biometric hardware or third-party APIs.
 
==================================================
13. COMPANY CALENDAR
==================================================
 
Create a central HR calendar.
 
Display:
 
- Approved leave
- Upcoming employee birthdays
- Work anniversaries
- Onboarding deadlines
- HR tasks
- Company events
 
Allow filtering by event type.
 
==================================================
14. REPORTS
==================================================
 
Create simple HR reports.
 
Reports should include:
 
- Employee headcount
- Employees by department
- Employees by employment type
- Employees by employment status
- Leave utilization
- Pending leave
- Onboarding completion
- Attendance summary
 
Allow CSV export.
 
If practical, allow PDF export using a free/open-source library.
 
==================================================
15. ADMIN SETTINGS
==================================================
 
Create Settings.
 
Sections:
 
Company:
- Company name
- Logo
- Address
- Contact details
 
HR:
- Leave types
- Leave policies
- Employment types
- Departments
- Job roles
 
Users:
- User accounts
- Roles
- Permissions
 
System:
- Date format
- Timezone
- Notification settings
 
==================================================
16. NOTIFICATIONS
==================================================
 
Create an in-app notification system.
 
Examples:
 
- Leave request submitted
- Leave approved
- Leave rejected
- Task assigned
- Task approaching deadline
- Onboarding task completed
 
Do NOT depend on paid email/SMS APIs.
 
Build in-app notifications first.
 
If email notifications are added, make the email provider optional and use a free/self-hosted solution where possible.
 
==================================================
17. AUDIT LOG
==================================================
 
Create an audit log.
 
Track important actions:
 
- Employee created
- Employee updated
- Employee deleted/deactivated
- Leave submitted
- Leave approved
- Leave rejected
- Document uploaded
- User role changed
- Settings changed
 
Store:
 
- User
- Action
- Entity
- Entity ID
- Timestamp
- Relevant metadata
 
Only authorized administrators can view audit logs.
 
==================================================
18. DATABASE DESIGN
==================================================
 
Before writing application code:
 
Design the PostgreSQL database.
 
At minimum consider:
 
profiles
employees
departments
job_roles
employment_types
leave_types
leave_balances
leave_requests
onboarding_templates
onboarding_template_tasks
employee_onboarding
onboarding_tasks
hr_tasks
documents
attendance
calendar_events
notifications
audit_logs
company_settings
 
Use proper relationships.
 
Do not duplicate data unnecessarily.
 
Create SQL migrations.
 
Include seed data for development.
 
==================================================
19. SECURITY
==================================================
 
Security is extremely important.
 
Implement:
 
- Supabase authentication
- Row Level Security
- Role-based permissions
- Secure document storage
- Protected routes
- Input validation
- Zod validation
- Database constraints
- No secrets in frontend code
- Environment variables
- Proper error handling
 
Never expose Supabase service-role keys in the browser.
 
Employees must not be able to access another employee's private HR information simply by changing an ID in the URL.
 
Test the permission model.
 
==================================================
20. UI/UX DESIGN
==================================================
 
The application should look like a professional modern SaaS HR platform.
 
Design direction:
 
- Clean
- Minimal
- Professional
- Responsive
- Easy for non-technical HR staff
- Desktop-first but mobile responsive
- Excellent spacing
- Clear typography
- Subtle borders
- Soft shadows
- Accessible color contrast
- Consistent components
- Useful empty states
- Loading states
- Error states
- Confirmation dialogs
 
Avoid:
 
- Generic AI-looking interfaces
- Excessive gradients
- Excessive animations
- Purple AI dashboard aesthetics
- Clutter
- Unnecessary widgets
 
Use a simple professional HR SaaS visual language.
 
==================================================
21. NAVIGATION
==================================================
 
Create a sidebar navigation:
 
Dashboard
 
People
  - Employees
  - Departments
  - Job Roles
 
Leave
  - Leave Requests
  - Leave Calendar
  - Leave Balances
 
Onboarding
 
Tasks
 
Attendance
 
Calendar
 
Documents
 
Reports
 
Settings
 
The navigation should dynamically show options according to user permissions.
 
==================================================
22. RESPONSIVENESS
==================================================
 
The system must work on:
 
- Desktop
- Laptop
- Tablet
- Mobile
 
On mobile:
 
- Sidebar becomes a mobile navigation
- Tables become responsive
- Cards stack properly
- Modals fit the screen
- Forms remain usable
 
==================================================
23. EMPTY STATES
==================================================
 
Every module must have useful empty states.
 
Example:
 
"No employees yet"
 
"Add your first employee to start building your company directory."
 
Include an appropriate CTA.
 
Do not leave blank screens.
 
==================================================
24. DEMO DATA
==================================================
 
Create realistic seed/demo data for approximately 20 employees.
 
Use fictional names.
 
Include:
 
- Multiple departments
- Different job roles
- Different employment types
- Managers
- Employees
- Leave requests
- Onboarding tasks
- HR tasks
 
Make the demo environment immediately useful after installation.
 
==================================================
25. PROJECT STRUCTURE
==================================================
 
Use a clean scalable React architecture.
 
Example:
 
src/
  components/
  features/
    employees/
    leave/
    onboarding/
    tasks/
    attendance/
    documents/
    reports/
  layouts/
  pages/
  hooks/
  lib/
  services/
  types/
  utils/
  routes/
 
Organize code by feature where appropriate.
 
Avoid creating giant components.
 
==================================================
26. DEVELOPMENT APPROACH
==================================================
 
DO NOT attempt to build everything at once.
 
Build in phases.
 
PHASE 1:
- Project setup
- Tailwind
- shadcn/ui
- Routing
- Supabase connection
- Authentication
- Database schema
- Roles/permissions
- App shell
 
PHASE 2:
- Dashboard
- Employee directory
- Employee profiles
- Departments
- Job roles
 
PHASE 3:
- Leave management
- Leave balances
- Leave approval
- Leave calendar
 
PHASE 4:
- Onboarding
- HR tasks
- Notifications
 
PHASE 5:
- Documents
- Attendance
- Calendar
 
PHASE 6:
- Reports
- CSV export
- Audit logs
- Settings
 
PHASE 7:
- Testing
- Security review
- Performance optimization
- Accessibility
- Mobile responsiveness
- Production cleanup
 
After each phase:
 
1. Verify the application compiles.
2. Fix TypeScript errors.
3. Fix lint errors.
4. Test the functionality.
5. Review database security.
6. Do not move to the next phase until the current phase is stable.
 
==================================================
27. CURSOR INSTRUCTIONS
==================================================
 
When working inside Cursor:
 
- Inspect the existing project before changing files.
- Do not overwrite working code unnecessarily.
- Make small logical changes.
- Explain what files you intend to modify.
- Reuse existing components.
- Avoid duplicate components.
- Keep TypeScript strict.
- Do not use `any` unless absolutely necessary.
- Keep business logic out of presentation components where possible.
- Create reusable hooks/services.
- Keep database operations centralized.
- Never hardcode credentials.
- Never expose secrets.
 
When an error occurs:
 
1. Identify the root cause.
2. Explain it briefly.
3. Fix the root cause.
4. Verify the fix.
5. Check for regressions.
 
Do not simply suppress errors.
 
==================================================
28. CLAUDE INSTRUCTIONS
==================================================
 
When generating code:
 
- Give complete implementation-ready code.
- Clearly identify file paths.
- Do not provide fake placeholder implementations for core functionality.
- Do not omit important database policies.
- Do not invent APIs.
- Do not use paid services unless explicitly approved.
- Keep implementation beginner-friendly enough for me to understand and maintain.
 
If a requirement is technically ambiguous, choose the simplest reliable solution and explain the decision.
 
==================================================
29. FREE-FIRST ARCHITECTURE
==================================================
 
The application must prioritize zero-cost operation.
 
Recommended architecture:
 
Browser
   ↓
React + Vite + Tailwind
   ↓
Supabase
   ├── PostgreSQL
   ├── Auth
   ├── Storage
   └── Row Level Security
 
Use GitHub for source control.
 
The application should run locally using:
 
npm install
npm run dev
 
Provide clear setup instructions.
 
==================================================
30. ENVIRONMENT VARIABLES
==================================================
 
Create:
 
.env.example
 
Never commit:
 
.env
 
Use environment variables such as:
 
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
 
Explain exactly where I obtain these values.
 
==================================================
31. README
==================================================
 
Create a professional README containing:
 
- Project overview
- Features
- Tech stack
- Architecture
- Requirements
- Installation
- Environment variables
- Supabase setup
- Database migration
- Seed data
- Development commands
- Testing
- Build commands
- Deployment instructions
- Security notes
 
==================================================
32. FUTURE-READY ARCHITECTURE
==================================================
 
Do not build unnecessary enterprise features now.
 
However, structure the application so these can be added later:
 
- Performance management
- Recruitment/ATS
- Payroll integration
- Expense management
- Time-off policies
- Employee self-service
- Email notifications
- Slack/WhatsApp integrations
- Advanced analytics
- Performance reviews
- Training management
- Asset management
 
Do not implement these now unless required.
 
==================================================
33. IMPORTANT PRODUCT PRINCIPLE
==================================================
 
This is for a company with LESS THAN 50 EMPLOYEES.
 
Prioritize:
 
Simplicity > complexity
Reliability > number of features
Usability > technical sophistication
Free > paid
Security > convenience
Maintainability > clever code
 
The application should feel like a polished small-business HRIS rather than an enterprise ERP.
 
==================================================
34. FIRST TASK
==================================================
 
Do NOT immediately generate the entire application.
 
Start by producing:
 
1. Product architecture
2. Feature map
3. Recommended folder structure
4. Database ERD/schema
5. PostgreSQL tables
6. Role/permission matrix
7. Application routes
8. Supabase RLS strategy
9. Development phases
10. Free deployment strategy
 
Then wait for implementation instructions.
 
Once implementation begins, work one phase at a time and provide the exact files/code required.
 
The final result should be a genuinely usable HR application that I can run myself without paying for software licenses.