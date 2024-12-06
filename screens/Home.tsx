import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

// ประเภทของข้อมูลรายการ
type Transaction = {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
};

const Home = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigation = useNavigation();

  // ฟังก์ชันการเพิ่มรายการ
  const addTransaction = () => {
    navigation.navigate('AddExpense', {
      onAddTransaction: (transaction: Transaction) => {
        setTransactions((prevTransactions) => [...prevTransactions, transaction]);
      },
    });
  };

  // ฟังก์ชันการลบรายการ
  const deleteTransaction = (id: string) => {
    setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction.id !== id));
  };

  // คำนวณยอดรวม
  const calculateTotals = () => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpense = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  };

  const { totalIncome, totalExpense, balance } = calculateTotals();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>
      <TouchableOpacity onPress={addTransaction} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryValue}>+{totalIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Expense</Text>
          <Text style={styles.summaryValue}>-{totalExpense.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryBox, styles.balanceBox]}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={styles.summaryValue}>{balance.toFixed(2)}</Text>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionName}>{item.name}</Text>
            <Text style={item.type === 'income' ? styles.incomeAmount : styles.expenseAmount}>
              {item.type === 'income' ? `+${item.amount}` : `-${item.amount}`}
            </Text>
            <Text style={styles.transactionDate}>{format(item.date, 'yyyy-MM-dd')}</Text>
            <TouchableOpacity onPress={() => deleteTransaction(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  addButton: { backgroundColor: '#4CAF50', paddingVertical: 15, borderRadius: 5, marginBottom: 20 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryBox: { flex: 1, marginHorizontal: 5, padding: 10, borderRadius: 5, backgroundColor: '#fff', alignItems: 'center', elevation: 2 },
  balanceBox: { backgroundColor: '#fffbcc' },
  summaryLabel: { fontSize: 16, fontWeight: '600', color: '#666' },
  summaryValue: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  transactionItem: { padding: 15, marginBottom: 10, borderRadius: 5, backgroundColor: '#fff', elevation: 1 },
  transactionName: { fontSize: 16, fontWeight: 'bold' },
  incomeAmount: { color: '#4CAF50', fontSize: 16 },
  expenseAmount: { color: '#F44336', fontSize: 16 },
  transactionDate: { fontSize: 14, color: '#999' },
  deleteButton: { marginTop: 10, backgroundColor: '#F44336', padding: 8, borderRadius: 5 },
  deleteButtonText: { color: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 20 },
});

export default Home;
