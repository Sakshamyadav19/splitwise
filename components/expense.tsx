import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExpenseProps {
  expense: {
    title: string;
    category: string;
    amount: number;
  };
}

const ExpenseComponent: React.FC<ExpenseProps> = ({ expense }) => {
  const { title, category, amount } = expense;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💵</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.category} numberOfLines={1}>{category}</Text>
      </View>
      <Text style={[styles.amount, amount < 0 && { color: 'red' }]}>
        ${amount.toFixed(2)}
      </Text>
    </View>
  );
};

const Expense = memo(ExpenseComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#4b9cd3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b9cd3',
    marginLeft: 12,
  },
});

export default Expense;
