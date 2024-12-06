import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';

// ประเภทของข้อมูลรายการ
type Transaction = {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
};

const AddExpense = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const navigation = useNavigation();
  const route = useRoute();

  const handleSubmit = () => {
    const newTransaction: Transaction = {
      id: Math.random().toString(),
      name,
      amount: parseFloat(amount),
      type,
      date: new Date(date),
    };

    // ส่งข้อมูลกลับไปยังหน้า Home ผ่าน params
    if (route.params && typeof route.params.onAddTransaction === 'function') {
      route.params.onAddTransaction(newTransaction);
    }

    // กลับไปยังหน้า Home
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Add a New Transaction</Text>
        <Divider style={{ marginVertical: 10 }} />

        {/* ชื่อรายการ */}
        <TextInput
          mode="outlined"
          label="Transaction Name"
          placeholder="Enter transaction name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        {/* จำนวนเงิน */}
        <TextInput
          mode="outlined"
          label="Amount"
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* ประเภท (รายรับ/รายจ่าย) */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Select Type</Text>
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Income" value="income" />
            <Picker.Item label="Expense" value="expense" />
          </Picker>
        </View>

        {/* วันที่ */}
        <TextInput
          mode="outlined"
          label="Date"
          placeholder="Enter date (yyyy-mm-dd)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />

        {/* ปุ่มบันทึก */}
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Save Transaction
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555555',
  },
  picker: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default AddExpense;
