# 💰 Digital Wallet

A secure and user-friendly finance application for wallet management and transaction tracking.

# 🛠 Technologies Used
- **Frontend**: React, TypeScript, Material-UI
- **Backend**: ASP.NET Core, C#
- **Database**: Microsoft SQL Server
- **Authentication**: JWT, ASP.NET Core Identity

# ✨ Main Features
**Secure Authentication System**
  - JWT-based login/registration
  **Wallet Management**
  - Real-time balance tracking
  - Peer-to-peer transfers
- **Transaction Tracking**
  - Transaction history with pagination
  - Detailed transaction records
- **User Profile**
  - Account details view
  - Secure logout
- **Responsive UI**
  - User-friendly design
  - Consistent theming

## 🚀 Setup Process

### Prerequisites
- Node.js v16+
- .NET 6 SDK
- Microsoft SQL Server
- Yarn/NPM

### Backend Setup
1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/WalletAssessment.git
   cd WalletAssessment.Server
   ```
2. **Database Configuration**
   Update connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "Default": "Your_SQL_Server_Connection_String"
   }
   ```
3. **Restore Packages**
   ```bash
   dotnet restore
   ```
4. **Run Migrations**
   ```bash
   dotnet ef database update
   ```
5. **Start Server**
   ```bash
   dotnet run
   ```

### Frontend Setup
1. **Navigate to Client Directory**
   ```bash
   cd WalletAssessment.Client
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Client**
   ```bash
   npm run dev
   ```

## 🔧 Environment Configuration

### Backend (`appsettings.json`)
```json
{
  "Jwt": {
    "Key": "Your_256-bit_Secret_Key",
    "Issuer": "*",
    "Audience": "*"
  },
  "ConnectionStrings": {
    "Default": "Your_SQL_Server_Connection_String"
  }
}
```



## 📚 API Documentation
Access Swagger UI after starting the backend:
```
http://localhost:7191/swagger/index.html
```
## 📄 License
MIT License - See `LICENSE` for details

**Note**: Replace placeholder values (`yourusername`, connection strings, secrets) with your actual project values before running.
