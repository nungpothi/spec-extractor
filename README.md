# Self-Service Kiosk Check-in System (Pastel Minimal Theme)

A UI prototype for self-service kiosk check-in using React 18, TypeScript, Zustand, and React Router DOM v6 with beautiful pastel minimal design.

🌐 **Live Demo**: https://self-service-kiosk.givemebug.online

## Features

- **Pastel Design**: Soft gradient backgrounds and gentle color palette
- **Streamlined Check-In**: Direct check-in from welcome page using National ID or Phone
- **Registration Flow**: New appointment booking with elegant form design
- **Queue Management**: Beautiful ticket printing interface with pastel styling
- **Mock API**: Uses static JSON responses for rapid prototyping
- **Production Ready**: Complete Docker deployment setup

## 🚀 Quick Deployment

```bash
# Build and deploy
make build push deploy

# Check status
make status

# View logs
make logs
```

**Result**: https://self-service-kiosk.givemebug.online

## Design Highlights

- **Background**: Soft gradient `linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)`
- **Buttons**: Pastel gradients like `linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)`
- **Typography**: Gentle colors (#3c3c3c for main text, #7b7b7b for secondary)
- **Shadows**: Subtle `0 6px 20px rgba(0,0,0,0.06)` for depth
- **Form Elements**: Inset shadows and 14px border-radius
- **Accent Color**: Mint green (#7bb8a8) for links and highlights
- **Visual Hierarchy**: Enhanced with pastel gradients throughout

## Color Palette

```css
Primary Background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)
Card Background: white with subtle shadow
Primary Button: linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)
Secondary Button: linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)
Success Elements: linear-gradient(90deg, #a8edea 0%, #d5f4e6 100%)
Text Primary: #3c3c3c
Text Secondary: #7b7b7b
Accent Links: #7bb8a8
```

## Project Structure

```
├── 📁 frontend/                    # React application
│   ├── src/pages/                 # UI components
│   ├── package.json               # Dependencies
│   └── dist/                      # Built output
├── 🐳 Dockerfile                  # Multi-stage build
├── 🔧 docker-compose.yml          # Container orchestration
├── ⚙️ Makefile                    # Deployment automation
├── 🌐 nginx.conf                  # Production web server
├── 📋 .env                        # Environment config
└── 📚 DEPLOYMENT.md               # Deployment guide
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker & Docker Compose (for deployment)
- Make (for automation)

### Development

1. **Local Development**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Local Build Test**:
   ```bash
   cd frontend
   npm run build
   ```

### Production Deployment

1. **Quick Deploy**:
   ```bash
   make pipeline  # build → push → deploy
   ```

2. **Step by Step**:
   ```bash
   make build     # Build Docker image
   make push      # Push to registry  
   make deploy    # Deploy container
   ```

3. **Monitor**:
   ```bash
   make status    # Check container status
   make logs      # View real-time logs
   ```

## API Endpoints (Mock Webhooks)

The application uses mock services that simulate these API endpoints:

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|---------|
| `/api/checkin` | GET | Check-in existing appointment | ✅ Mock |
| `/api/register` | POST | Register new appointment | ✅ Mock |
| `/api/available-slots` | GET | Get available time slots | ✅ Mock |
| `/api/print-queue` | POST | Print queue ticket | ✅ Mock |

## UI Flow

1. **Welcome Screen**: 
   - Soft gradient background
   - Input field with inset shadow for National ID/Phone Number
   - Pastel gradient "Check-in" button
   - Mint green link to registration

2. **Registration**: Form with pastel-styled inputs for personal details
3. **Appointment Selection**: Interactive date/time picker with soft gradients
4. **Confirmation**: Clean display with pastel info cards
5. **Print Queue**: Elegant ticket design with gradient styling

## Demo Data

For testing purposes, use:
- National ID: `1234567890123` (for check-in)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Build Tool**: Vite
- **Styling**: Pastel-themed CSS3 with responsive design
- **Deployment**: Docker + Nginx Alpine
- **Automation**: Makefile + GitLab CI/CD

## Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │───▶│  Docker Build   │───▶│  Nginx Alpine   │
│ (Vite + TS)     │    │   (Multi-stage) │    │   (Production)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                               ┌─────────────────┐
                                               │     Domain      │
                                               │  SSL + Proxy   │
                                               └─────────────────┘
```

## Container Features

- 🏥 **Health Checks**: Automated monitoring every 30s
- 📊 **Resource Limits**: 128MB RAM, 0.5 CPU max
- 🔄 **Auto-restart**: Always restart on failure
- 📝 **Logging**: JSON format with 10MB rotation
- 🛡️ **Security**: HTTP security headers via Nginx
- ⚡ **Performance**: Gzip compression, static caching

## Environment Configuration

```bash
# .env
DOMAIN=self-service-kiosk.givemebug.online
VITE_API_BASE_URL=http://spec-extractor-app-api.givemebug.online/api
REGISTRY=registry.gitlab.com/givemebug/self-service-kiosk
```

## Deployment Commands

| Command | Description |
|---------|-------------|
| `make build` | Build Docker image locally |
| `make push` | Push to GitLab registry |
| `make deploy` | Deploy/restart container |
| `make logs` | View real-time logs |
| `make status` | Check container health |
| `make pipeline` | Full build→push→deploy |
| `make clean` | Remove containers/images |

## Monitoring & Health

```bash
# Health check
curl https://self-service-kiosk.givemebug.online/health

# Container status
make status

# Application logs
make logs

# Resource usage
docker stats self-service-kiosk
```

## Development Notes

- All API calls are mocked with realistic delays
- Responsive design optimized for various screen sizes
- Error and success messages with themed styling
- TypeScript for enhanced developer experience
- Build optimization: ~6KB CSS, ~178KB JS
- Production-ready Docker setup with health checks

---

🎉 **Live Application**: https://self-service-kiosk.givemebug.online  
📚 **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)  
🐳 **Container Registry**: registry.gitlab.com/givemebug/self-service-kiosk
