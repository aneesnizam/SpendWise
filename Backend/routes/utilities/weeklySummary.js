import cron from 'node-cron';
import User from '../models/userModel.js';
import Expense from '../models/expenseModel.js';
import transporter from './transporter.js';
import { generateWeeklySummaryEmail } from './templates.js';

const getStartAndEndOfWeek = () => {
  const today = new Date();
  const start = new Date(today.setDate(today.getDate() - today.getDay())); 
  const end = new Date(start);
  end.setDate(start.getDate() + 6); 
  return { start, end };
};

const sendWeeklySummaries = async () => {
  const users = await User.find({getSummary: true});

  const { start, end } = getStartAndEndOfWeek();

  for (const user of users) {
    const expenses = await Expense.aggregate([
      {
        $match: {
          user: user._id,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const total = expenses.reduce((sum, item) => sum + item.total, 0);

    const html = generateWeeklySummaryEmail(user.name, expenses.map(e => ({
      category: e._id,
      total: e.total,
    })), total);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Your Weekly Expense Summary',
      html,
    });

    console.log(`Summary sent to ${user.email}`);
  }
};


cron.schedule('0 8 * * 0', sendWeeklySummaries);