import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, FlatList } from 'react-native';
import AddExpense from './addExpense';
import TotalBoard from './totalBoard';
import Expense from './expense';
import MenuDrawer from './menuDrawer';
import { useUser } from '@clerk/clerk-expo';

interface ExpenseType {
  id: string;
  title: string;
  amount: number;
  category: string;
}

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const { user } = useUser();

  const fetchExpenses = async () => {
    try {
      if (!user) return;
      const email = user?.emailAddresses[0]?.emailAddress;
      const response = await fetch(`https://expensebe.onrender.com/get-expenses?email=${email}`);
      const data = await response.json();
      setExpenses(data.map((item: ExpenseType, index: number) => ({ 
        ...item, 
        id: item.id || String(index) 
      })));
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const handleExpenseAdded = () => {
    fetchExpenses();
    setModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      {/* App Bar with Menu Icon */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appTitle}>Expense Tracker</Text>
      </View>

      {/* Menu Drawer */}
      <MenuDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} />

      <AddExpense
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onExpenseAdded={handleExpenseAdded}
      />

      <TotalBoard expenses={expenses} />

      {loading ? (
        <ActivityIndicator size="large" color="#4b9cd3" style={styles.loader} />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Expense expense={item} />}
          contentContainerStyle={styles.list}
        />
      )}
      
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  appBar: {
    height: 60,
    backgroundColor: '#4b9cd3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 20, // Keeps it above other elements
  },
  menuIcon: {
    fontSize: 24,
    color: 'white',
  },
  appTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4b9cd3',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
});

export default HomeScreen;
