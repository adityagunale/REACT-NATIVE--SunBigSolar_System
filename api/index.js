/* api/index.js */
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const BookedCall = require('./models/bookedCall');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileSet = require('./models/FileSet'); // Ensure this is imported
const Loan = require('./models/loan'); // Ensure this is imported
const app = express();
const port = 8000;
const JWT_SECRET = "Q$r2K6W8n!jCW%Zk"; // Define your JWT secret

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(
    "mongodb+srv://aadigunale2002:admin@cluster0.rin0d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to Mongo DB");
    }).catch((err) => {
        console.log("Error connected to Mongo DB", err);
    });

app.listen(port, () => {
    console.log("Server running on port 8000");
});

const User = require("./models/user");

// NodeMailer Configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "adityagunale16@gmail.com",
        pass: "oiax ywbx wwgt jnby",
    },
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Endpoint to get user details
app.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            tele: user.tele,
            password: user.password
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to update user details
app.put('/user', authenticateToken, async (req, res) => {
    const { name, email, tele, password } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.tele = tele || user.tele;
        user.password = password || user.password;

        await user.save();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint for registration of the user
app.post("/register", (req, res) => {
    const { name, email, tele, password } = req.body;

    const newUser = new User({ name, email, tele, password });

    newUser.save().then(() => {
        res.status(200).json({ message: "User registered successfully" });
    }).catch((err) => {
        console.log("Error registering user", err);
        res.status(500).json({ message: "Error registering user!" });
    });
});

// Function to create a token for the user
const createToken = (userId) => {
    const payload = { userId: userId };
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
};

// Endpoint for logging in of user
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: "Email and Password are required" });
    }

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not Found" });
        }

        if (user.password != password) {
            return res.status(404).json({ message: "Invalid Password!" });
        }
        const token = createToken(user._id);
        res.status(200).json({ token });
    }).catch((error) => {
        console.log("Error in finding the user", error);
        res.status(500).json({ message: "Internal server Error!" });
    });
});

// Endpoint to request a password reset
app.post('/request-reset-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = resetCode;
        user.resetCodeExpiry = new Date(Date.now() + 30 * 60000);
        await user.save();

        const mailOptions = {
            from: 'adityagunale16@gmail.com',
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetCode}\nThis code will expire in 30 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Reset code sent to email' });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to reset the password
app.post('/reset-password', async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.resetCode || user.resetCode !== resetCode) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        if (user.resetCodeExpiry && user.resetCodeExpiry < new Date()) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        user.password = newPassword;
        user.resetCode = null;
        user.resetCodeExpiry = null;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
});

// Endpoint to request OTP for signup using phone.email
app.post('/request-signup-otp', async (req, res) => {
    const { tele } = req.body;

    try {
        const response = await axios.post('https://api.phone.email/send-otp', {
            phoneNumber: tele
        }, {
            headers: {
                'Authorization': 'YjaAupKdAkpBX7RUoBJJvGfr07Tp059M',
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            res.status(200).json({ message: 'OTP sent to your mobile number' });
        } else {
            console.error('phone.email API error:', response.data);
            res.status(500).json({ message: 'Failed to send OTP' });
        }

    } catch (error) {
        console.error('Error requesting OTP:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to verify OTP using phone.email
app.post('/signup', async (req, res) => {
    const { name, tele, otp } = req.body;

    try {
        const response = await axios.post('https://api.phone.email/verify-otp', {
            phoneNumber: tele,
            otp: otp
        }, {
            headers: {
                'Authorization': 'YjaAupKdAkpBX7RUoBJJvGfr07Tp059M',
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            let user = await User.findOne({ tele });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            user = new User({ name, tele, password: 'defaultPassword' });
            await user.save();

            const token = createToken(user._id);
            res.status(200).json({ token, message: 'Signup successful' });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }

    } catch (error) {
        console.error('Error during signup:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to handle booking a call
app.post('/book-call', async (req, res) => {
    const { name, phone, email, address, landmark, solarSystemSize, scheduleDate } = req.body;

    if (!name || !phone || !email || !address || !landmark || !solarSystemSize || !scheduleDate) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newBooking = new BookedCall({
            name,
            phone,
            email,
            address,
            landmark,
            solarSystemSize,
            scheduleDate: new Date(scheduleDate)
        });

        await newBooking.save();
        res.status(200).json({ message: 'Call booked successfully' });
    } catch (error) {
        console.error('Error booking call:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileType = file.mimetype.startsWith('image/') ? 'images' : 'pdfs';
        const uploadDir = path.join(__dirname, "uploads", fileType);

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedPDFType = 'application/pdf';

    if (allowedImageTypes.includes(file.mimetype) || file.mimetype === allowedPDFType) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF) and PDFs are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5 // Maximum 5 files per upload
    }
});

// upload endpoint
// upload endpoint
app.post("/upload", upload.array("files", 5), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: "No files uploaded" });
      }
  
      // Extract userId from JWT token
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "Authorization token required" });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
  
      if (!userId) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
  
      // Map uploaded files to include documentType (if needed)
      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        fileType: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
        mimeType: file.mimetype,
        url: `${req.protocol}://${req.get('host')}/uploads/${file.mimetype.startsWith('image/') ? 'images' : 'pdfs'}/${file.filename}`,
        path: file.path,
        size: file.size
      }));
  
      // Update or create FileSet document for the specific user
      const fileSet = await FileSet.findOneAndUpdate(
        { userId }, // Query by userId
        { $push: { files: { $each: uploadedFiles } } },
        { upsert: true, new: true }
      );
  
      res.json({
        success: true,
        message: `Successfully uploaded ${req.files.length} file(s)`,
        files: uploadedFiles
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "File upload failed",
        error: error.message
      });
    }
  });
// In your Express server (api/index.js)
// Upload endpoint in api/index.js

// Fetch files endpoint
// Fetch all files for a user// Fetch all files for a user
app.get("/files", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const fileSet = await FileSet.findOne({ userId });
      if (!fileSet) {
        return res.status(404).json({ 
          success: false, 
          message: "No files found for this user" 
        });
      }
      
      res.json({ 
        success: true, 
        data: fileSet.files.map(file => ({
          originalName: file.originalName,
          url: file.url
        }))
      });
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message 
      });
    }
  });
  
  



// Get files by type
app.get("/files/type/:fileType", authenticateToken, async (req, res) => {
    try {
      const { fileType } = req.params;
      const userId = req.user.userId;
      
      if (!['image', 'pdf'].includes(fileType)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid file type. Must be 'image' or 'pdf'" 
        });
      }
      
      const fileSet = await FileSet.findOne({ userId });
      if (!fileSet) {
        return res.status(404).json({ 
          success: false, 
          message: "No files found for this user" 
        });
      }
      
      const filteredFiles = fileSet.files.filter(file => file.fileType === fileType);
      
      res.json({ 
        success: true, 
        data: filteredFiles 
      });
    } catch (error) {
      console.error("Error fetching files by type:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message 
      });
    }
  });
  
  // Get files by document type
  app.get("/files/document-type/:documentType", authenticateToken, async (req, res) => {
    try {
      const { documentType } = req.params;
      const userId = req.user.userId;
      
      const fileSet = await FileSet.findOne({ userId });
      if (!fileSet) {
        return res.status(404).json({ 
          success: false, 
          message: "No files found for this user" 
        });
      }
      
      const filteredFiles = fileSet.files.filter(file => file.documentType === documentType);
      
      res.json({ 
        success: true, 
        data: filteredFiles 
      });
    } catch (error) {
      console.error("Error fetching files by document type:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message 
      });
    }
  });
  
  // Enhanced file delete with proper authorization
  app.delete("/files/:fileId", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { fileId } = req.params;
      
      // Find the file set and ensure it belongs to the authenticated user
      const fileSet = await FileSet.findOne({ userId });
      
      if (!fileSet) {
        return res.status(404).json({ 
          success: false, 
          message: "No files found for this user" 
        });
      }
      
      // Find the specific file in the user's file set
      const fileToDelete = fileSet.files.id(fileId);
      
      if (!fileToDelete) {
        return res.status(404).json({ 
          success: false, 
          message: "File not found" 
        });
      }
      
      // Delete the physical file from the server
      if (fileToDelete.path) {
        fs.unlink(fileToDelete.path, (err) => {
          if (err) {
            console.error("Error deleting file from disk:", err);
          }
        });
      }
      
      // Remove the file from the FileSet document
      fileSet.files.pull(fileId);
      await fileSet.save();
      
      res.json({ 
        success: true, 
        message: "File deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error", 
        error: error.message 
      });
    }
  });

// Loan Endpoints
  


// Loan Endpoints
app.post('/loan', authenticateToken, async (req, res) => {
    const { 
        name, 
        phone, 
        email, 
        address, 
        landmark, 
        solarSystemSize,
        occupation,
        annualincome 
    } = req.body;

    // Validate all required fields
    if (!name || !phone || !email || !address || !landmark || !solarSystemSize || !occupation || !annualincome) {
        return res.status(400).json({ 
            success: false,
            message: 'All fields are required.',
            missingFields: Object.entries({
                name,
                phone,
                email,
                address,
                landmark,
                solarSystemSize,
                occupation,
                annualincome
            }).filter(([_, value]) => !value).map(([key]) => key)
        });
    }

    try {
        const userId = req.user.userId; // Extract userId from authenticated user
        const newLoan = new Loan({
            name,
            phone,
            email,
            address,
            landmark,
            solarSystemSize,
            occupation,
            annualincome,
            userId
        });

        await newLoan.save();
        
        res.status(200).json({ 
            success: true,
            message: 'Loan application submitted successfully',
            loan: newLoan
        });
    } catch (error) {
        console.error('Error Applying Loan:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: error.message 
        });
    }
});

app.post("/uploadLoanDeatails", authenticateToken, upload.array("files", 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const userId = req.user.userId; // Extract userId from authenticated user

        // Map uploaded files to include documentType (if needed)
        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            fileType: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
            mimeType: file.mimetype,
            url: `${req.protocol}://${req.get('host')}/uploads/${file.mimetype.startsWith('image/') ? 'images' : 'pdfs'}/${file.filename}`,
            path: file.path,
            size: file.size
        }));

        // Update or create Loan document for the specific user
        const loan = await Loan.findOneAndUpdate(
            { userId }, // Query by userId
            { $push: { files: { $each: uploadedFiles } } },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: `Successfully uploaded ${req.files.length} file(s)`,
            files: uploadedFiles
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "File upload failed",
            error: error.message
        });
    }
});



// Endpoint to fetch loan basic details
app.get('/loan/details', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Extract userId from authenticated user
        const loanDetails = await Loan.findOne({ userId });

        if (!loanDetails) {
            return res.status(404).json({
                success: false,
                message: 'No loan details found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: loanDetails
        });
    } catch (error) {
        console.error('Error fetching loan details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Endpoint to fetch loan documents
app.get('/loan/documents', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Extract userId from authenticated user
        const loan = await Loan.findOne({ userId });

        if (!loan || !loan.files || loan.files.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No loan documents found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: loan.files
        });
    } catch (error) {
        console.error('Error fetching loan documents:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});


// Endpoint to update loan details
app.put('/loan/details', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const updatedDetails = req.body;
  
      const loan = await Loan.findOneAndUpdate({ userId }, updatedDetails, { new: true });
  
      if (!loan) {
        return res.status(404).json({ success: false, message: 'Loan details not found' });
      }
  
      res.status(200).json({ success: true, message: 'Loan details updated successfully', data: loan });
    } catch (error) {
      console.error('Error updating loan details:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  

// Endpoint to fetch project status and titles
app.get('/project-status', (req, res) => {
    const projectStatus = [
        { step: 1, title: 'Solar Proposal Finalised', status: 'completed' },
        { step: 2, title: 'Work Order Signed', status: 'completed' },
        { step: 3, title: 'Load Extension Received', status: 'completed' },
        { step: 4, title: 'Technical Feasibility Report Received', status: 'completed' },
        { step: 5, title: 'Sanction Letter Received', status: 'completed' },
        { step: 6, title: 'Installation Start', status: 'completed' },
        { step: 7, title: 'Installation Complete', status: 'pending' },
        { step: 8, title: 'Testing and Commissioning Done', status: 'pending' },
    ];
    res.json(projectStatus);
});

// Endpoint for solar quote calculation
app.post('/calculate-solar-quote', authenticateToken, async (req, res) => {
    try {
        const {
            connectionType,
            contractLoad,
            monthlyUnits,
            selectedCity,
            roofArea,
            areaUnit
        } = req.body;

        // Validate required fields
        if (!connectionType || !contractLoad || !monthlyUnits || !selectedCity || !roofArea) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                missingFields: Object.entries({
                    connectionType,
                    contractLoad,
                    monthlyUnits,
                    selectedCity,
                    roofArea
                }).filter(([_, value]) => !value).map(([key]) => key)
            });
        }

        // Convert roof area to square meters if needed
        let roofAreaInSqM = areaUnit === 'sq. ft' ? roofArea * 0.092903 : roofArea;

        // Calculate solar system size based on monthly units
        // Assuming average daily sunlight hours of 5.5 and system efficiency of 75%
        const dailyUnits = monthlyUnits / 30;
        const systemSize = (dailyUnits * 1000) / (5.5 * 0.75); // in watts

        // Calculate number of panels needed (assuming 400W panels)
        const numberOfPanels = Math.ceil(systemSize / 400);

        // Calculate required roof area (assuming 1.6 sqm per panel)
        const requiredRoofArea = numberOfPanels * 1.6;

        // Check if roof area is sufficient
        const isRoofAreaSufficient = roofAreaInSqM >= requiredRoofArea;

        // Calculate estimated cost (assuming ₹40 per watt)
        const estimatedCost = systemSize * 40;

        // Calculate annual savings (assuming 30% reduction in electricity bill)
        const annualSavings = (monthlyUnits * 12 * 8) * 0.3; // Assuming ₹8 per unit

        // Calculate payback period in years
        const paybackPeriod = estimatedCost / annualSavings;

        // Calculate carbon offset (assuming 0.7 kg CO2 per kWh)
        const annualCarbonOffset = (monthlyUnits * 12) * 0.7;

        // Prepare response
        const quoteDetails = {
            systemSize: Math.round(systemSize / 1000 * 10) / 10, // in kW
            numberOfPanels,
            requiredRoofArea: Math.round(requiredRoofArea * 10) / 10,
            isRoofAreaSufficient,
            estimatedCost: Math.round(estimatedCost),
            annualSavings: Math.round(annualSavings),
            paybackPeriod: Math.round(paybackPeriod * 10) / 10,
            annualCarbonOffset: Math.round(annualCarbonOffset),
            city: selectedCity,
            connectionType,
            contractLoad: parseFloat(contractLoad),
            monthlyUnits: parseFloat(monthlyUnits),
            roofArea: parseFloat(roofArea),
            areaUnit
        };

        // Save quote details to user's profile if needed
        const userId = req.user.userId;
        await User.findByIdAndUpdate(userId, {
            $push: {
                solarQuotes: {
                    ...quoteDetails,
                    createdAt: new Date()
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Solar quote calculated successfully',
            data: quoteDetails
        });

    } catch (error) {
        console.error('Error calculating solar quote:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Endpoint to fetch user's solar quote history
app.get('/solar-quotes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('solarQuotes');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user.solarQuotes || []
        });

    } catch (error) {
        console.error('Error fetching solar quotes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});