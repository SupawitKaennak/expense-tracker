import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

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

  const addTransaction = () => {
    navigation.navigate('AddExpense', {
      onAddTransaction: (transaction: Transaction) => {
        setTransactions((prevTransactions) => [...prevTransactions, transaction]);
      },
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction.id !== id));
  };

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

  const total = totalIncome + totalExpense;

  const data = [
    {
      name: 'Income',
      amount: totalIncome,
      color: '#DE3163',
      legendFontColor: '#333',
      legendFontSize: 15,
      percentage: total > 0 ? ((totalIncome / total) * 100).toFixed(1) : '0.0',
    },
    {
      name: 'Expense',
      amount: totalExpense,
      color: '#6495ED',
      legendFontColor: '#333',
      legendFontSize: 15,
      percentage: total > 0 ? ((totalExpense / total) * 100).toFixed(1) : '0.0',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>
      <TouchableOpacity onPress={addTransaction} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      {/* ส่วนสรุป Income, Expense, และ Balance */}
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

      {/* ส่วนกราฟวงกลม */}
      <View style={styles.pieChartContainer}>
        <Text style={styles.chartTitle}>Income vs Expense Overview</Text>
        <PieChart
          data={data}
          width={Dimensions.get('window').width - 40}
          height={150}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#f5f5f5',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="80"
          absolute
          hasLegend={false}
        />
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.name}: {item.percentage}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* รายการ Transaction */}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 2,
  },
  balanceBox: {
    backgroundColor: '#fffbcc',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  pieChartContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // ช่วยให้ข้อความเลื่อนไปบรรทัดถัดไปเมื่อพื้นที่ไม่พอ
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    marginRight: 5,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  transactionItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#4CAF50',
    fontSize: 16,
  },
  expenseAmount: {
    color: '#F44336',
    fontSize: 16,
  },
  transactionDate: {
    fontSize: 14,
    color: '#999',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default Home;
  