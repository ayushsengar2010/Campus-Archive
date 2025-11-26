import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from '../models/Assignment.model.js';
import Submission from '../models/Submission.model.js';

// Load environment variables
dotenv.config();

const clearTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Find and delete assignments that belong to the old seed classrooms
    console.log('🗑️  Clearing old seed assignments...');
    const deletedAssignments = await Assignment.deleteMany({
      code: { $in: ['CS401', 'CS301'] }
    });
    console.log(`✅ Deleted ${deletedAssignments.deletedCount} old assignments`);

    // Delete submissions for those assignments
    console.log('🗑️  Clearing old seed submissions...');
    const deletedSubmissions = await Submission.deleteMany({
      status: { $in: ['pending', 'accepted'] }
    });
    console.log(`✅ Deleted ${deletedSubmissions.deletedCount} old submissions`);

    console.log('\n🎉 Test data cleared successfully!');
    console.log('Your new classroom (ASD - CSE123) is now clean.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
};

clearTestData();
