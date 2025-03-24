import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define the expense type
interface ExpenseType {
  id: string;
  amount: number;
  title: string;
  category: string;
  // Add other properties as needed
}

// Define props interface for TotalBoard
interface TotalBoardProps {
  expenses: ExpenseType[];
}

const TotalBoard: React.FC<TotalBoardProps> = ({ expenses }) => {
  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Format the amount to 2 decimal places with dollar sign
  const formattedTotal = `$${totalExpenses.toFixed(2)}`;

  return (
    <View style={styles.square}>
      <Text style={styles.label}>Total Expenses</Text>
      <Text style={[styles.text, totalExpenses < 0 && { color: 'red' }]}>{formattedTotal}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    width: width * 0.9, // 90% of screen width
    height: height * 0.3, // 40% of screen height
    backgroundColor: 'beige', // Beige background
    borderRadius: 20, // Rounded corners
    marginHorizontal: width * 0.05, // Centered with equal margins on sides
    marginTop: height * 0.05, // Margin from the top
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    // Add shadow for better visibility
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
  },
  text: {
    color: 'green', // Green text color
    fontSize: 32, // Increased font size for better visibility
    fontWeight: 'bold', // Bold text
  },
});

export default TotalBoard;