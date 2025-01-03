import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView , SafeAreaView} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart  } from 'react-native-chart-kit'; 

const screenWidth = Dimensions.get('window').width; 

const Graph = () => {
   return (
      <ScrollView contentContainerStyle={styles.scrollView}>
            <Content />
      </ScrollView>
    );
  };

  export function Content() {
    interface Tought {
      id: number;
      level: number;
      created: Date;
    }

    const [thoughts, setThoughts] = useState<Tought[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
    const handleDateChange = (event, date) => {
      setDatePickerVisibility(false);
      if (date) setSelectedDate(date);
    };
  

      // Prepare chart data
    const chartData = {
      labels: thoughts.map((item) => item.created.split('-').slice(1).join('/')),
      datasets: [
        {
          data: thoughts.map((item) => item.level),
          colors: (opacity = 1) =>
            thoughts.map((item) => (item.level > 3 ? `rgba(219, 3, 99, ${opacity})` : `rgba(144, 200, 94, ${opacity})`)),
        },
      ],
    }; 

    useEffect(() => {
      const fetchThoughts = async () => {
        if (selectedDate) {
          const startDate = new Date(selectedDate);
          const endDate = new Date(selectedDate);
  
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
  
          try {
            const result = await getThoughtsByDate(startDate.toISOString(), endDate.toISOString());
            setThoughts(result);
          } catch (error) {
            console.error('Error fetching thoughts:', error);
            setThoughts([]); 
          }
        }
      };
      fetchThoughts();
    }, [selectedDate]);
  
    return(
      <SafeAreaView>
           <View style={styles.container}>
            <Text style={styles.title}>Your Thinking Graph</Text>
            <View style={styles.description}>
              <Text>The daily graph shows the intensity of your thoughts, by date.</Text>
            </View>
            {/* Date Picker */}
             <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.customButton}>
                <Text style={styles.buttonText}>
                  Select Date
                </Text>
            </TouchableOpacity>
            {isDatePickerVisible && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
            <View style={styles.chartContainer}>
              {thoughts.length === 0 ? (
                <Text style={styles.noDataText}>No records to show</Text>
              ) : (
                <LineChart
                  data={chartData}
                  width={screenWidth - 40} // Responsive width
                  height={220}
                  fromZero
                  chartConfig={{
                    backgroundColor: '#f9f9f9',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#f9f9f9',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={styles.chart}
                />
              )}
            </View>
          </View>
      </SafeAreaView>
    );
  }

  //Fetch the specified dates info
  export const getThoughtsByDate = async (startDate, endDate) => {
    try {
      const db = useSQLiteContext();
      const result = await db.getAllAsync('SELECT * FROM thoughts WHERE created BETWEEN ? AND ?;',
            [startDate, endDate]);
      return result;
    } catch (error) {
      console.error('Error in getThoughtsByDate:', error);
      throw error;
    }
  };
  

const styles = StyleSheet.create({
  scrollView: {
    padding: 16,
    backgroundColor: '#F3EFF0',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#999999',
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  datePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  customButton: {
    backgroundColor: '#bf4da2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Graph;
