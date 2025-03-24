import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import Toast from 'react-native-toast-message';

interface AddExpenseProps {
  visible: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
}

interface FormErrors {
  title: boolean;
  amount: boolean;
  category: boolean;
}

const AddExpense: React.FC<AddExpenseProps> = ({ visible, onClose, onExpenseAdded }) => {
  const { user } = useUser();
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('home');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({
    title: false,
    amount: false,
    category: false,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      // Reset form state when modal opens
      setTitle('');
      setAmount('');
      setCategory('home');
      setShowDropdown(false);
      setErrors({
        title: false,
        amount: false,
        category: false,
      });
      setIsSubmitting(false);
    }
  }, [visible]);

  const validateForm = (): boolean => {
    const newErrors = {
      title: title.trim() === '',
      amount: amount.trim() === '',
      category: category.trim() === '',
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://10.0.0.173:5001/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          amount: parseFloat(amount),
          category,
          email: user?.emailAddresses[0]?.emailAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Expense added successfully',
        position: 'bottom',
        visibilityTime: 3000,
      });
      
      onExpenseAdded();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add expense. Please try again.',
        position: 'bottom',
        visibilityTime: 4000,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(false);
  };

  const getInputStyle = (fieldName: keyof FormErrors) => ({
    ...styles.input,
    borderColor: errors[fieldName] ? '#ff0000' : '#ccc',
  });

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={() => {
        setShowDropdown(false);
        onClose();
      }}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={getInputStyle('title')}
                placeholder="Enter expense title"
                value={title}
                onFocus={handleInputFocus}
                onChangeText={(text) => {
                  setTitle(text);
                  setErrors(prev => ({ ...prev, title: false }));
                }}
              />

              <Text style={styles.label}>Amount</Text>
              <View style={[styles.amountContainer, { borderColor: errors.amount ? '#ff0000' : '#ccc' }]}>
                <Text style={styles.dollarIcon}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onFocus={handleInputFocus}
                  onChangeText={(text) => {
                    setAmount(text);
                    setErrors(prev => ({ ...prev, amount: false }));
                  }}
                />
              </View>

              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, { borderColor: errors.category ? '#ff0000' : '#ccc' }]}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowDropdown(prev => !prev);
                }}
              >
                <Text style={styles.dropdownText}>{category}</Text>
              </TouchableOpacity>
              
              {showDropdown && (
                <ScrollView
                  style={styles.dropdownMenu}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {['home', 'food', 'shopping', 'rent', 'misc'].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategory(item);
                        setErrors(prev => ({ ...prev, category: false }));
                        setShowDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  { opacity: isSubmitting ? 0.7 : 1 }
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  dollarIcon: {
    fontSize: 18,
    color: '#000',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
  },
  dropdownButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownMenu: {
    width: '100%',
    maxHeight: 120, // Limit dropdown height to show about 3 items
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  submitButton: {
    width: '90%',
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddExpense;
