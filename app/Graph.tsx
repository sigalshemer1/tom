import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, SafeAreaView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Graph = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Content />
    </SafeAreaView>
  );
};

export function Content() {
  interface Thought {
    id: number;
    level: number;
    created: string; // Used for x-axis labels.
  }

  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);  // Time Picker state
  const [tooltipData, setTooltipData] = useState<string | null>(null);
  const db = useSQLiteContext();

  const handleDateChange = (event, date) => {
    setDatePickerVisibility(false);
    if (date) setSelectedDate(date);
  };

  const handleTimeChange = (event, time) => {
    setTimePickerVisibility(false);
    if (time) setSelectedDate(time);
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
          const formattedData = result.map((item) => ({
            ...item,
            created: item.created.split('T')[1].split(':')[0] + ':00', // Keep hours for display
          }));
          setThoughts(formattedData);
        } catch (error) {
          console.error('Error fetching thoughts:', error);
          setThoughts([]);
        }
      }
    };
    fetchThoughts();
  }, [selectedDate]);

  const getThoughtsByDate = async (startDate, endDate) => {
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM thoughts WHERE created BETWEEN ? AND ?;',
        [startDate, endDate]
      );
      return result;
    } catch (error) {
      console.error('Error in getThoughtsByDate:', error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Thinking Graph</Text>
        <View style={styles.description}>
          <Text>The daily graph shows the intensity of your thoughts, by date.</Text>
        </View>

        {/* Date Picker */}
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.customButton}>
          <Text style={styles.buttonText}>Select Date</Text>
        </TouchableOpacity>
        
        {/* Time Picker */}
        <TouchableOpacity onPress={() => setTimePickerVisibility(true)} style={styles.customButton}>
          <Text style={styles.buttonText}>Select Time</Text>
        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
        
        {isTimePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        {/* Graph Container */}
        <View style={styles.chartContainer}>
          {thoughts.length === 0 ? (
            <Text style={styles.noDataText}>No records to show</Text>
          ) : (
            <View style={styles.chartWrapper}>
              <LineChart
                data={{
                  labels: thoughts.map((item) => item.created), // Show the time labels
                  datasets: [
                    {
                      data: thoughts.map((item) => item.level), // Y-axis data
                    },
                  ],
                }}
                width={screenWidth - 40} // Chart width
                height={250} // Chart height
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#e3c7cb',
                  backgroundGradientFrom: '#d2b1c1',
                  backgroundGradientTo: '#ad899d',
                  decimalPlaces: 0, // Show integer values
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#715868',
                  },
                }}
                bezier // Smooth curves
                onDataPointClick={(data) => {
                  const selectedData = thoughts[data.index];
                  const time = selectedData.created.split('T')[1].split(':').slice(0, 2).join(':'); // Get hh:mm format
                  // Show the tooltip with the time
                  setTooltipData(`Time: ${time}`);
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />

              {tooltipData && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{tooltipData}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F3EFF0',
  },
  scrollView: {
    flex: 1,
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
  description: {
    marginBottom: 20,
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
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  chartWrapper: {
    height: 300,
    width: '100%',
  },
  noDataText: {
    fontSize: 16,
    color: '#999999',
  },
  tooltip: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: '#444',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    zIndex: 9999,
  },
  
  tooltipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },  
});

export default Graph;
