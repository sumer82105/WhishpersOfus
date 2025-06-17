# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for the Whispers of Us backend.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account or log in if you already have one

## Step 2: Create a Cluster

1. Click **"Build a Database"** or **"Create"** button
2. Choose **"Shared"** (free tier)
3. Select your preferred cloud provider and region
4. Click **"Create Cluster"**
5. Wait for the cluster to be created (usually takes 1-3 minutes)

## Step 3: Create a Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter a username and password (save these for later!)
5. Under **"Database User Privileges"**, select **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (or add your specific IP)
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Java"** and **"4.3 or later"** driver version
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure Your Application

1. Copy `application-sample.properties` to `application.properties`
2. Replace the MongoDB configuration with your actual values:
   ```properties
   # Replace these with your actual values
   spring.data.mongodb.uri=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER_URL/whispers_of_us?retryWrites=true&w=majority
   spring.data.mongodb.database=whispers_of_us
   ```

### Example Configuration:
```properties
# If your connection string is:
# mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/

# Then your configuration should be:
spring.data.mongodb.uri=mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/whispers_of_us?retryWrites=true&w=majority
spring.data.mongodb.database=whispers_of_us
```

## Step 7: Test Your Connection

1. Start your Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
2. Check the logs for successful MongoDB connection
3. You should see logs like: `Connected to MongoDB Atlas successfully`

## Database Collections

The following collections will be automatically created when you use the application:
- `users` - User accounts and profiles
- `love_notes` - Love notes between partners
- `memories` - Shared memories and moments
- `surprises` - Surprise content and unlocks
- `wishes` - Romantic wishes and requests
- `photo_moments` - Photo gallery and moments

## Troubleshooting

### Connection Issues
- **Authentication failed**: Double-check username and password
- **Network timeout**: Ensure your IP is whitelisted in Network Access
- **DNS resolution**: Try using the SRV connection string format

### Common Errors
- `MongoTimeoutException`: Check network access settings
- `MongoSecurityException`: Verify database user credentials
- `MongoSocketException`: Ensure cluster is running and accessible

### Environment Variables (Optional)
For security, you can use environment variables:
```properties
spring.data.mongodb.uri=${MONGODB_URI}
spring.data.mongodb.database=${MONGODB_DATABASE:whispers_of_us}
```

Then set environment variables:
```bash
export MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/whispers_of_us?retryWrites=true&w=majority"
export MONGODB_DATABASE="whispers_of_us"
```

## Next Steps

1. Start your application
2. The MongoDB collections will be created automatically
3. Use the REST API endpoints to create and manage data
4. Monitor your database usage in MongoDB Atlas dashboard

Need help? Check the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/) or create an issue in this repository. 