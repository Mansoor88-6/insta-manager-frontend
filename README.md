# Instagram Manager Frontend

Application that helps users manage their Instagram business/creator accounts by connecting through Facebook and enabling post management.

## Features

- Facebook Login Integration
- Instagram Business/Creator Account Connection
- Post Management
- User Authentication
- Secure Token Management

## Prerequisites

Before using this application, As per Meta's current requirements ensure you have:


1. An Instagram Business or Creator account
2. Your Instagram account must be connected to a Facebook Page 
## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/insta-manager-frontend.git
cd insta-manager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_API_URL=your_backend_api_url
```

4. Start the development server:
```bash
npm run dev
```

## Instagram Integration Requirements

For successful Instagram integration:

1. Your Instagram account must be either a Business or Creator account
2. The Instagram account must be connected to a Facebook Page
3. You must be an admin of the Facebook Page


## Common Issues


1. **Instagram Connection Failed**:
   - Verify your Instagram account is a Business/Creator account
   - Ensure it's properly connected to a Facebook Page
   - Check if you have admin access to the Facebook Page

## Development

Built with:
- React + TypeScript
- Vite
- Facebook SDK
- Supabase for authentication

