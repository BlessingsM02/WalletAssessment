# 💰 Digital Wallet

A secure and user-friendly finance application for wallet management and transaction tracking.

# 🛠 Technologies Used
- **Frontend**: React, TypeScript, Material-UI
- **Backend**: ASP.NET Core, C#
- **Database**: SQL Server

# ✨ Main Features
- **Secure Authentication System**
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

# Database Design Documentation

## 🗃️ Database Choice: SQL Server
**Why SQL Server?**
1. **Native .NET Integration**  
   - First-class support for ASP.NET Core applications
   - Seamless Entity Framework Core integration
   - LINQ query compatibility

2. **ACID Compliance**  
   - Critical for financial transactions
   - Guaranteed data integrity
   - Transaction rollback capabilities

3. **Enterprise-Grade Features**
   - Built-in encryption at rest
   - Row-level security
   - Temporal tables for historical tracking

4. **Scalability**
   - Handles high transaction volumes
   - Supports vertical and horizontal scaling
   - Optimized for OLTP workloads

## 🗄️ Schema Design Decisions

### 1. User Entity
```sql
CREATE TABLE Users (
    Id NVARCHAR(450) PRIMARY KEY,
    Eame NVARCHAR(256),
    Email NVARCHAR(256),
    PasswordHash NVARCHAR(MAX),
    SecurityStamp NVARCHAR(MAX),
    ConcurrencyStamp NVARCHAR(MAX),
    LockoutEnd DATETIMEOFFSET,
    LockoutEnabled BIT,
    AccessFailedCount INT
);
```
**Rationale**:
- Inherits from ASP.NET Core Identity schema
- GUID primary key for security
- Indexed email for fast lookups
- Lockout mechanisms for security

### 2. Wallet Entity
```sql
CREATE TABLE Wallets (
    Id INT PRIMARY KEY IDENTITY,
    UserId NVARCHAR(450) FOREIGN KEY REFERENCES Users(Id),
    Balance DECIMAL(18,2) NOT NULL,
    [RowVersion] ROWVERSION
);
```
**Optimizations**:
- `DECIMAL(18,2)` for precise currency handling
- Row versioning for concurrency control
- Automatic timestamp tracking
- Index on UserId for fast balance queries

### 3. Transaction Entity
```sql
CREATE TABLE Transactions (
    Id INT PRIMARY KEY IDENTITY,
    WalletId INT FOREIGN KEY REFERENCES Wallets(Id),
    RecipientWalletId INT FOREIGN KEY REFERENCES Wallets(Id),
    Amount DECIMAL(18,2) NOT NULL,
    TransactionType NVARCHAR(15) NOT NULL,
    Description NVARCHAR(100),
    [Hash] VARBINARY(64) -- Cryptographic audit trail
);
```


## 📄 License
MIT License - See `LICENSE` for details

**Note**: Replace placeholder values (`yourusername`, connection strings, secrets) with your actual project values before running.
