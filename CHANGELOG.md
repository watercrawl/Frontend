# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-02-09

### Added
- New subscription and plan-related API endpoints
- Shared components for usage statistics and subscription management
- Enterprise mode flag in settings
- New team properties (is_default)
- Logo SVG files for dark and light modes

### Changed
- Improved API documentation with more detailed endpoint descriptions
- Refactored API services to use more consistent naming and implementation
- Updated usage charts with loading state and new grid layout
- Migrated from `tailwind.config.js` to `tailwind.config.mjs`
- Updated formatters and utility functions

### Refactored
- Consolidated API service files
- Simplified API call implementations
- Improved error handling and response parsing

## [0.2.0] - 2025-01-15

### Added
- New CrawlRequestDetailPage for detailed request tracking
- Shared components (ApiKeyCard, CrawlRequestCard, FormComponents)
- Pagination component for better data navigation
- StatusBadge component for visual status representation
- Table component for consistent data display
- useMediaQuery hook for responsive design
- New formatters utility for data formatting

### Changed
- Enhanced UI components and improved application performance
- Improved form handling in CrawlForm and PageOptionsForm
- Enhanced dark mode contrast in ResultModal
- Updated Google OAuth provider name to 'google-signin'
- Enhanced ActivityLog components for better user experience
- Improved dashboard layout and team selector functionality
- Enhanced JSON form components and widgets
- Improved API documentation display

### Fixed
- VITE_VERSION handling in Dockerfile, changed from ENV to ARG
- Various UI/UX improvements across multiple components
- Form validation and submission handling
- Error handling and user feedback improvements

### Technical
- Updated Docker configuration and build process
- Enhanced GitHub workflow configuration
- Updated dependencies and optimized package management
- Improved type definitions and API interfaces

## [0.1.0] - 2024-12-25

### Added
- JSON Schema based dynamic form generation
- Plugin system integration
- Playground interface for testing crawlers
- API client for plugins management

### Changed
- Refactored crawler form to use JSON Schema
- Improved dashboard layout and navigation
- Updated API specification
- Enhanced type definitions for crawler configurations

## [0.0.2] - 2024-12-19

### Added
- OAuth integration with Google and GitHub authentication
- Forgot and reset password functionality
- User profile management system
- Team invitation management interface
- Settings pages with team configuration
- Loading states and shared UI components
- Environment utilities for configuration management

### Changed
- Enhanced authentication flow with improved error handling
- Updated API services with new endpoints
- Improved form components with better validation
- Restructured dashboard layout for better navigation

## [0.0.1] - 2024-12-16

### Added
- Initial release of WaterCrawl Frontend
- Basic web crawling interface
- LLM-powered content extraction features
- Document processing and transformation capabilities
- Team management functionality
- Docker support for containerized deployment
- Responsive UI with Tailwind CSS
- JWT-based authentication system
- Team-based access control
- Real-time notifications system
- Data visualization components

### Security
- Implemented JWT token management
- Added team-based access control
- Secure API communication setup

### Infrastructure
- Docker containerization
- CI/CD pipeline setup
- Production deployment configurations

[0.0.1]: https://github.com/watercrawl/frontend/releases/tag/0.0.1
[0.0.2]: https://github.com/watercrawl/frontend/releases/tag/0.0.2
[0.1.0]: https://github.com/watercrawl/frontend/releases/tag/0.1.0
[0.2.0]: https://github.com/watercrawl/frontend/releases/tag/0.2.0
[0.3.0]: https://github.com/watercrawl/frontend/releases/tag/0.3.0
