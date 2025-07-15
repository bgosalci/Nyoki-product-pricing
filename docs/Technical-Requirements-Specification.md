Nyoki Product Pricing Calculator
Version: 1.0
Date: July 2025
Author: Development Team
Document Type: Technical Requirements Specification


1. Executive Summary
The Nyoki Product Pricing Calculator is a web-based application designed to help artisans and small businesses calculate accurate product pricing by tracking all associated costs including materials, labor, overhead, shipping, and packaging. The application provides comprehensive cost analysis, profit margin calculations, and product catalog management with group organization capabilities.

2. Functional Requirements
2.1 Product Management
2.1.1 Product Creation

REQ-PROD-001: Users SHALL be able to create new products with the following attributes:

Product name (required, text, max 255 characters)
Product image (optional, image file, max 5MB, formats: JPG, PNG, GIF)
CDN image link (optional, valid URL)
Product group assignment (optional, dropdown selection)
Labor cost (decimal, £0.00 format, max £999,999.99)
Overhead cost (decimal, £0.00 format, max £999,999.99)
Post & shipping cost (decimal, £0.00 format, max £999,999.99)
Packaging cost (decimal, £0.00 format, max £999,999.99)



2.1.2 Product Editing

REQ-PROD-002: Users SHALL be able to edit all product attributes after creation
REQ-PROD-003: Product editing SHALL preserve existing data when fields are not modified
REQ-PROD-004: Product editing SHALL maintain product ID consistency
REQ-PROD-005: Users SHALL be able to cancel editing without saving changes

2.1.3 Product Deletion

REQ-PROD-006: Users SHALL be able to delete products with confirmation dialog
REQ-PROD-007: Product deletion SHALL be permanent and irreversible
REQ-PROD-008: System SHALL display confirmation with product name before deletion

2.1.4 Product Display

REQ-PROD-009: Products SHALL be displayed in a responsive grid layout
REQ-PROD-010: Each product card SHALL display:

Product image or placeholder
Product name
Complete cost breakdown
Total cost, retail price, profit, and margin
Materials list with individual costs
Edit and delete action buttons



2.2 Materials Management
2.2.1 Material Addition

REQ-MAT-001: Users SHALL be able to add multiple materials per product
REQ-MAT-002: Each material SHALL have:

Material name (required, text, max 255 characters)
Material cost (required, decimal, £0.00 format, positive values only)



2.2.2 Material Editing

REQ-MAT-003: Users SHALL be able to edit material names and costs inline
REQ-MAT-004: Material editing SHALL provide save and cancel options
REQ-MAT-005: Only one material SHALL be editable at a time

2.2.3 Material Deletion

REQ-MAT-006: Users SHALL be able to remove materials from products
REQ-MAT-007: Material removal SHALL update cost calculations immediately

2.3 Product Groups Management
2.3.1 Group Creation

REQ-GROUP-001: Users SHALL be able to create product groups with:

Group name (required, text, max 255 characters, unique)
Group description (optional, text, max 1000 characters)
Group color (required, color picker, hex format)



2.3.2 Group Management

REQ-GROUP-002: Users SHALL be able to edit group properties inline
REQ-GROUP-003: Users SHALL be able to delete groups
REQ-GROUP-004: Group deletion SHALL ungroup products but not delete them
REQ-GROUP-005: System SHALL warn users when deleting groups containing products

2.3.3 Group Assignment

REQ-GROUP-006: Products SHALL be assignable to groups via dropdown selection
REQ-GROUP-007: Products SHALL be able to exist without group assignment
REQ-GROUP-008: Group dropdown SHALL update dynamically when groups are added/removed

2.4 Pricing Calculations
2.4.1 Cost Calculation

REQ-CALC-001: System SHALL automatically calculate total product cost as:

Total Cost = Materials Cost + Labor Cost + Overhead Cost + Post & Shipping Cost + Packaging Cost



2.4.2 Pricing Methods

REQ-CALC-002: Users SHALL be able to set pricing using either:

Desired margin percentage (automatic retail price calculation)
Fixed retail price (automatic margin calculation)



2.4.3 Profit Analysis

REQ-CALC-003: System SHALL calculate and display:

Total profit (Retail Price - Total Cost)
Profit margin percentage ((Profit / Total Cost) × 100)



2.4.4 Real-time Updates

REQ-CALC-004: All calculations SHALL update in real-time as users input data
REQ-CALC-005: Cost breakdown SHALL be visible during product creation/editing

2.5 Product Filtering and Organization
2.5.1 Group-based Display

REQ-FILTER-001: Products SHALL be organized by groups in the display view
REQ-FILTER-002: Each group section SHALL show group name, color, and product count
REQ-FILTER-003: Ungrouped products SHALL be displayed in a separate section

2.5.2 Filtering Options

REQ-FILTER-004: Users SHALL be able to filter products by group
REQ-FILTER-005: "All Groups" option SHALL display all products
REQ-FILTER-006: Filtering SHALL be dynamic without page reload


3. Technical Requirements
3.1 Architecture
3.1.1 Frontend Technology

REQ-TECH-001: Application SHALL be built using vanilla JavaScript, HTML5, and CSS3
REQ-TECH-002: Application SHALL use closure pattern for data encapsulation
REQ-TECH-003: Application SHALL be a single-page application (SPA)

3.1.2 Code Structure

REQ-TECH-004: JavaScript SHALL use module pattern with closures
REQ-TECH-005: Private variables SHALL not be accessible outside their scope
REQ-TECH-006: Public methods SHALL be exposed through return object

3.1.3 Data Management

REQ-TECH-007: All data SHALL be stored in memory during session
REQ-TECH-008: localStorage integration SHALL be commented for external deployment
REQ-TECH-009: Data structures SHALL maintain referential integrity

3.2 Performance Requirements
3.2.1 Response Time

REQ-PERF-001: UI updates SHALL occur within 100ms of user input
REQ-PERF-002: Calculations SHALL complete instantly for up to 1000 products
REQ-PERF-003: Image uploads SHALL provide visual feedback during processing

3.2.2 Scalability

REQ-PERF-004: Application SHALL handle up to 10,000 products efficiently
REQ-PERF-005: Group filtering SHALL perform well with 100+ groups
REQ-PERF-006: Memory usage SHALL remain reasonable during extended sessions

3.3 Browser Compatibility
3.3.1 Supported Browsers

REQ-COMPAT-001: Application SHALL support:

Chrome 90+
Firefox 88+
Safari 14+
Edge 90+



3.3.2 Progressive Enhancement

REQ-COMPAT-002: Core functionality SHALL work without JavaScript enhancements
REQ-COMPAT-003: Application SHALL degrade gracefully on older browsers


4. User Interface Requirements
4.1 Design Standards
4.1.1 Visual Design

REQ-UI-001: Application SHALL follow Nyoki brand aesthetic:

Primary colors: #6b5b73, #8b7355
Background: #f5f1eb, #e8ddd4
Typography: Georgia serif font family
Border radius: 8-15px for cards and buttons



4.1.2 Layout Requirements

REQ-UI-002: Application SHALL use responsive grid layout
REQ-UI-003: Navigation SHALL be tab-based with three sections
REQ-UI-004: Forms SHALL be organized in logical groupings

4.2 Responsive Design
4.2.1 Mobile Compatibility

REQ-RESPONSIVE-001: Application SHALL be fully functional on devices ≥320px wide
REQ-RESPONSIVE-002: Navigation tabs SHALL stack vertically on mobile
REQ-RESPONSIVE-003: Product grid SHALL collapse to single column on mobile
REQ-RESPONSIVE-004: Forms SHALL maintain usability on small screens

4.2.2 Tablet and Desktop

REQ-RESPONSIVE-005: Two-column layout SHALL be used for tablet and desktop
REQ-RESPONSIVE-006: Product grid SHALL adjust column count based on screen width
REQ-RESPONSIVE-007: Maximum content width SHALL be 1200px

4.3 Accessibility
4.3.1 Keyboard Navigation

REQ-ACCESS-001: All interactive elements SHALL be keyboard accessible
REQ-ACCESS-002: Tab order SHALL be logical and intuitive
REQ-ACCESS-003: Focus indicators SHALL be clearly visible

4.3.2 Screen Reader Support

REQ-ACCESS-004: All images SHALL have appropriate alt text
REQ-ACCESS-005: Form labels SHALL be properly associated with inputs
REQ-ACCESS-006: Semantic HTML SHALL be used throughout


5. Data Requirements
5.1 Data Structures
5.1.1 Product Object
javascriptProduct {
  id: Number (unique, auto-increment)
  name: String (required, max 255 chars)
  groupId: Number (optional, foreign key to Group.id)
  image: String (optional, base64 data URL)
  materials: Array<Material>
  laborCost: Number (decimal, ≥0)
  overheadCost: Number (decimal, ≥0)
  postCost: Number (decimal, ≥0)
  packagingCost: Number (decimal, ≥0)
  totalCost: Number (calculated)
  retailPrice: Number (decimal, >0)
  margin: Number (calculated percentage)
  profit: Number (calculated)
}
5.1.2 Material Object
javascriptMaterial {
  name: String (required, max 255 chars)
  cost: Number (decimal, ≥0)
}
5.1.3 Group Object
javascriptGroup {
  id: Number (unique, auto-increment)
  name: String (required, max 255 chars, unique)
  description: String (optional, max 1000 chars)
  color: String (hex color code)
}
5.2 Data Validation
5.2.1 Input Validation

REQ-VALID-001: All required fields SHALL be validated before saving
REQ-VALID-002: Numeric fields SHALL accept only valid numbers
REQ-VALID-003: Negative costs SHALL be rejected
REQ-VALID-004: Duplicate group names SHALL be prevented

5.2.2 Data Integrity

REQ-VALID-005: Product-group relationships SHALL be maintained
REQ-VALID-006: Orphaned group references SHALL be handled gracefully
REQ-VALID-007: Data corruption SHALL be prevented through validation


6. Security Requirements
6.1 Input Security
6.1.1 XSS Prevention

REQ-SEC-001: All user input SHALL be sanitized before display
REQ-SEC-002: innerHTML usage SHALL be avoided for user content
REQ-SEC-003: File uploads SHALL be validated for type and size

6.1.2 Data Protection

REQ-SEC-004: No sensitive data SHALL be stored in the application
REQ-SEC-005: Local storage SHALL be used only for application data
REQ-SEC-006: User data SHALL remain client-side only


7. Error Handling Requirements
7.1 User Error Handling
7.1.1 Validation Errors

REQ-ERROR-001: Validation errors SHALL display clear, actionable messages
REQ-ERROR-002: Error messages SHALL appear near the relevant form field
REQ-ERROR-003: Users SHALL be able to correct errors without losing data

7.1.2 System Errors

REQ-ERROR-004: File upload errors SHALL be handled gracefully
REQ-ERROR-005: Calculation errors SHALL not crash the application
REQ-ERROR-006: Browser compatibility issues SHALL degrade gracefully


8. Deployment Requirements
8.1 Environment Support
8.1.1 Claude.ai Compatibility

REQ-DEPLOY-001: Application SHALL work in Claude.ai artifact environment
REQ-DEPLOY-002: localStorage features SHALL be commented for external use
REQ-DEPLOY-003: No external dependencies SHALL be required

8.1.2 External Deployment

REQ-DEPLOY-004: Application SHALL be deployable as single HTML file
REQ-DEPLOY-005: localStorage SHALL be easily activated for external deployment
REQ-DEPLOY-006: No server-side requirements SHALL be needed


9. Future Enhancement Requirements
9.1 Potential Features
9.1.1 Data Export

REQ-FUTURE-001: CSV export capability for products and costs
REQ-FUTURE-002: PDF report generation for pricing analysis
REQ-FUTURE-003: Backup and restore functionality

9.1.2 Advanced Features

REQ-FUTURE-004: Bulk pricing updates
REQ-FUTURE-005: Cost trend analysis
REQ-FUTURE-006: Multi-currency support
REQ-FUTURE-007: Template system for similar products

9.1.3 Integration Options

REQ-FUTURE-008: E-commerce platform integration
REQ-FUTURE-009: Accounting software export
REQ-FUTURE-010: Cloud storage synchronization


10. Testing Requirements
10.1 Functional Testing
10.1.1 Core Functionality

REQ-TEST-001: All CRUD operations SHALL be tested
REQ-TEST-002: Calculation accuracy SHALL be verified
REQ-TEST-003: Navigation functionality SHALL be tested
REQ-TEST-004: Data persistence SHALL be verified

10.1.2 Edge Cases

REQ-TEST-005: Maximum data limits SHALL be tested
REQ-TEST-006: Error conditions SHALL be tested
REQ-TEST-007: Browser compatibility SHALL be verified

10.2 User Acceptance Testing
10.2.1 Usability Testing

REQ-UAT-001: Real users SHALL test core workflows
REQ-UAT-002: Mobile usage patterns SHALL be tested
REQ-UAT-003: Business workflow SHALL be validated


11. Documentation Requirements
11.1 Technical Documentation
11.1.1 Code Documentation

REQ-DOC-001: All functions SHALL have JSDoc comments
REQ-DOC-002: Complex algorithms SHALL be documented
REQ-DOC-003: Data structures SHALL be clearly defined

11.1.2 User Documentation

REQ-DOC-004: User guide SHALL be provided
REQ-DOC-005: Feature descriptions SHALL be clear
REQ-DOC-006: Troubleshooting guide SHALL be included


12. Compliance and Standards
12.1 Web Standards
12.1.1 HTML/CSS Standards

REQ-STD-001: Valid HTML5 SHALL be used
REQ-STD-002: CSS3 standards SHALL be followed
REQ-STD-003: Progressive enhancement SHALL be implemented

12.1.2 JavaScript Standards

REQ-STD-004: ES6+ features SHALL be used appropriately
REQ-STD-005: Closure patterns SHALL be implemented correctly
REQ-STD-006: Error handling SHALL follow best practices


13. Maintenance Requirements
13.1 Code Maintenance
13.1.1 Code Quality

REQ-MAINT-001: Code SHALL be modular and maintainable
REQ-MAINT-002: Variable and function names SHALL be descriptive
REQ-MAINT-003: Code complexity SHALL be minimized

13.1.2 Update Procedures

REQ-MAINT-004: Feature additions SHALL not break existing functionality
REQ-MAINT-005: Data migration procedures SHALL be documented
REQ-MAINT-006: Version control best practices SHALL be followed


Appendices
Appendix A: Glossary

Closure: JavaScript function that has access to variables in its outer scope
Material: Raw material or component used in product creation
Margin: Percentage of profit relative to cost
Product Group: Category for organizing related products
SPA: Single Page Application

Appendix B: Assumptions

Users have basic computer literacy
Modern web browsers are used
Internet connection is available for initial loading
Business operates in GBP currency
Products are physical goods requiring materials

Appendix C: Constraints

No backend server available
Client-side only storage
File size limitations for images
Browser security restrictions
Single-user application (no multi-user support)

